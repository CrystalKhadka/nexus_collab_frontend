import { Button, Form, Input, Layout, message } from 'antd';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  acceptProjectInviteApi,
  loginUserApi,
  sendVerificationEmailApi,
  verifyOtpApi,
} from '../../apis/Api';
import VerificationModal from '../../components/VerificationModal';

const { Content } = Layout;

const AcceptInvitePage = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [inviteProcessing, setInviteProcessing] = useState(true);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    const checkAuthAndInvite = async () => {
      const token = localStorage.getItem('token');
      const inviteToken = params.token;

      console.log(inviteToken);

      if (!inviteToken) {
        message.error('Invalid invitation link');
        // window.location.href = '/dashboard';
        return;
      }

      if (token) {
        // User is already logged in, process invite directly
        try {
          await processInvite(inviteToken);
        } catch (error) {
          console.error('Error processing invite:', error);
        }
      } else {
        // User needs to log in first
        setInviteProcessing(false);
      }
    };

    checkAuthAndInvite();
  }, [params]);

  const processInvite = async (inviteToken) => {
    try {
      setInviteProcessing(true);
      const response = await acceptProjectInviteApi({ token: inviteToken });

      if (response.data.success) {
        setProjectDetails(response.data.project);
        message.success('Successfully joined the project!');
        setTimeout(() => {
          window.location.href = `/board/${response.data.data._id}`;
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to process invitation');
      }
      window.location.href = '/dashboard';
    } finally {
      setInviteProcessing(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        email: values.email,
        password: values.password,
      };

      const response = await loginUserApi(data);

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);

        // Process the invite after successful login
        const inviteToken = params.token;
        await processInvite(inviteToken);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message);
        if (error.response.data.isVerified === false) {
          try {
            const verificationResponse = await sendVerificationEmailApi({
              email: values.email,
            });

            if (verificationResponse.status === 200) {
              message.success('Verification email sent successfully.');
              setShowVerification(true);
            }
          } catch (verificationError) {
            message.error('Failed to send verification email');
          }
        }
      } else {
        message.error('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp) => {
    try {
      const response = await verifyOtpApi({
        email: form.getFieldValue('email'),
        otp: parseInt(otp),
      });

      if (response.status === 200) {
        message.success('Verification successful.');
        setShowVerification(false);

        const token = response.data.token;
        localStorage.setItem('token', token);

        // Process the invite after successful verification
        const inviteToken = params.token;
        await processInvite(inviteToken);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message);
      } else {
        message.error('Verification failed. Please try again.');
      }
    }
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

  if (inviteProcessing) {
    return (
      <Layout className='min-h-screen bg-gray-900'>
        <Content className='flex items-center justify-center p-6'>
          <div className='text-center space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto'></div>
            <p className='text-white text-lg'>Processing invitation...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout
      className='min-h-screen bg-gray-900'
      style={{ fontFamily: 'Satoshi' }}>
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
      <Content className='p-6 bg-gray-800/50'>
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
                    Sign in to accept invitation
                  </h1>
                  <p className='text-gray-300 text-lg'>
                    Please log in or create an account to join the project
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

                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      className='w-full h-12 bg-orange-500 hover:bg-orange-600 border-none rounded-xl text-lg font-medium'>
                      Sign in to accept
                    </Button>
                  </Form.Item>

                  <div className='text-center text-white'>
                    Don't have an account?{' '}
                    <Link
                      to={`/register?redirect=${encodeURIComponent(
                        window.location.href
                      )}`}
                      className='text-green-400 hover:text-green-300'>
                      Sign up
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
        onVerify={handleVerify}
        email={form.getFieldValue('email')}
      />
    </Layout>
  );
};

export default AcceptInvitePage;
