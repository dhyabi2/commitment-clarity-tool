import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface MobileNumberFormProps {
  onSubmit: (mobileNumber: string) => void;
}

const MobileNumberForm = ({ onSubmit }: MobileNumberFormProps) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }
    onSubmit(mobileNumber);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-sage-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-sage-700 mb-6 text-center">
          Enter Your Mobile Number
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MobileNumberForm;