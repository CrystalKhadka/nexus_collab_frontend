import axios from 'axios';

// const baseurl = 'http://192.168.18.7:5000';
const baseurl = 'http://localhost:5000';

// Creating backend config
const Api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const jsonConfig = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

export const url = baseurl;

// User Apis

export const registerUserApi = async (data) => {
  try {
    const response = await Api.post('/user/register', data);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const sendVerificationEmailApi = (data) =>
  Api.post('/user/send_verification_email', data);

export const verifyOtpApi = (data) => Api.post('/user/verify_otp', data);

export const loginUserApi = (data) => Api.post('/user/login', data);

export const searchUserApi = (search) =>
  Api.get(`/user/search?search=${search}`, jsonConfig);

// get me api
export const getMeApi = () => Api.get('/user/me', jsonConfig);

// Project Apis
// Create Project
export const createProjectApi = (data) =>
  Api.post('/project/create', data, jsonConfig);

export const uploadProjectImageApi = (data) =>
  Api.post('/project/upload_image', data, config);

export const getProjectByIdApi = (id) =>
  Api.get(`/project/get/${id}`, jsonConfig);

// update project
export const updateProjectApi = (id, data) =>
  Api.put('/project/update/' + id, data, jsonConfig);

export const getMyProjectsApi = () =>
  Api.get('/project/get_my_projects', jsonConfig);

export const getJoinedProjectsApi = () =>
  Api.get('/project/get_joined_projects', jsonConfig);

// send invite
export const sendProjectInviteApi = (data) =>
  Api.put('/project/send_invite', data, jsonConfig);

export const acceptProjectInviteApi = (data) =>
  Api.put('/project/accept_invite', data, jsonConfig);

// search projects
export const searchProjectsApi = (search) =>
  Api.get(`/project/search?search=${search}`, jsonConfig);

// get_invited_projects api
export const getInvitedProjectsApi = () =>
  Api.get('/project/get_invited_projects', jsonConfig);

// search project member api
export const getProjectMemberApis = (id) =>
  Api.get(`/project/get_members/${id}`, jsonConfig);

export const projectImageUrl = `${baseurl}/projects/`;

export const addListToProjectApi = ({ data, id }) =>
  Api.put('/project/add_list/' + id, data, jsonConfig);

// reject invite
export const rejectProjectInviteApi = ({ data, id }) =>
  Api.put('/project/reject_invite/' + id, data, jsonConfig);

// requestAccess
export const requestAccessApi = (id) =>
  Api.put('/project/request_access/' + id, {}, jsonConfig);

// fetchRequestedMembers
export const fetchRequestedMembersApi = (id) =>
  Api.get('/project/fetch_requested_members/' + id, jsonConfig);

// getMembersRoleAndTask
export const getMembersRoleAndTaskApi = (id) =>
  Api.get(`/project/get_members_role_task/${id}`, jsonConfig);

// List Apis
export const createListApi = (data) =>
  Api.post('/list/create', data, jsonConfig);

export const getListsByProjectIdApi = (id) =>
  Api.get(`/list/get_all/${id}`, jsonConfig);

// moveList
export const moveListApi = (id, data) =>
  Api.put('/list/move/' + id, data, jsonConfig);

// Task Apis
export const createTaskApi = (data) =>
  Api.post('/task/create', data, jsonConfig);

export const getTasksByListIdApi = (id) =>
  Api.get(`/task/get_all/${id}`, jsonConfig);

export const addTaskToListApi = (data) =>
  Api.put(`/list/add_task/${data.id}`, data.data, jsonConfig);

export const removeTaskFromListApi = (data) =>
  Api.put(`/list/remove_task/${data.id}`, data.data, jsonConfig);

export const getTaskByIdApi = (id) => Api.get(`/task/get/${id}`, jsonConfig);

// change_name
export const changeTaskNameApi = ({ data, id }) =>
  Api.put(`/task/change_name/${id}`, data, jsonConfig);

// change_desc
export const changeTaskDescApi = ({ data, id }) =>
  Api.put(`/task/change_desc/${id}`, data, jsonConfig);

// delete task
export const deleteTaskApi = (id) =>
  Api.delete(`/task/delete/${id}`, jsonConfig);

// assignTask
export const assignTaskApi = (id, data) =>
  Api.put(`/task/assign/${id}`, data, jsonConfig);

// assign_date
export const assignDateApi = (id, data) =>
  Api.put(`/task/assign_date/${id}`, data, jsonConfig);

// change_priority
export const changeTaskPriorityApi = (id, data) =>
  Api.put(`/task/change_priority/${id}`, data, jsonConfig);

// change_label
export const changeTaskLabelApi = (id, data) =>
  Api.put(`/task/change_label/${id}`, data, jsonConfig);

// update_cover_image
export const updateCoverImageApi = (id, data) =>
  Api.put('/task/update_cover_image/' + id, data, config);

// get_by_project
export const getTasksByProjectIdApi = (id) =>
  Api.get(`/task/get_by_project/${id}`, jsonConfig);

// add_requirement
export const addRequirementApi = (id, data) =>
  Api.put(`/task/add_requirement/${id}`, data, jsonConfig);

// change_status
export const changeTaskStatusApi = (id, data) =>
  Api.put(`/task/change_status/${id}`, data, jsonConfig);

// Channels

export const createChannelApi = (data) =>
  Api.post('/channel/create', data, jsonConfig);

export const getChannelsByProjectIdApi = (id) =>
  Api.get(`/channel/get_all/${id}`, jsonConfig);

// Messages
// send_message_to_channel api
export const sendMessageToChannelApi = (data) =>
  Api.post('/message/send_message_to_channel', data, jsonConfig);

// send message
export const sendMessageApi = (data) =>
  Api.post('/message/send_message', data, jsonConfig);

// get_message_by_user
export const getMessageByUserApi = (id) =>
  Api.get(`/message/get_message_by_user/${id}`, jsonConfig);

// get_message_by_channel
export const getMessageByChannelApi = (id) =>
  Api.get(`/message/get_message_by_channel/${id}`, jsonConfig);

// upload file
export const uploadFileApi = (data) =>
  Api.post('/message/upload_file', data, config);

// /socket/getOnlineUsers

export const getOnlineUsersApi = () =>
  Api.get('/socket/getOnlineUsers', jsonConfig);

// Call apis

export const createCallApi = (data) =>
  Api.post('/call/start', data, jsonConfig);

export const getCallByIdApi = (id) => Api.get(`/call/get/${id}`, jsonConfig);

// Join call
export const joinCallApi = (id) => Api.put('/call/join/' + id, {}, jsonConfig);

// Get call by channel /channel/:channelId
export const getCallByChannelApi = (id) =>
  Api.get(`/call/channel/${id}`, jsonConfig);

// end call
export const endCallById = (id) => Api.put(`/call/end/${id}`, {}, jsonConfig);

// leave call
export const leaveCallById = (id) =>
  Api.put(`/call/leave/${id}`, {}, jsonConfig);

// upload_profile_pic
export const uploadProfilePicApi = (data) =>
  Api.post('/user/upload_profile_pic', data, config);

// update user
export const updateUserApi = (data) =>
  Api.put('/user/update', data, jsonConfig);

// send_forgot_password_email
export const sendForgotPasswordEmailApi = (data) =>
  Api.put('/user/send_forgot_password_email', data, jsonConfig);

// reset_password
export const resetPasswordApi = (data) =>
  Api.put('/user/reset_password', data, jsonConfig);

// verify_forgot_password_otp
export const verifyForgotPasswordOTPApi = (data) =>
  Api.put('/user/verify_forgot_password_otp', data, jsonConfig);
