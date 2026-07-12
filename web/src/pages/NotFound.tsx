import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0F10] text-white flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full border border-[#2C2C2C] bg-[#141416] p-6 text-left relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />
        
        <div className="flex items-center gap-3 text-[#D97706] mb-4">
          <AlertCircle size={20} />
          <h1 className="text-sm font-bold uppercase tracking-wider">
            ERROR_CODE: 404 NOT FOUND
          </h1>
        </div>

        <p className="text-xs text-[#8E8E93] uppercase tracking-wide mb-2">
          Routing Alert: Resource Unreachable
        </p>

        <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed mb-6">
          The requested system address does not exist or has been relocated. Please verify your address bar coordinates or return to the main dashboard panel.
        </p>

        <div className="flex justify-end">
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
