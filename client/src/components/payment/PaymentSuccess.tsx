import { CheckCircle, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

const PaymentSuccess = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center   text-slate-50 p-6 h-full">
        <Card className="w-full max-w-md bg-slate-800 border border-green-700/50 text-slate-50 shadow-2xl">
          <CardHeader className="text-center space-y-4 pt-8">
            <div className="flex justify-center">
              {/* Success Icon: Large, Green, and Animated */}
              <CheckCircle className="h-20 w-20 text-green-500 animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-green-400">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg text-slate-300">
              Welcome back to Spotify Premium.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <p className="text-slate-400 text-center">
              Your subscription is now active. You can immediately enjoy ad-free
              music and all Premium features.
            </p>

            {/* Action Button: Go back to the app (using the purple Spotify brand color) */}
            <div className="pt-2">
              <Link href="/">
                <Button className="w-full bg-[#4CAF50] text-white font-semibold py-3 transition-colors text-lg cursor-pointer">
                  <Music className="mr-2 h-5 w-5" />
                  Start Listening
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-500 text-center pt-2">
              Confirmation sent to your email.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentSuccess;
