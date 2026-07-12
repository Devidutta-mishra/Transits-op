import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { ShieldOff } from 'lucide-react';
import { Button } from './Button';

interface NoPermissionStateProps {
  moduleName?: string;
  className?: string;
}

export const NoPermissionState: React.FC<NoPermissionStateProps> = ({
  moduleName = 'this module',
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center border border-[#2C2C2C] bg-[#111111] w-full select-none", className)}>
      <div className="w-14 h-14 border border-red-900/30 bg-red-900/10 flex items-center justify-center mb-4">
        <ShieldOff size={24} className="text-red-500" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono mb-1">Access Restricted</h3>
      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wide max-w-sm leading-relaxed">
        Your current role does not have permission to access {moduleName}. Contact your system administrator to request elevated privileges.
      </p>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)} className="h-8 text-[10px]">
          Go Back
        </Button>
        <Button variant="primary" onClick={() => navigate('/')} className="h-8 text-[10px]">
          Dashboard
        </Button>
      </div>
    </div>
  );
};
