import { keyframes } from '@emotion/react';
import {
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Call as CallIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  EmojiEmotions as EmojiIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  Image as ImageIcon,
  KeyboardArrowDown,
  Search as SearchIcon,
  Send as SendIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createChannelApi,
  getChannelsByProjectIdApi,
  getMeApi,
  getMessageByChannelApi,
  getMessageByUserApi,
  getOnlineUsersApi,
  getProjectByIdApi,
  sendMessageApi,
  sendMessageToChannelApi,
} from '../../apis/Api';
import { useSocket } from '../../components/socketContext/SocketContext';

// Typing animation keyframes
const blink = keyframes`
  50% {
    opacity: 1;
  }
  51% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

const TypingIndicator = ({ isTyping, user }) => {
  if (!isTyping || !user) return null;

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography
        variant='body2'
        color='text.secondary'>
        {user.firstName} is typing
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              bgcolor: 'text.secondary',
              borderRadius: '50%',
              animation: `${blink} 1s infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const Sidebar = ({
  onChannelSelect,
  onMemberSelect,
  selectedChannel,
  selectedMember,
  user,
}) => {
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [channels, setChannels] = useState([]);
  const [project, setProject] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const param = useParams();
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    fetchChannels();
    fetchProject();
  }, []);

  useEffect(() => {
    getOnlineUsersApi()
      .then((res) => {
        setOnlineUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [socket]);

  const checkOnline = (userId) => {
    const user = onlineUsers.find((user) => user === userId);
    return user ? true : false;
  };

  const fetchChannels = () => {
    const projectId = param.id;
    getChannelsByProjectIdApi(projectId)
      .then((res) => {
        setChannels(res.data.channels);
        if (
          !selectedChannel &&
          !selectedMember &&
          res.data.channels.length > 0
        ) {
          onChannelSelect(res.data.channels[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchProject = () => {
    getProjectByIdApi(param.id)
      .then((res) => {
        setProject(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      createChannelApi({ name: newChannelName, projectId: param.id })
        .then(() => {
          setNewChannelName('');
          setShowAddChannel(false);
          fetchChannels();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      onMemberSelect(null);
    } else {
      onChannelSelect(null);
    }
  };

  return (
    <Box className='w-64 flex-shrink-0 border-r border-white/10 h-full flex flex-col bg-gray-600/50 backdrop-blur-md'>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered>
        <Tab
          icon={<TagIcon />}
          label='Channels'
        />
        <Tab
          icon={<ChatIcon />}
          label='Direct'
        />
      </Tabs>

      {activeTab === 0 ? (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}>
            <Typography variant='h6'>Channels</Typography>
            <IconButton
              size='small'
              onClick={() => setShowAddChannel(true)}>
              <AddIcon />
            </IconButton>
          </Box>

          <List>
            {channels.map((channel) => (
              <ListItem
                key={channel._id}
                button
                selected={selectedChannel?._id === channel._id}
                onClick={() => onChannelSelect(channel)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                  },
                }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <TagIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary={channel.name} />
              </ListItem>
            ))}
          </List>

          {showAddChannel && (
            <Box
              sx={{
                mt: 2,
                p: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}>
              <TextField
                size='small'
                fullWidth
                placeholder='Channel name'
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size='small'
                  onClick={() => setShowAddChannel(false)}
                  startIcon={<CloseIcon />}>
                  Close
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  onClick={handleCreateChannel}
                  startIcon={<AddIcon />}>
                  Create
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography
            variant='h6'
            sx={{ mb: 2 }}>
            Members
          </Typography>
          <List>
            {project.members?.map(
              (member) =>
                member._id !== user._id && (
                  <ListItem
                    key={member._id}
                    button
                    selected={selectedMember?._id === member._id}
                    onClick={() => onMemberSelect(member)}
                    sx={{ borderRadius: 1, mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Badge
                        overlap='circular'
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        variant='dot'
                        color={checkOnline(member._id) ? 'success' : 'default'}>
                        <Avatar
                          src={
                            `http://localhost:5000/profilePic/` + member.image
                          }
                          sx={{ width: 32, height: 32 }}
                        />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={member.firstName + ' ' + member.lastName}
                      secondary={member.email}
                    />
                  </ListItem>
                )
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

const ChatHeader = ({ selectedChannel, selectedMember }) => (
  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2 }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {selectedChannel ? (
          <>
            <TagIcon />
            <Typography variant='h6'>{selectedChannel.name}</Typography>
          </>
        ) : selectedMember ? (
          <>
            <Avatar
              src={`http://localhost:5000/profile/` + selectedMember.image}
            />
            <Typography variant='h6'>
              {selectedMember.firstName + ' ' + selectedMember.lastName}
            </Typography>
          </>
        ) : (
          <Typography variant='h6'>Select a channel or member</Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title='Call'>
          <IconButton
            onClick={() => {
              if (selectedMember) {
                window.location.href = `/call/${selectedMember._id}`;
              }

              if (selectedChannel) {
                window.location.href = `/preCall/${selectedChannel._id}`;
              }
            }}>
            <CallIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='View Members'>
          <IconButton>
            <GroupIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='View Files'>
          <IconButton>
            <FolderIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Search'>
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </Box>
);

const DateDivider = ({ date }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
    <Paper
      elevation={0}
      sx={{ px: 2, py: 0.5, bgcolor: 'action.hover', borderRadius: 4 }}>
      <Typography
        variant='caption'
        color='text.secondary'>
        {new Date(date).toLocaleDateString()}
      </Typography>
    </Paper>
  </Box>
);

const ChatMessage = ({ message, currentUserId }) => {
  const isOwn = message.sender._id === currentUserId;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        mb: 2,
        gap: 1,
      }}>
      <Avatar
        src={`http://localhost:5000/profilePic/` + message.sender.image}
        alt={`${message.sender.firstName} ${message.sender.lastName}`}
      />
      <Box sx={{ maxWidth: '70%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isOwn ? 'row-reverse' : 'row',
            gap: 1,
            mb: 0.5,
          }}>
          <Typography variant='subtitle2'>
            {message.sender.firstName + ' ' + message.sender.lastName}
          </Typography>
          <Typography
            variant='caption'
            color='text.secondary'>
            {new Date(message.createdAt).toLocaleTimeString()}
          </Typography>
        </Box>
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            bgcolor: isOwn ? 'primary.main' : 'background.paper',
            color: isOwn ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
          }}>
          <Typography>{message.text}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const ChatPage = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    channel: '',
  });

  useEffect(() => {
    getMeApi()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      getMessageForChannel();
    } else if (selectedMember) {
      getDirectMessages();
    }
  }, [selectedChannel, selectedMember]);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (message.isChannel) {
        if (message.channel._id === selectedChannel?._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          setSnackbar({
            open: true,
            message: `New message in #${message.channel.name}`,
            channel: message.channel.name,
          });
        }
      }
    });

    socket.on('userTyping', ({ user, channel }) => {
      if (channel._id === selectedChannel?._id) {
        setTypingUser(user);
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
    };
  }, [socket, selectedChannel]);

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    if (channel) {
      socket.emit('joinChannel', channel._id);
    }
    setSelectedMember(null);
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setSelectedChannel(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e) => {
    setIsScrolled(
      e.target.scrollTop < e.target.scrollHeight - e.target.clientHeight - 100
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    if (selectedChannel) {
      socket.emit('typing', {
        channel: selectedChannel,
        user: user,
      });
    }
  };

  const handleSendMessage = () => {
    if (!text.trim()) return;

    const messageData = {
      text: text,
      type: 'text',
    };

    if (selectedChannel) {
      messageData.channelId = selectedChannel._id;
      sendMessageToChannelApi(messageData)
        .then((res) => {
          socket.emit('sendMessage', {
            room: selectedChannel._id,
            message: res.data.data,
            type: 'channel',
          });
          setText('');
          getMessageForChannel();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedMember) {
      messageData.recipient = selectedMember._id;
      sendMessageApi(messageData)
        .then(() => {
          setText('');
          getDirectMessages();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getMessageForChannel = () => {
    getMessageByChannelApi(selectedChannel._id)
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDirectMessages = () => {
    if (!selectedMember) return;

    getMessageByUserApi(selectedMember._id)
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <Sidebar
        onChannelSelect={handleChannelSelect}
        onMemberSelect={handleMemberSelect}
        selectedChannel={selectedChannel}
        selectedMember={selectedMember}
        user={user}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
        <ChatHeader
          selectedChannel={selectedChannel}
          selectedMember={selectedMember}
        />

        <Box
          sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}
          onScroll={handleScroll}>
          {messages.map((msg, index) => {
            const showDateDivider =
              index === 0 ||
              new Date(messages[index - 1].createdAt).toLocaleDateString() !==
                new Date(msg.createdAt).toLocaleDateString();

            return (
              <React.Fragment key={msg._id}>
                {showDateDivider && <DateDivider date={msg.createdAt} />}
                <ChatMessage
                  message={msg}
                  currentUserId={user?._id}
                />
              </React.Fragment>
            );
          })}
          <TypingIndicator
            isTyping={isTyping}
            user={typingUser}
          />
          <div ref={messagesEndRef} />
        </Box>

        {isScrolled && (
          <IconButton
            onClick={scrollToBottom}
            sx={{
              position: 'absolute',
              bottom: 100,
              right: 24,
              bgcolor: 'background.paper',
            }}>
            <KeyboardArrowDown />
          </IconButton>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity='info'
            sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Paper
          elevation={3}
          sx={{ p: 2, mx: 2, mb: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton size='small'>
              <AddIcon />
            </IconButton>
            <InputBase
              fullWidth
              placeholder={
                selectedChannel
                  ? `Message #${selectedChannel.name}`
                  : selectedMember
                  ? `Message ${selectedMember.firstName}`
                  : 'Select a channel or member'
              }
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              sx={{ mx: 1 }}
              disabled={!selectedChannel && !selectedMember}
            />
            <IconButton size='small'>
              <AttachFileIcon />
            </IconButton>
            <IconButton size='small'>
              <ImageIcon />
            </IconButton>
            <IconButton size='small'>
              <EmojiIcon />
            </IconButton>
            <IconButton
              size='small'
              color='primary'
              onClick={handleSendMessage}
              disabled={!selectedChannel && !selectedMember}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;
