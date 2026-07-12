import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ROLE_LABELS } from '../constants/permissions';
import { ShieldAlert, CircleHelp, Truck, ShieldCheck, Navigation, Wrench, DollarSign, Activity, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const loginSchema = z.object({
  role: z.enum(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] as const, {
    message: 'Role selection is required.',
  }),
  email: z.string().min(1, 'Email is required.').email('Email must be valid.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const roleOptions = [
    { value: 'FLEET_MANAGER', label: ROLE_LABELS.FLEET_MANAGER },
    { value: 'DISPATCHER', label: ROLE_LABELS.DISPATCHER },
    { value: 'SAFETY_OFFICER', label: ROLE_LABELS.SAFETY_OFFICER },
    { value: 'FINANCIAL_ANALYST', label: ROLE_LABELS.FINANCIAL_ANALYST },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      role: undefined,
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, data.role);
      navigate(from, { replace: true });
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white flex flex-col font-mono selection:bg-[#D97706] selection:text-black">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F0F10] border-b border-[#2C2C2C] z-30 flex items-center justify-between px-6 md:px-12 select-none">
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 bg-[#D97706] transform rotate-45 mr-3"></div>
          <span className="text-white font-medium text-sm tracking-wide">TransitOps</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault();
              alert('Contact system administrator at systems-support@transitops.com');
            }}
            className="text-xs text-white hover:text-[#D97706] transition-colors uppercase tracking-wider"
          >
            Support
          </a>
          <CircleHelp size={14} className="text-[#A1A1AA]" />
        </div>
      </header>

      <div className="flex-1 pt-16 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-6 md:px-12 items-stretch gap-12 md:gap-20">
        <div className="flex-1 flex flex-col justify-center text-left py-12 md:py-16 gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-[#D97706] uppercase tracking-widest font-bold">
              ALL-IN-ONE TRANSPORT OPERATIONS PLATFORM
            </span>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white leading-tight">
              Run Your Fleet.<br />
              Move Your Business Forward.
            </h1>
            <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed max-w-lg mt-2">
              TransitOps helps transport and logistics teams manage their entire operations in one place — from fleet and drivers to trips, maintenance, fuel, and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <span className="text-[#D97706]"><Truck size={16} /></span>
              <span className="text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono text-[11px]">Fleet & Vehicle Management</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#D97706]"><ShieldCheck size={16} /></span>
              <span className="text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono text-[11px]">Driver Management & Safety</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#D97706]"><Navigation size={16} /></span>
              <span className="text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono text-[11px]">Trip Dispatch & Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#D97706]"><Wrench size={16} /></span>
              <span className="text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono text-[11px]">Maintenance & Fuel Control</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#D97706]"><DollarSign size={16} /></span>
              <span className="text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono text-[11px]">Expenses & Cost Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#D97706]"><Activity size={16} /></span>
              <span className="text-[#A1A1AA] uppercase tracking-wider font-semibold font-mono text-[11px]">Real-time Operational Insights</span>
            </div>
          </div>

          <div className="w-full max-w-md h-40 border border-[#2C2C2C] bg-[#111111] p-4 flex items-center justify-center relative select-none">
            <div className="absolute top-2 left-3 font-mono text-[8px] text-gray-600 tracking-wider">SYSTEM_DISPLAY_DECK // SIM_PORT_5173</div>
            <svg width="340" height="120" viewBox="0 0 340 120" fill="none" className="opacity-60">
              <rect x="10" y="30" width="80" height="70" stroke="#2C2C2C" strokeWidth="1" />
              <line x1="20" y1="45" x2="60" y2="45" stroke="#2C2C2C" />
              <line x1="20" y1="60" x2="80" y2="60" stroke="#2C2C2C" />
              <line x1="20" y1="75" x2="70" y2="75" stroke="#2C2C2C" />
              
              <rect x="105" y="30" width="120" height="70" stroke="#2C2C2C" strokeWidth="1" />
              <circle cx="165" cy="65" r="22" stroke="#2C2C2C" />
              <path d="M 165 43 A 22 22 0 0 1 187 65" stroke="#D97706" strokeWidth="3" />
              
              <rect x="240" y="30" width="90" height="70" stroke="#2C2C2C" strokeWidth="1" />
              <path d="M 250 85 L 270 50 L 290 75 L 320 40" stroke="#D97706" strokeWidth="1.5" />
              
              <circle cx="280" cy="95" r="1.5" fill="#D97706" />
              <circle cx="290" cy="75" r="2" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm border border-[#2C2C2C] bg-[#111111] p-6 text-left relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

            <div className="mb-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                Welcome Back
              </h2>
              <p className="text-[11px] text-[#A1A1AA] tracking-wide mt-1">
                Sign in to continue to your TransitOps account
              </p>
            </div>

            {authError && (
              <div className="mb-4 border border-[#EF4444] bg-[#EF4444]/10 p-3 flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-[#EF4444] uppercase tracking-wider">AUTH_FAILED</span>
                  <span className="text-[11px] text-white font-sans">{authError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Select
                id="role-select"
                label="Login as"
                placeholder="Select your role"
                options={roleOptions}
                error={errors.role?.message}
                disabled={isSubmitting}
                {...register('role')}
              />

              <Input
                id="email-input"
                label="Email"
                placeholder="Enter your email"
                type="email"
                error={errors.email?.message}
                disabled={isSubmitting}
                {...register('email')}
              />

              <div className="w-full flex flex-col gap-1.5 relative">
                <label htmlFor="password-input" className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="flex h-10 w-full rounded-none border border-[#2C2C2C] bg-[#141416] px-3 py-2 pr-10 text-sm text-white placeholder-[#8E8E93] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="font-mono text-xs text-[#EF4444] mt-0.5">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-1 select-none">
                <label className="flex items-center gap-2 cursor-pointer group text-xs text-[#8E8E93]">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    className="h-4 w-4 bg-[#141416] border border-[#2C2C2C] checked:bg-[#D97706] checked:border-[#D97706] focus:ring-0 rounded-none cursor-pointer appearance-none checked:after:content-['✓'] checked:after:text-black checked:after:font-bold checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[10px] flex-shrink-0"
                    {...register('rememberMe')}
                  />
                  <span className="font-mono uppercase tracking-wider group-hover:text-white transition-colors">Remember me</span>
                </label>
                
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact DevOps / Systems Admin to cycle your security keys.');
                  }}
                  className="text-xs font-mono uppercase tracking-wider text-[#D97706] hover:text-[#B45309] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!isValid}
                className="w-full mt-2 font-mono h-11 tracking-widest text-xs uppercase"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#2C2C2C] text-[10px] text-center text-gray-500 font-sans leading-relaxed select-none">
              By signing in, you agree to our <a href="#terms" className="underline text-gray-400 hover:text-white transition-colors">Terms of Use</a> and <a href="#privacy" className="underline text-gray-400 hover:text-white transition-colors">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
