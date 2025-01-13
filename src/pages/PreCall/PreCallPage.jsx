import { Camera, Mic, Play, Square, Volume2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCallApi,
  getCallByChannelApi,
  joinCallApi,
} from '../../apis/Api';

const PreCallSetupPage = () => {
  const navigate = useNavigate();
  // State management for devices and settings
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [mediaStream, setMediaStream] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [availableMics, setAvailableMics] = useState([]);
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [videoQuality, setVideoQuality] = useState(720);
  const [volume, setVolume] = useState(100);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for media elements and processing
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio('/assests/audios/test-sound.mp3'));
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const { channelId } = useParams();
  const [call, setCall] = useState(null);
  const [isCallOn, setIsCallOn] = useState(false);

  // Load available media devices
  const loadDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter((device) => device.kind === 'videoinput');
      const mics = devices.filter((device) => device.kind === 'audioinput');
      const speakers = devices.filter(
        (device) => device.kind === 'audiooutput'
      );

      setAvailableCameras(cameras);
      setAvailableMics(mics);
      setAvailableSpeakers(speakers);

      // Set default devices
      if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
      if (mics.length > 0) setSelectedMic(mics[0].deviceId);
      if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);
    } catch (err) {
      console.error('Error loading devices:', err);
      setError('Failed to load media devices');
    }
  };

  // Initial setup and cleanup
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(() => {
        loadDevices();
      })
      .catch((err) => {
        console.error('Error getting media permissions:', err);
        setError('Failed to get media permissions');
      });

    getCallByChannelApi(channelId)
      .then((res) => {
        setCall(res.data.data);
        setIsCallOn(res.data.isCallActive);
      })
      .catch((err) => {
        console.error('Error fetching call:', err);
        setError('Failed to fetch call information');
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [channelId]);

  // Handle call initialization
  const handleCallSetup = async (isJoining = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isJoining) {
        response = await joinCallApi(call[0]._id);
      } else {
        response = await createCallApi({
          channelId,
          callType: 'video',
        });
      }

      const { success, data, message } = response.data;

      if (success) {
        // Navigate to call page with necessary data
        navigate(`/call/${channelId}`, {
          state: {
            token: data.token,
            roomId: data.roomId,
            callId: data.callId,
            host: data.callDetails.host,
            micEnabled: isMicOn,
            webcamEnabled: isCameraOn,
            selectedDevices: {
              camera: selectedCamera,
              microphone: selectedMic,
              speaker: selectedSpeaker,
            },
            videoQuality,
          },
        });
      } else {
        throw new Error(message || 'Failed to initialize call');
      }
    } catch (err) {
      console.error('Call setup error:', err);
      setError(err.message || 'Failed to setup call');
    } finally {
      setIsLoading(false);
    }
  };

  // Camera controls
  const startCamera = async () => {
    try {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: videoQuality === 720 ? 1280 : 1920 },
          height: { ideal: videoQuality },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraOn(true);
    } catch (error) {
      console.error('Error starting camera:', error);
      setError('Failed to start camera');
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  // Microphone testing
  const startMicrophoneTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMic ? { exact: selectedMic } : undefined },
      });

      // Set up audio context and analyzer
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Configure analyzer
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Start recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(recordedChunksRef.current, {
          type: 'audio/webm',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Update audio level meter
      const updateAudioLevel = () => {
        if (!isRecording) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average);

        requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error starting microphone test:', error);
    }
  };

  const stopMicrophoneTest = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  // Speaker testing
  const toggleSpeakerTest = () => {
    if (isSpeakerTesting) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeakerTesting(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsSpeakerTesting(true);
    }
  };

  // Device change handlers
  const handleCameraChange = async (event) => {
    const newCameraId = event.target.value;
    setSelectedCamera(newCameraId);

    if (isCameraOn) {
      stopCamera();
      setSelectedCamera(newCameraId);
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  const handleMicChange = (event) => {
    setSelectedMic(event.target.value);
    if (isRecording) {
      stopMicrophoneTest();
      setTimeout(() => {
        startMicrophoneTest();
      }, 100);
    }
  };

  const handleSpeakerChange = (event) => {
    const newSpeakerId = event.target.value;
    setSelectedSpeaker(newSpeakerId);

    if (audioRef.current && audioRef.current.setSinkId) {
      audioRef.current.setSinkId(newSpeakerId).catch((err) => {
        console.error('Error setting audio output device:', err);
      });
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl'>
        {error && (
          <div className='mb-4 p-4 bg-red-500 text-white rounded-lg'>
            {error}
          </div>
        )}

        <div className='bg-gray-800 rounded-lg mb-4 p-6'>
          {/* Video preview */}
          <div className='relative aspect-video bg-black rounded-lg overflow-hidden'>
            <video
              ref={videoRef}
              className='w-full h-full object-cover'
              autoPlay
              playsInline
              muted
            />

            {!isCameraOn && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-gray-400'>The camera is off</span>
              </div>
            )}

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isCameraOn
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={toggleCamera}>
                <Camera className='w-6 h-6' />
              </button>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isMicOn
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={toggleMic}>
                <Mic className='w-6 h-6' />
              </button>
            </div>
          </div>

          <div className='mt-4 space-y-4'>
            {/* Camera and video quality settings */}
            <div className='flex gap-4'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Camera
                </label>
                <select
                  value={selectedCamera}
                  onChange={handleCameraChange}
                  className='w-full bg-gray-700 rounded-md border-gray-600 text-white py-2 px-3'>
                  {availableCameras.map((camera) => (
                    <option
                      key={camera.deviceId}
                      value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Video Quality
                </label>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(parseInt(e.target.value))}
                  className='w-full bg-gray-700 rounded-md border-gray-600 text-white py-2 px-3'>
                  <option value={720}>720p</option>
                  <option value={1080}>1080p</option>
                </select>
              </div>
            </div>

            {/* Audio settings */}
            <div className='space-y-4'>
              <div className='flex gap-4'>
                {/* Microphone selection and testing */}
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Microphone
                  </label>
                  <div className='flex gap-2'>
                    <select
                      value={selectedMic}
                      onChange={handleMicChange}
                      className='flex-1 bg-gray-700 rounded-md border-gray-600 text-white py-2 px-3'>
                      {availableMics.map((mic) => (
                        <option
                          key={mic.deviceId}
                          value={mic.deviceId}>
                          {mic.label ||
                            `Microphone ${mic.deviceId.slice(0, 8)}`}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={
                        isRecording ? stopMicrophoneTest : startMicrophoneTest
                      }
                      className={`px-4 rounded-md flex items-center gap-2 ${
                        isRecording
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}>
                      {isRecording ? (
                        <Square className='w-4 h-4' />
                      ) : (
                        <Play className='w-4 h-4' />
                      )}
                      <span>{isRecording ? 'Stop' : 'Test'}</span>
                    </button>
                  </div>
                  {isRecording && (
                    <div className='mt-2 h-2 bg-gray-700 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-blue-600 transition-all duration-100'
                        style={{ width: `${(audioLevel / 255) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Speaker selection and testing */}
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Speaker
                  </label>
                  <div className='flex gap-2'>
                    <select
                      value={selectedSpeaker}
                      onChange={handleSpeakerChange}
                      className='flex-1 bg-gray-700 rounded-md border-gray-600 text-white py-2 px-3'>
                      {availableSpeakers.map((speaker) => (
                        <option
                          key={speaker.deviceId}
                          value={speaker.deviceId}>
                          {speaker.label ||
                            `Speaker ${speaker.deviceId.slice(0, 8)}`}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={toggleSpeakerTest}
                      className={`px-4 rounded-md flex items-center gap-2 ${
                        isSpeakerTesting
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}>
                      {isSpeakerTesting ? (
                        <Square className='w-4 h-4' />
                      ) : (
                        <Play className='w-4 h-4' />
                      )}
                      <span>{isSpeakerTesting ? 'Stop' : 'Test'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Volume control */}
              <div className='flex items-center gap-4'>
                <Volume2 className='w-5 h-5 text-gray-400' />
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={volume}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setVolume(newValue);
                    if (audioRef.current) {
                      audioRef.current.volume = newValue / 100;
                    }
                  }}
                  className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
                />
                <span className='text-sm text-gray-300 min-w-[35px]'>
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex gap-4'>
          <button
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => handleCallSetup(isCallOn)}
            disabled={isLoading}>
            {isLoading
              ? 'Initializing...'
              : isCallOn
              ? 'Join Call'
              : 'Create Call'}
          </button>
          <button
            className='flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50'
            onClick={() => navigate('/')}
            disabled={isLoading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreCallSetupPage;
