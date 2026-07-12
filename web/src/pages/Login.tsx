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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#000000] border-b border-[#333333] z-30 flex items-center justify-between px-6 md:px-12 select-none">
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 bg-white transform rotate-45 mr-3"></div>
          <span className="text-white font-medium text-sm tracking-wide">TransitOps</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault();
              alert('Contact system administrator at systems-support@transitops.com');
            }}
            className="text-xs text-white hover:text-gray-300 transition-colors uppercase tracking-wider"
          >
            Support
          </a>
          <CircleHelp size={14} className="text-[#A3A3A3]" />
        </div>
      </header>

      <div className="flex-1 pt-16 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-6 md:px-12 items-stretch gap-12 md:gap-20">
        <div className="flex-1 flex flex-col justify-center text-left py-12 md:py-16 gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-[#A3A3A3] font-mono uppercase tracking-widest font-bold">
              ALL-IN-ONE TRANSPORT OPERATIONS PLATFORM
            </span>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white leading-tight">
              Run Your Fleet.<br />
              Move Your Business Forward.
            </h1>
            <p className="text-sm text-[#A3A3A3] font-sans leading-relaxed max-w-lg mt-6">
              TransitOps helps transport and logistics teams manage their entire operations in one place — from fleet and drivers to trips, maintenance, fuel, and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 font-sans text-sm">
            <div className="flex items-center gap-3">
              <span className="text-white"><Truck size={18} strokeWidth={1.5} /></span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-semibold text-[11px]">Fleet & Vehicle Management</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white"><ShieldCheck size={18} strokeWidth={1.5} /></span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-semibold text-[11px]">Driver Management & Safety</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white"><Navigation size={18} strokeWidth={1.5} /></span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-semibold text-[11px]">Trip Dispatch & Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white"><Wrench size={18} strokeWidth={1.5} /></span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-semibold text-[11px]">Maintenance & Fuel Control</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white"><DollarSign size={18} strokeWidth={1.5} /></span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-semibold text-[11px]">Expenses & Cost Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white"><Activity size={18} strokeWidth={1.5} /></span>
              <span className="text-[#A3A3A3] uppercase tracking-wider font-semibold text-[11px]">Real-time Operational Insights</span>
            </div>
          </div>

          <div className="w-full max-w-md h-40 border border-[#333333] bg-[#111111] p-4 flex items-center justify-center relative select-none">
            <div className="absolute top-2 left-3 font-mono text-[8px] text-[#A3A3A3] tracking-wider">SYSTEM_DISPLAY_DECK // SIM_PORT_5173</div>
            <svg width="340" height="120" viewBox="0 0 340 120" fill="none" className="opacity-50">
              <path d="M 30 60 L 100 20 L 180 80 L 260 40 L 310 90" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="4 4" />
              <path d="M 30 60 L 120 100 L 180 80 L 220 10 L 310 90" stroke="#A3A3A3" strokeWidth="1" strokeLinejoin="round" />
              <circle cx="30" cy="60" r="3" fill="#FFFFFF" />
              <circle cx="100" cy="20" r="3" fill="#FFFFFF" />
              <circle cx="120" cy="100" r="3" fill="#FFFFFF" />
              <circle cx="180" cy="80" r="4" fill="#FFFFFF" />
              <circle cx="220" cy="10" r="3" fill="#FFFFFF" />
              <circle cx="260" cy="40" r="3" fill="#FFFFFF" />
              <circle cx="310" cy="90" r="3" fill="#FFFFFF" />
              <circle cx="180" cy="80" r="14" stroke="#FFFFFF" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-sm rounded-xl overflow-hidden border border-[#333333] bg-[#111111] p-6 lg:p-8 text-left relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white" />

            <div className="mb-8 mt-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                Welcome Back
              </h2>
              <p className="text-[12px] text-[#A3A3A3] tracking-wide mt-2">
                Sign in to continue to your TransitOps account
              </p>
            </div>

            {authError && (
              <div className="mb-4 border border-[#EF4444] bg-[#EF4444]/10 p-3 flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-[#EF4444] uppercase tracking-wider">AUTH_FAILED</span>
                  <span className="text-[12px] text-[#EF4444] font-sans">{authError}</span>
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

              <div className="w-full flex flex-col gap-1.5 relative mt-1">
                <label htmlFor="password-input" className="font-sans text-xs uppercase tracking-wider text-[#A3A3A3]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="flex h-12 w-full rounded-md border border-white bg-[#222222] px-4 py-3 pr-12 text-sm text-white placeholder-[#A3A3A3] transition-colors focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#A3A3A3] hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="font-sans text-xs text-[#EF4444] mt-0.5">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 mb-2 select-none">
                <label className="flex items-center gap-2 cursor-pointer group text-xs text-[#A3A3A3]">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    className="h-4 w-4 bg-[#222222] border border-white checked:bg-white checked:border-white focus:ring-0 rounded-[4px] cursor-pointer appearance-none checked:after:content-['✓'] checked:after:text-black checked:after:font-bold checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[10px] flex-shrink-0 transition-all"
                    {...register('rememberMe')}
                  />
                  <span className="font-sans uppercase tracking-wider group-hover:text-white transition-colors">Remember me</span>
                </label>
                
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact DevOps / Systems Admin to cycle your security keys.');
                  }}
                  className="text-xs font-sans uppercase tracking-wider text-white hover:text-gray-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!isValid}
                className="w-full mt-4"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-5 border-t border-[#333333] text-[10px] text-center text-[#A3A3A3] font-sans leading-relaxed select-none">
              By signing in, you agree to our <a href="#terms" className="underline text-gray-400 hover:text-white transition-colors">Terms of Use</a> and <a href="#privacy" className="underline text-gray-400 hover:text-white transition-colors">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
