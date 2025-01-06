import axios from 'axios';

// const baseurl = 'http://192.168.18.7:5000';
const baseurl = 'http://localhost:5000';

// Creating backend config
const Api = axios.create({
  baseURL: baseurl + '/api',
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

// Project Apis
// Create Project
export const createProjectApi = (data) =>
  Api.post('/project/create', data, jsonConfig);

export const uploadProjectImageApi = (data) =>
  Api.post('/project/upload_image', data, config);

export const getProjectByIdApi = (id) =>
  Api.get(`/project/get/${id}`, jsonConfig);

export const getMyProjectsApi = () =>
  Api.get('/project/get_my_projects', jsonConfig);

export const getJoinedProjectsApi = () =>
  Api.get('/project/get_joined_projects', jsonConfig);

export const projectImageUrl = `${baseurl}/projects/`;

export const addListToProjectApi = ({ data, id }) =>
  Api.put('/project/add_list/' + id, data, jsonConfig);

// List Apis
export const createListApi = (data) =>
  Api.post('/list/create', data, jsonConfig);

export const getListsByProjectIdApi = (id) =>
  Api.get(`/list/get_all/${id}`, jsonConfig);

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
