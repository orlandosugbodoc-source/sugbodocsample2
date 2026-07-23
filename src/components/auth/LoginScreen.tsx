import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const LoginScreen: React.FC = () => {
  const { login } = useEMR();
  const [email, setEmail] = useState('doctor@sugbodoc.com');
  const [password, setPassword] = useState('••••••••••••');
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('doctor');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-4 select-none">
      {/* Outer Branding Container */}
      <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Official SugboDoc Logo Outside at the Top Center of Modal */}
        <div className="flex flex-col items-center justify-center space-y-2">
          {!logoError ? (
            <img 
              src="https://sugbodoc.com/public/assets/images/brand/logo.png" 
              alt="SugboDoc Official Logo" 
              onError={() => setLogoError(true)}
              className="h-10 w-auto object-contain drop-shadow-2xs" 
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#4454c3] flex items-center justify-center text-white font-bold text-lg font-sans shadow-md">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SUGBODOC EMR</span>
            </div>
          )}
          <p className="text-xs font-medium text-slate-500">Outpatient Electronic Medical Record System</p>
        </div>

        {/* Minimalist Centered Login Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500">Enter your credentials to access the EMR system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address or Username"
              type="email"
              placeholder="e.g. doctor@sugbodoc.com"
              icon={<Mail className="h-4 w-4 text-slate-400" />}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              icon={<Lock className="h-4 w-4 text-slate-400" />}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full h-10 text-xs font-semibold tracking-wide justify-center shadow-2xs"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to SugboDoc EMR
            </Button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-400">
          SugboDoc Healthcare Systems • Secure Outpatient Portal
        </div>
      </div>
    </div>
  );
};
