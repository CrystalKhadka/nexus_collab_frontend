import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { Camera, MicOff, VideoOff } from 'lucide-react';
import React, { useEffect, useMemo, useRef } from 'react';

const ParticipantTile = ({ participantId }) => {
  const videoRef = useRef(null);
  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
    isActiveSpeaker,
  } = useParticipant(participantId);

  useEffect(() => {
    if (videoRef.current) {
      if (webcamStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        videoRef.current.srcObject = mediaStream;

        // Log stream information
        console.log('Video stream set for participant:', participantId, {
          webcamOn,
          hasStream: !!webcamStream,
          trackSettings: webcamStream?.track?.getSettings(),
        });
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [webcamStream, participantId, webcamOn]);

  // Debugging info
  useEffect(() => {
    console.log('Participant state:', {
      participantId,
      webcamOn,
      micOn,
      isLocal,
      displayName,
      hasWebcamStream: !!webcamStream,
      hasMicStream: !!micStream,
      isActiveSpeaker,
    });
  }, [
    participantId,
    webcamOn,
    micOn,
    webcamStream,
    micStream,
    isLocal,
    displayName,
    isActiveSpeaker,
  ]);

  return (
    <div
      className={`relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden ${
        isActiveSpeaker ? 'ring-2 ring-blue-500' : ''
      }`}>
      {webcamOn && webcamStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className='w-full h-full object-cover'
        />
      ) : (
        <div className='absolute inset-0 flex items-center justify-center'>
          <Camera className='w-12 h-12 text-gray-400' />
        </div>
      )}

      <div className='absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-black bg-opacity-50'>
        <span className='text-white text-sm truncate'>
          {displayName || 'Guest'} {isLocal ? '(You)' : ''}
        </span>
        <div className='flex space-x-2'>
          {!micOn && (
            <div className='p-1 bg-red-500 rounded-full'>
              <MicOff className='w-4 h-4 text-white' />
            </div>
          )}
          {!webcamOn && (
            <div className='p-1 bg-red-500 rounded-full'>
              <VideoOff className='w-4 h-4 text-white' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ParticipantView = () => {
  const { participants, localParticipant, meetingId } = useMeeting();

  // Debug information
  useEffect(() => {
    console.log('Meeting state:', {
      meetingId,
      participantCount: participants.size,
      participantIds: Array.from(participants.keys()),
      localParticipantId: localParticipant?.id,
    });
  }, [participants, localParticipant, meetingId]);

  const participantIds = useMemo(() => {
    const ids = Array.from(participants.keys());
    // Ensure local participant is always first if available
    if (localParticipant && !ids.includes(localParticipant.id)) {
      ids.unshift(localParticipant.id);
    }
    return ids;
  }, [participants, localParticipant]);

  if (participantIds.length === 0) {
    return (
      <div className='flex items-center justify-center h-full bg-gray-900'>
        <div className='text-white text-center'>
          <p>No participants yet</p>
          <p className='text-sm text-gray-400'>Waiting for others to join...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-900 min-h-full'>
      {participantIds.map((participantId) => (
        <ParticipantTile
          key={participantId}
          participantId={participantId}
        />
      ))}
    </div>
  );
};

export default ParticipantView;
