import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Stethoscope, UserCheck, HeartPulse, TestTube, CreditCard, Shield } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';

export const LoginScreen: React.FC = () => {
  const { login, staffList } = useEMR();
  const [email, setEmail] = useState('doctor@sugbodoc.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [logoError, setLogoError] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; defaultEmail: string }[] = [
    { role: 'doctor', label: 'Doctor', icon: <Stethoscope className="h-3.5 w-3.5 shrink-0" />, defaultEmail: 'doctor@sugbodoc.com' },
    { role: 'receptionist', label: 'Receptionist', icon: <UserCheck className="h-3.5 w-3.5 shrink-0" />, defaultEmail: 'reception@sugbodoc.com' },
    { role: 'nurse', label: 'Nurse', icon: <HeartPulse className="h-3.5 w-3.5 shrink-0" />, defaultEmail: 'nurse@sugbodoc.com' },
    { role: 'lab_staff', label: 'Lab Tech', icon: <TestTube className="h-3.5 w-3.5 shrink-0" />, defaultEmail: 'lab@sugbodoc.com' },
    { role: 'cashier', label: 'Cashier', icon: <CreditCard className="h-3.5 w-3.5 shrink-0" />, defaultEmail: 'cashier@sugbodoc.com' },
    { role: 'admin', label: 'Admin', icon: <Shield className="h-3.5 w-3.5 shrink-0" />, defaultEmail: 'admin@sugbodoc.com' },
  ];

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    const roleObj = roles.find(item => item.role === r);
    if (roleObj) setEmail(roleObj.defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-4 select-none">
      {/* Outer Branding Container */}
      <div className="w-full max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
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
            <p className="text-xs text-slate-500">Enter your credentials or choose a persona below</p>
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

          {/* Quick Demo Persona Switcher */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>Quick Demo Persona Login</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roles.map(r => {
                const isSelected = selectedRole === r.role;
                const staff = staffList.find(s => s.role === r.role);
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      handleSelectRole(r.role);
                      login(r.role);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-blue-50/80 border-[#4454c3] ring-1 ring-[#4454c3]' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <Avatar src={staff?.avatar} name={staff?.name || r.label} size="sm" />
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold truncate ${isSelected ? 'text-[#4454c3]' : 'text-slate-900'}`}>
                        {r.label}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{staff?.name.split(' ')[0] || r.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-400">
          SugboDoc Healthcare Systems • Demo Access Mode
        </div>
      </div>
    </div>
  );
};
