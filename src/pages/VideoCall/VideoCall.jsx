import { MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMeApi } from '../../apis/Api';
import Controls from './Controls';
import ParticipantView from './ParticipantView';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

const MeetingView = ({ callId, host, user, selectedDevices }) => {
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [connectionError, setConnectionError] = useState(null);

  const handleMeetingError = useCallback(
    (error) => {
      console.error('Meeting error:', error);
      if (error.message?.includes('Insufficient resources')) {
        setConnectionError(
          'Connection failed due to server resources. Retrying...'
        );
        if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
          setTimeout(() => {
            setConnectionAttempts((prev) => prev + 1);
          }, RETRY_DELAY);
        } else {
          setConnectionError(
            'Failed to connect after multiple attempts. Please try again later.'
          );
        }
      }
    },
    [connectionAttempts]
  );

  const { join, leave, localParticipant, participants } = useMeeting({
    onMeetingJoined: () => {
      console.log('Meeting joined successfully');
      setConnectionError(null);
      setConnectionAttempts(0);
    },
    onMeetingLeft: () => {
      console.log('Meeting left successfully');
    },
    onError: handleMeetingError,
    onParticipantJoined: (participant) => {
      console.log('Participant joined:', participant);
    },
    onParticipantLeft: (participant) => {
      console.log('Participant left:', participant);
    },
  });

  useEffect(() => {
    let mounted = true;

    const applyDeviceSettings = async () => {
      if (!selectedDevices || !localParticipant) return;

      try {
        if (selectedDevices.camera) {
          await localParticipant.switchCamera(selectedDevices.camera);
        }
        if (selectedDevices.microphone) {
          await localParticipant.switchMic(selectedDevices.microphone);
        }
      } catch (error) {
        console.error('Error applying device settings:', error);
      }
    };

    const initializeMeeting = async () => {
      if (typeof join === 'function' && mounted) {
        try {
          await join();
          await applyDeviceSettings();
        } catch (error) {
          console.error('Error initializing meeting:', error);
          handleMeetingError(error);
        }
      }
    };

    initializeMeeting();
    applyDeviceSettings();

    return () => {
      mounted = false;
      if (typeof leave === 'function') {
        try {
          leave();
        } catch (error) {
          // Safely handle leave errors
          console.error('Error leaving meeting:', error);
        }
      }
    };
  }, []);

  if (connectionError) {
    return (
      <div className='h-screen flex items-center justify-center bg-gray-900'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'>
          <strong className='font-bold'>Connection Error: </strong>
          <span className='block sm:inline'>{connectionError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex-1 relative bg-gray-900'>
        <ParticipantView />
      </div>
      <Controls
        callId={callId}
        host={host}
        user={user}
      />
    </div>
  );
};

const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const callData = location.state;

  useEffect(() => {
    if (!callData) {
      navigate('/');
      return;
    }

    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await getMeApi();
        if (response.status === 200 && mounted) {
          setUser(response.data.user);
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        if (mounted) {
          setError(error.message || 'Failed to fetch user');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [callData]);

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900'>
        <div className='text-red-500 bg-red-100 p-4 rounded-lg'>
          Error: {error}
        </div>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900'>
        <div className='text-white'>Initializing call...</div>
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId: callData.roomId,
        micEnabled: callData.micEnabled,
        webcamEnabled: callData.webcamEnabled,
        name: `${user.firstName} ${user.lastName}`,
        participantId: user._id,
        multistream: true,
      }}
      token={callData.token}>
      <MeetingView
        callId={callData.callId}
        host={callData.host}
        user={user}
        selectedDevices={callData.selectedDevices}
      />
    </MeetingProvider>
  );
};

export default VideoCall;
