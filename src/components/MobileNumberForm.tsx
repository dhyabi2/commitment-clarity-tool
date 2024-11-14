import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface MobileNumberFormProps {
  onSubmit: (mobileNumber: string) => void;
}

const MobileNumberForm = ({ onSubmit }: MobileNumberFormProps) => {
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.trim()) {
      onSubmit(mobileNumber);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-20">
      <h2 className="text-xl font-semibold mb-4">Enter Your Mobile Number</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Enter your mobile number"
          required
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Card>
  );
};

export default MobileNumberForm;