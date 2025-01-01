import { Button, Form, Input, Layout, message } from 'antd';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  loginUserApi,
  sendVerificationEmailApi,
  verifyOtpApi,
} from '../../apis/Api';
import VerificationModal from '../../components/VerificationModal';

const { Content } = Layout;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = {
        email: values.email,
        password: values.password,
      };
      loginUserApi(data)
        .then((response) => {
          if (response.data.success) {
            message.success(response.data.message);
            const token = response.data.token;
            localStorage.setItem('token', token);

            // Redirect to login page
            window.location.href = '/dashboard';
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              message.error(error.response.data.message);
              if (error.response.data.isVerified === false) {
                sendVerificationEmailApi({
                  email: values.email,
                })
                  .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                      message.success('Verification email sent successfully.');
                      setShowVerification(true);
                    } else {
                      message.error('Verification email could not be sent.');
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                    if (error.response) {
                      if (error.response.status === 400) {
                        message.error(error.response.data.message);
                      } else if (error.response.status === 500) {
                        message.error('Internal server error');
                      } else {
                        message.error('Verification email could not be sent.');
                      }
                    } else {
                      message.error('Verification email could not be sent.');
                    }
                  });
              }
            } else if (error.response.status === 500) {
              message.error(error.response.data.message);
            } else {
              message.error('An error occurred. Please try again later.');
              console.error('An error occurred:', error);
            }
          } else {
            message.error('An error occurred. Please try again later.');
            console.error('An error occurred:', error);
          }
        });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (otp) => {
    console.log(otp);
    // Verify OTP
    verifyOtpApi({
      email: form.getFieldValue('email'),
      otp: parseInt(otp),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          message.success('Verification successful. You can now log in.');
          setShowVerification(false);
          const token = response.data.token;
          localStorage.setItem('token', token);

          // Redirect to login page
          window.location.href = '/dashboard';
        } else {
          message.error('Verification failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          if (error.response.status === 400) {
            message.error(error.response.data.message);
          } else if (error.response.status === 500) {
            message.error('Internal server error');
          } else {
            message.error('Verification failed. Please try again.');
          }
        } else {
          message.error('Verification failed. Please try again.');
        }
      });
  };

  const PasswordInput = ({ value, onChange, placeholder }) => (
    <div className='relative'>
      <Input
        value={value}
        onChange={onChange}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className='h-12 rounded-xl bg-white'
        prefix={<Lock className='h-5 w-5 text-gray-400' />}
        suffix={
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-0 mx-2'>
            {showPassword ? (
              <EyeOff className='h-5 w-5' />
            ) : (
              <Eye className='h-5 w-5' />
            )}
          </button>
        }
      />
    </div>
  );

  return (
    <Layout
      className='min-h-screen'
      style={{ backgroundColor: '#828282', fontFamily: 'Satoshi' }}>
      {/* Navbar */}
      <nav className='w-full bg-black/20 backdrop-blur-sm shadow-sm sticky top-0 z-50'>
        <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
          <img
            className='h-8'
            src='/images/logo1.png'
            alt='Nexus'
          />
          <div className='space-x-4'>
            <Button
              className='bg-gray-100 text-gray-600 hover:bg-gray-200 border-none h-10 px-6 rounded-xl'
              size='large'>
              <Link to='/login'>Login</Link>
            </Button>
            <Button
              className='bg-orange-500 text-white hover:bg-orange-600 border-none h-10 px-6 rounded-xl'
              size='large'>
              <Link to='/register'>Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Content className='p-6'>
        <div className='container mx-auto'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Logo Side */}
            <div className='hidden lg:flex justify-center'>
              <div className='relative w-full max-w-lg'>
                <div className='absolute inset-0 bg-gradient-to-r from-green-500/20 to-orange-500/20 rounded-[2rem] blur-3xl'></div>
                <img
                  src='/images/nexus_logo.png'
                  alt='Nexus Logo'
                  className='relative w-full drop-shadow-2xl'
                />
              </div>
            </div>

            {/* Form Side */}
            <div className='w-full max-w-md mx-auto'>
              <div className='space-y-6'>
                <div className='text-center lg:text-left'>
                  <h1 className='text-4xl font-bold text-white mb-2'>
                    Welcome back
                  </h1>
                  <p className='text-gray-300 text-lg'>
                    Enter your credentials to access your account
                  </p>
                </div>

                <Form
                  form={form}
                  name='login'
                  onFinish={onFinish}
                  layout='vertical'
                  size='large'
                  className='space-y-6'>
                  <Form.Item
                    name='email'
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' },
                    ]}>
                    <Input
                      prefix={<Mail className='h-5 w-5 text-gray-400' />}
                      placeholder='Email Address'
                      className='h-12 rounded-xl bg-white'
                    />
                  </Form.Item>

                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}>
                    <PasswordInput placeholder='Password' />
                  </Form.Item>

                  <div className='flex justify-end'>
                    <Link
                      to='/forgot-password'
                      className='text-green-400 hover:text-green-300'>
                      Forgot Password?
                    </Link>
                  </div>

                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      className='w-full h-12 bg-orange-500 hover:bg-orange-600 border-none rounded-xl text-lg font-medium'>
                      Login
                    </Button>
                  </Form.Item>

                  <div className='relative flex items-center justify-center gap-4'>
                    <div className='h-px bg-gray-400 flex-1'></div>
                    <span className='text-gray-300'>or</span>
                    <div className='h-px bg-gray-400 flex-1'></div>
                  </div>

                  <Button
                    className='w-full h-12 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2 text-gray-600'
                    size='large'>
                    <img
                      src='https://cdn.cdnlogo.com/logos/g/35/google-icon.svg'
                      alt='Google'
                      className='w-5 h-5'
                    />
                    Continue with Google
                  </Button>

                  <div className='text-center text-white'>
                    Don't have an account?{' '}
                    <Link
                      to='/register'
                      className='text-green-400 hover:text-green-300'>
                      Signup
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <VerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
        onVerify={(code) => handleVerify(code)}
        email={form.getFieldValue('email')}
      />
    </Layout>
  );
};

export default LoginPage;
