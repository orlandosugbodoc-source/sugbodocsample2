import React from 'react';
import { Settings, Building, Sliders, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const SettingsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" /> Clinic Settings & Configuration
        </h1>
        <p className="text-xs text-text-muted">Master facility metadata, consultation fees, and system parameters</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle><Building className="h-4 w-4 text-primary" /> Facility Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 text-xs">
          <Input label="Facility Name" defaultValue="SugboDoc Medical Center & Diagnostic Laboratory" />
          <Input label="Clinic Address" defaultValue="142 Mango Ave, Cebu City, 6000 Philippines" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Contact Phone" defaultValue="(032) 412-9000" />
            <Input label="Facility PhilHealth Accreditation No." defaultValue="PH-ACCRED-90812" />
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary">Save Configuration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
