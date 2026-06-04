import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOTP } = useAuth();

  // Step 1: email, Step 2: OTP
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRef = useRef(null);

  // Countdown timer for OTP expiry (5 min)
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-focus OTP input on step 2
  useEffect(() => {
    if (step === 2 && otpRef.current) {
      otpRef.current.focus();
    }
  }, [step]);

  const formatCountdown = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const result = await login({ email: email.trim() });
      if (result.success && result.requireOTP) {
        setStep(2);
        setTempToken(result.tempToken);
        setCountdown(300); // 5 minutes
        toast.info('Kode verifikasi OTP telah dikirim ke email administrator.');
      } else {
        toast.error(result.message || 'Failed to send OTP.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast.warning('Masukkan 6 digit kode OTP.');
      return;
    }
    setLoading(true);

    try {
      const result = await verifyOTP({ tempToken, otp: otp.trim() });
      if (result.success) {
        toast.success('Login berhasil! Sesi berlaku selama 1 jam.');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Kode OTP tidak valid.');
      }
    } catch (error) {
      toast.error('Verifikasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setOtp('');

    try {
      const result = await login({ email: email.trim() });
      if (result.success && result.requireOTP) {
        setTempToken(result.tempToken);
        setCountdown(300);
        toast.info('Kode OTP baru telah dikirim.');
      } else {
        toast.error(result.message || 'Gagal mengirim OTP.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setTempToken('');
    setCountdown(0);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff2d2d, #c80d0d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255, 45, 45, 0.3)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Admin Portal</h1>
          <p className="subtitle">
            {step === 1
              ? 'Masukkan email untuk menerima kode verifikasi'
              : 'Masukkan kode OTP 6 digit yang dikirim ke email'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', marginBottom: '24px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: step >= 1 ? 'linear-gradient(135deg, #ff2d2d, #c80d0d)' : 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: 'white',
            transition: 'all 0.3s',
          }}>1</div>
          <div style={{
            width: '40px', height: '2px',
            background: step >= 2
              ? 'linear-gradient(90deg, #ff2d2d, #c80d0d)'
              : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: step >= 2 ? 'linear-gradient(135deg, #ff2d2d, #c80d0d)' : 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700,
            color: step >= 2 ? 'white' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s',
          }}>2</div>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <div className="form-group">
              <label htmlFor="email">Email / Username</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="Enter your admin email"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31 31" />
                  </svg>
                  Mengirim OTP...
                </span>
              ) : 'Kirim Kode OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">Kode Verifikasi (6 digit)</label>
              <input
                ref={otpRef}
                type="text"
                id="otp"
                name="otp"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setOtp(val);
                }}
                required
                placeholder="• • • • • •"
                autoComplete="one-time-code"
                inputMode="numeric"
                style={{
                  letterSpacing: '0.3em',
                  fontSize: '24px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
            </div>

            {/* Timer & email info */}
            <div style={{
              textAlign: 'center', marginBottom: '16px',
              fontSize: '13px', color: 'rgba(255,255,255,0.5)',
            }}>
              <p style={{ margin: '0 0 4px' }}>
                Dikirim ke: <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</strong>
              </p>
              {countdown > 0 ? (
                <p style={{ margin: 0, color: '#ff6b6b' }}>
                  Kode berlaku: {formatCountdown(countdown)}
                </p>
              ) : (
                <p style={{ margin: 0, color: '#ff2d2d' }}>
                  Kode telah kadaluarsa
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31 31" />
                  </svg>
                  Memverifikasi...
                </span>
              ) : 'Verifikasi & Login'}
            </button>

            {/* Action buttons */}
            <div style={{
              display: 'flex', gap: '8px', marginTop: '12px',
            }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                style={{
                  flex: 1,
                  background: countdown > 0 ? 'transparent' : 'rgba(255, 45, 45, 0.1)',
                  border: `1px solid ${countdown > 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255, 45, 45, 0.3)'}`,
                  color: countdown > 0 ? 'rgba(255,255,255,0.3)' : '#ff6b6b',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
              >
                Kirim Ulang
              </button>
            </div>
          </form>
        )}

        {/* Session info */}
        <p style={{
          textAlign: 'center', fontSize: '11px',
          color: 'rgba(255,255,255,0.25)', marginTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '16px',
        }}>
          🔒 Sesi login berlaku selama 1 jam setelah verifikasi
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;