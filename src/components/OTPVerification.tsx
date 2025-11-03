import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield } from "lucide-react";
import { toast } from "sonner";

interface OTPVerificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: () => void;
  purpose: string;
}

export const OTPVerification = ({ open, onOpenChange, onVerify, purpose }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Simulated OTP - In production, this would be sent via SMS/Email
  const correctOTP = "123456";

  const handleVerify = () => {
    setVerifying(true);
    
    // Simulate verification delay
    setTimeout(() => {
      if (otp === correctOTP) {
        toast.success("OTP Verified!", {
          description: "Your action has been authenticated"
        });
        onVerify();
        onOpenChange(false);
        setOtp("");
      } else {
        toast.error("Invalid OTP", {
          description: "Please check and try again. Demo OTP: 123456"
        });
      }
      setVerifying(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            OTP Verification
          </DialogTitle>
          <DialogDescription>
            Enter the OTP sent to your registered contact for {purpose}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Demo OTP: <span className="font-mono font-bold">123456</span></p>
            <p className="text-xs mt-1">In production, this would be sent via SMS/Email</p>
          </div>

          <Button 
            onClick={handleVerify} 
            className="w-full"
            disabled={otp.length !== 6 || verifying}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
