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
