import React, { useState } from 'react';
import LucideIcon from './LucideIcon';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);

    // Simulate small smooth delay for luxury loading experience
    setTimeout(() => {
      const normalizedUser = username.trim().toLowerCase();
      
      // Credential 1: Anh Ruby / 912393
      // Credential 2: Admin / 123456
      if (
        (username.trim() === 'Anh Ruby' && password === '912393') ||
        (normalizedUser === 'anh ruby' && password === '912393')
      ) {
        onLoginSuccess('Anh Ruby');
      } else if (
        (username.trim() === 'Admin' && password === '123456') ||
        (normalizedUser === 'admin' && password === '123456')
      ) {
        onLoginSuccess('Admin');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div id="login-container" className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-amber-50/30 flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: 'var(--font-sans)' }}>
      <div id="login-card" className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100/80 overflow-hidden relative transition-all duration-300 hover:shadow-2xl">
        
        {/* Soft background glow accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Banner */}
        <div className="pt-8 pb-6 px-6 text-center border-b border-sky-50 bg-gradient-to-b from-sky-50/50 to-white">
          <div className="flex flex-col items-center justify-center select-none">
            {/* Custom high-quality Sachi logo mockup rendered natively */}
            <svg viewBox="0 0 320 180" className="h-20 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sachiHeartGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA000" />
                  <stop offset="50%" stopColor="#FFC107" />
                  <stop offset="100%" stopColor="#FF8F00" />
                </linearGradient>
              </defs>
              <text
                x="160"
                y="105"
                fill="#1C4EB1"
                textAnchor="middle"
                style={{
                  fontFamily: '"Outfit", "Inter", sans-serif',
                  fontWeight: '800',
                  fontSize: '85px',
                  letterSpacing: '-2px'
                }}
              >
                Sachi
              </text>
              <g transform="translate(254, 25)">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="url(#sachiHeartGradLogin)"
                  transform="scale(1.5)"
                />
                <circle cx="15" cy="11.5" r="2.5" fill="#FFFFFF" />
                <circle cx="21" cy="14" r="1.5" fill="#FFFFFF" />
              </g>
              <text
                x="160"
                y="155"
                fill="#0B3C9B"
                textAnchor="middle"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: '900',
                  fontSize: '22px',
                  letterSpacing: '3px'
                }}
              >
                CHĂM SÓC BÉ YÊU
              </text>
            </svg>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">HỆ THỐNG QUẢN LÝ TÁC VỤ & BÁO CÁO</p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold font-display text-slate-800">Đăng Nhập Hệ Thống</h2>
            <p className="text-xs text-slate-500 mt-1">Sử dụng tài khoản nội bộ được cấp phép để truy cập</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label htmlFor="username-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LucideIcon name="User" size={17} />
                </div>
                <input
                  id="username-input"
                  type="text"
                  placeholder="Nhập tên đăng nhập (e.g. Anh Ruby)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:bg-slate-50/50 transition-all font-medium text-slate-800"
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LucideIcon name="Lock" size={17} />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:bg-slate-50/50 transition-all font-mono text-slate-800"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  disabled={isLoading}
                >
                  <LucideIcon name={showPassword ? 'EyeOff' : 'Eye'} size={17} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div id="login-error" className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs animate-fade-in">
                <div className="mt-0.5 shrink-0">
                  <LucideIcon name="AlertTriangle" size={14} className="text-rose-500" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-sky-500/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác minh...</span>
                </>
              ) : (
                <>
                  <LucideIcon name="LogIn" size={17} />
                  <span>Xác nhận đăng nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Quick instructions for internal staff convenience */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium">Sachi Work Management • Bảo mật nội bộ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
