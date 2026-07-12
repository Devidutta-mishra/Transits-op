import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full border border-[#2C2C2C] bg-[#141416] p-6 text-left relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#991B1B]" />
        
        <div className="flex items-center gap-3 text-[#EF4444] mb-4">
          <ShieldAlert size={20} />
          <h1 className="text-sm font-bold uppercase tracking-wider">
            ERROR_CODE: 403_ACCESS_DENIED
          </h1>
        </div>

        <p className="text-xs text-[#8E8E93] uppercase tracking-wide mb-2">
          Security Alert: Unauthorized Route Access
        </p>

        <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed mb-6">
          Your account role does not possess the permissions required to view this module. This routing event has been blocked. If you require access to this console, please contact your system administrator.
        </p>

        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="h-9 text-xs"
          >
            Go Back
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            className="h-9 text-xs"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
