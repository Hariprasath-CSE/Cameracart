import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const signupToast = toast.loading('Creating account...');
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });
            console.log('Registration successful:', response.data);
            toast.success('Account created successfully! Please log in.', {
                id: signupToast,
                style: {
                    background: '#1f3319',
                    color: '#46ec13',
                    border: '1px solid #3f6732'
                }
            });
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
                id: signupToast,
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
                    <h2 className="text-white text-2xl font-bold tracking-tight">HPX Cam</h2>
                </div>

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.02em] mb-3">Join the Pros</h1>
                    <p className="text-[#9fc992] text-base font-medium">Create an account to start your professional journey.</p>
                </div>

                {/* SignUp Form */}
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-white text-sm font-semibold ml-4">Full Name</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9fc992] group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </div>
                            <input
                                className="w-full bg-[#1f3319]/80 border border-[#3f6732] text-white placeholder-[#5d8550] text-base rounded-xl h-14 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-inner"
                                placeholder="Your Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                        <label className="block text-white text-sm font-semibold ml-4">Password</label>
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

                    {/* Role Selection Field */}
                    <div className="space-y-2">
                        <label className="block text-white text-sm font-semibold ml-4">Select Role</label>
                        <div className="flex gap-4">
                            {/* User Role Option */}
                            <label className={`flex-1 cursor-pointer group ${role === 'user' ? 'ring-2 ring-primary' : ''}`}>
                                <div className={`relative bg-[#1f3319]/80 border ${role === 'user' ? 'border-primary' : 'border-[#3f6732]'} rounded-xl h-14 px-5 transition-all duration-300 flex items-center gap-3 hover:border-primary/50`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={role === 'user'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`size-5 rounded-full border-2 ${role === 'user' ? 'border-primary bg-primary' : 'border-[#9fc992]'} flex items-center justify-center transition-all`}>
                                        {role === 'user' && <div className="size-2 rounded-full bg-[#152211]"></div>}
                                    </div>
                                    <span className="material-symbols-outlined text-[20px] text-[#9fc992] group-hover:text-primary transition-colors">person</span>
                                    <span className={`text-base font-semibold ${role === 'user' ? 'text-white' : 'text-[#9fc992]'} group-hover:text-white transition-colors`}>User</span>
                                </div>
                            </label>

                            {/* Admin Role Option */}
                            <label className={`flex-1 cursor-pointer group ${role === 'admin' ? 'ring-2 ring-primary' : ''}`}>
                                <div className={`relative bg-[#1f3319]/80 border ${role === 'admin' ? 'border-primary' : 'border-[#3f6732]'} rounded-xl h-14 px-5 transition-all duration-300 flex items-center gap-3 hover:border-primary/50`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={role === 'admin'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`size-5 rounded-full border-2 ${role === 'admin' ? 'border-primary bg-primary' : 'border-[#9fc992]'} flex items-center justify-center transition-all`}>
                                        {role === 'admin' && <div className="size-2 rounded-full bg-[#152211]"></div>}
                                    </div>
                                    <span className="material-symbols-outlined text-[20px] text-[#9fc992] group-hover:text-primary transition-colors">admin_panel_settings</span>
                                    <span className={`text-base font-semibold ${role === 'admin' ? 'text-white' : 'text-[#9fc992]'} group-hover:text-white transition-colors`}>Admin</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <button
                        className={`w-full h-14 bg-primary hover:bg-[#3bd60f] text-[#152211] text-lg font-bold rounded-full shadow-[0_0_20px_rgba(70,236,19,0.4)] hover:shadow-[0_0_30px_rgba(70,236,19,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                        {!isLoading && (
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        )}
                    </button>
                </form>

                {/* Picture Perfect Divider */}
                <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#3f6732] to-transparent flex-1"></div>
                    <span className="text-[#9fc992] text-sm font-medium">Picture Perfect</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#3f6732] to-transparent flex-1"></div>
                </div>

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <p className="text-[#9fc992] text-sm">
                        Already have an account?
                        <button
                            onClick={() => navigate('/login')}
                            className="text-white font-bold hover:text-primary transition-colors ml-1"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>

            {/* Simple Footer Info */}
            <div className="relative z-10 mt-8 text-[#9fc992]/60 text-xs font-medium tracking-wide text-black font-bold">
                © HP HPX Cam Photography Profession. Professional Gear Market.
            </div>
        </div>
    );
};

export default SignUp;
