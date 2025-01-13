import { useMeeting } from '@videosdk.live/react-sdk';
import { Camera, Mic, MonitorUp, PhoneOff, StopCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { leaveCallById } from '../../apis/Api';

const Controls = ({ callId, host, user }) => {
  const {
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    startRecording,
    stopRecording,
    leave,
    meetingId,
    localParticipant,
    micOn,
    webcamOn,
  } = useMeeting();

  const [isRecording, setIsRecording] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Controls state:', {
      meetingId,
      localParticipantId: localParticipant?.id,
      micOn,
      webcamOn,
      isRecording,
      isSharingScreen,
    });
  }, [
    meetingId,
    localParticipant,
    micOn,
    webcamOn,
    isRecording,
    isSharingScreen,
  ]);

  const handleMicToggle = () => {
    toggleMic();
    console.log('Toggling mic:', { micOn });
  };

  const handleWebcamToggle = () => {
    toggleWebcam();
    console.log('Toggling webcam:', { webcamOn });
  };

  const handleScreenShare = async () => {
    try {
      await toggleScreenShare();
      setIsSharingScreen(!isSharingScreen);
      console.log('Toggling screen share:', {
        isSharingScreen: !isSharingScreen,
      });
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
    console.log('Toggling recording:', { isRecording: !isRecording });
  };

  const handleLeave = () => {
    leave();
    leaveCallById(callId)
      .then((res) => {
        console.log('Leaved call');
        window.location.href = '/dashboard';
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='bg-gray-900 p-4 flex justify-center space-x-4'>
      <button
        onClick={handleMicToggle}
        className={`p-2 rounded-full ${
          micOn
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}>
        <Mic className={`w-6 h-6 ${micOn ? 'text-white' : 'text-white'}`} />
      </button>

      <button
        onClick={handleWebcamToggle}
        className={`p-2 rounded-full ${
          webcamOn
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}>
        <Camera
          className={`w-6 h-6 ${webcamOn ? 'text-white' : 'text-white'}`}
        />
      </button>

      <button
        onClick={handleScreenShare}
        className={`p-2 rounded-full ${
          isSharingScreen
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}>
        <MonitorUp className='w-6 h-6 text-white' />
      </button>

      <button
        onClick={handleRecording}
        className={`p-2 rounded-full ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}>
        <StopCircle className='w-6 h-6 text-white' />
      </button>

      <button
        onClick={handleLeave}
        className='p-2 rounded-full bg-red-600 hover:bg-red-700'>
        <PhoneOff className='w-6 h-6 text-white' />
      </button>
    </div>
  );
};

export default Controls;
