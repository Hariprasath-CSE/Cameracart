import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loginToast = toast.loading('Authenticating...');
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            console.log('Login successful:', response.data);
            // Store token and user data (including role) in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('role', response.data.user.role);
            toast.success(`Welcome back, ${response.data.user.name}! (${response.data.user.role})`, {
                id: loginToast,
                style: {
                    background: '#1f3319',
                    color: '#46ec13',
                    border: '1px solid #3f6732'
                }
            });
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.', {
                id: loginToast,
                style: {
                    background: '#1f3319',
                    color: '#ff4b4b',
                    border: '1px solid #3f6732'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-display text-white overflow-x-hidden antialiased">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="Blurred photography studio background with camera lenses and soft lighting bokeh"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp8VgFIuNNdWyfzN_OEV9i_34xV7geIvbHt-YR9NVTRXEe6C4OSr8K5s43oGXiFbnvB7BibExreaUXAPexpMgCidCCFp0PD-xKnI3od-Sk_Cu6wOIKNMPFblYKXX-Axvg9vCpRSLreFtJyTXBgVUon48LJ_i65xQ8Y3BYdMFOWiwFH6gnWAR-d0JmY1bvTWUIRSPDAg0WzpIzPPD1CA_rfNmRwllUyqNdJvxPbcQOADOCL7mj74BTCeGpZSrtNTAPAFbd1EmMl3aE"
                />
            </div>

            {/* Main Content Wrapper */}
            <div className="relative z-10 w-full max-w-[520px] glass-panel rounded-lg p-8 md:p-12 animate-fade-in">
                {/* Logo Section */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 text-primary shadow-[0_0_15px_rgba(70,236,19,0.3)]">
                        <span className="material-symbols-outlined text-[24px]">camera</span>
                    </div>
                    <h2 className="text-white text-2xl font-bold tracking-tight">CameraCart</h2>
                </div>

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.02em] mb-3">Welcome Back</h1>
                    <p className="text-[#9fc992] text-base font-medium">Log in to access your pro gear dashboard.</p>
                </div>

                {/* Login Form */}
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="block text-white text-sm font-semibold ml-4">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9fc992] group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <input
                                className="w-full bg-[#1f3319]/80 border border-[#3f6732] text-white placeholder-[#5d8550] text-base rounded-xl h-14 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-inner"
                                placeholder="lensmaster@studio.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-4 mr-2">
                            <label className="block text-white text-sm font-semibold">Password</label>
                            <a className="text-sm font-bold text-primary hover:text-white transition-colors" href="#">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9fc992] group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <input
                                className="w-full bg-[#1f3319]/80 border border-[#3f6732] text-white placeholder-[#5d8550] text-base rounded-xl h-14 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-inner"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9fc992] hover:text-white transition-colors cursor-pointer"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                        className={`w-full h-14 bg-primary hover:bg-[#3bd60f] text-[#152211] text-lg font-bold rounded-full shadow-[0_0_20px_rgba(70,236,19,0.4)] hover:shadow-[0_0_30px_rgba(70,236,19,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                        {!isLoading && (
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        )}
                    </button>
                </form>

                {/* Social Login Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#3f6732] to-transparent flex-1"></div>
                    <span className="text-[#9fc992] text-sm font-medium">Picture Perfect</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#3f6732] to-transparent flex-1"></div>
                </div>

                {/*             
                <div className="flex gap-4 justify-center">
                    <button className="size-12 rounded-full bg-[#1f3319] border border-[#3f6732] flex items-center justify-center hover:bg-[#2c4823] hover:border-primary/50 transition-all duration-300 group">
                        <svg
                            className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    </button>
                    <button className="size-12 rounded-full bg-[#1f3319] border border-[#3f6732] flex items-center justify-center hover:bg-[#2c4823] hover:border-primary/50 transition-all duration-300 group">
                        <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.79.05 1.97-.67 3.28-.59 1.1.08 2.39.44 3.28 1.48-2.91 1.48-2.43 5.42.27 6.47-.54 1.58-1.28 3.12-1.91 4.83zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.33-3.74 4.25z" />
                        </svg>
                    </button>
                </div> */}

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <p className="text-[#9fc992] text-sm">
                        Don't have an account?
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-white font-bold hover:text-primary transition-colors ml-1"
                        >
                            Join the Pros
                        </button>
                    </p>
                </div>
            </div>

            {/* Simple Footer Info */}
            <div className="relative z-10 mt-8 text-[#9fc992]/60 text-xs font-medium tracking-wide text-black font-bold">
                © HP CameraCart Photography Profession. Professional Gear Market.
            </div>
        </div>
    );
};

export default Login;
