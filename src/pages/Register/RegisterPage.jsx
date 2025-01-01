import { Button, Form, Input, Layout, message } from 'antd';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  registerUserApi,
  sendVerificationEmailApi,
  verifyOtpApi,
} from '../../apis/Api';
import VerificationModal from '../../components/VerificationModal';

const { Content } = Layout;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showVerification, setShowVerification] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // set delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(form.getFieldsValue());
      const data = {
        full_name: form.getFieldValue('fullName'),
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
      };
      console.log(data);
      registerUserApi(data)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            message.success(
              'Registration successful. Please check your email to verify your account.'
            );
            sendVerificationEmailApi({
              email: form.getFieldValue('email'),
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
          } else {
            message.error('Registration failed. Please try again.');
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
              message.error('Registration failed. Please try again.');
            }
          } else {
            message.error('Registration failed. Please try again.');
          }
        });
      // form.resetFields();
    } catch (error) {
      message.error('Registration failed. Please try again.');
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

  const PasswordInput = ({ value, onChange, name, placeholder }) => (
    <div className='relative'>
      <Input
        value={value}
        onChange={onChange}
        type={
          name === 'password'
            ? showPassword
              ? 'text'
              : 'password'
            : showConfirmPassword
            ? 'text'
            : 'password'
        }
        placeholder={placeholder}
        className='h-12 rounded-xl'
        prefix={<Lock className='h-5 w-5 text-gray-400' />}
        suffix={
          <button
            type='button'
            onClick={() =>
              name === 'password'
                ? setShowPassword(!showPassword)
                : setShowConfirmPassword(!showConfirmPassword)
            }
            className='text-gray-400 hover:text-gray-600 focus:outline-none border-0 bg-transparent'>
            {(name === 'password' ? showPassword : showConfirmPassword) ? (
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
      style={{ backgroundColor: '#828282' }}>
      {/* Navbar */}
      <nav className='w-full backdrop-blur-md bg-black/20 shadow-sm sticky top-0 z-50'>
        <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
          <img
            className='h-8'
            src='/images/logo1.png'
            alt='Nexus'
          />
          <div className='space-x-4'>
            <Button
              className='bg-green-500 text-white hover:bg-green-600 border-none h-10 px-6'
              size='large'>
              <Link to='/login'>Login</Link>
            </Button>
            <Button
              className='text-gray-600 hover:text-gray-800 border-gray-300 h-10 px-6'
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
                <div className='absolute inset-0 bg-gradient-to-r from-green-500/20 to-orange-500/20 rounded-3xl blur-3xl'></div>
                <img
                  src='/images/nexus_logo.png'
                  alt='Nexus Logo'
                  className='relative w-full drop-shadow-2xl'
                />
              </div>
            </div>

            {/* Form Side */}
            <div className='w-full max-w-md mx-auto'>
              <div className='space-y-8'>
                <h1 className='text-4xl font-bold text-white text-center lg:text-left'>
                  Create an account to access the system
                </h1>
                <Form
                  form={form}
                  name='register'
                  onFinish={onFinish}
                  layout='vertical'
                  size='large'
                  className='space-y-6'>
                  <Form.Item
                    name='fullName'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your full name!',
                      },
                    ]}>
                    <Input
                      prefix={<User className='h-5 w-5 text-gray-400' />}
                      placeholder='Full Name'
                      className='h-12 rounded-xl'
                    />
                  </Form.Item>

                  <Form.Item
                    name='email'
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email!' },
                    ]}>
                    <Input
                      prefix={<Mail className='h-5 w-5 text-gray-400' />}
                      placeholder='Email Address'
                      className='h-12 rounded-xl'
                    />
                  </Form.Item>

                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        min: 8,
                        message: 'Password must be at least 8 characters!',
                      },
                    ]}>
                    <PasswordInput
                      name='password'
                      placeholder='Password'
                    />
                  </Form.Item>

                  <Form.Item
                    name='confirmPassword'
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            'The two passwords do not match!'
                          );
                        },
                      }),
                    ]}>
                    <PasswordInput
                      name='confirmPassword'
                      placeholder='Confirm Password'
                    />
                  </Form.Item>

                  <Form.Item className='mb-4'>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      className='w-full h-12 bg-orange-500 hover:bg-orange-600 border-none rounded-xl text-lg font-medium'>
                      Register
                    </Button>
                  </Form.Item>

                  <div className='text-center text-white text-base'>
                    Already have an account?{' '}
                    <Link
                      to='/login'
                      className='text-green-400 hover:text-green-300 font-medium'>
                      Login
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

export default RegisterPage;
