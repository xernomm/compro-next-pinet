import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOTP } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showOTP) {
        const result = await verifyOTP({ tempToken, otp });
        if (result.success) {
          toast.success('OTP Verified. Login successful!');
          navigate('/dashboard');
        } else {
          toast.error(result.message || 'Verification failed');
        }
      } else {
        const result = await login(formData);
        if (result.success) {
          if (result.requireOTP) {
            setShowOTP(true);
            setTempToken(result.tempToken);
            toast.info('Verification OTP sent to administrator email(s).');
          } else {
            toast.success('Login successful!');
            navigate('/dashboard');
          }
        } else {
          toast.error(result.message || 'Login failed');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        <p className="subtitle">Company Profile Management</p>
        
        <form onSubmit={handleSubmit}>
          {!showOTP ? (
            <>
              <div className="form-group">
                <label htmlFor="email">Email / Username</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email or username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button 
                type="submit" 
                className="btn-login"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="otp">Enter 6-Digit OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  maxLength={6}
                  value={otp}
                  onChange={handleOTPChange}
                  required
                  placeholder="e.g. 123456"
                  style={{
                    letterSpacing: '0.2em',
                    fontSize: '20px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-login"
                disabled={loading}
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
              
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => setShowOTP(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '10px'
                }}
              >
                Back to Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;