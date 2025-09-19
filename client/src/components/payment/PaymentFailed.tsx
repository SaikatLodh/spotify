"use client";
import { XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

const PaymentFailed = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center  text-slate-50 p-6 h-full">
        <Card className="w-full max-w-md bg-slate-800 border border-red-700/50 text-slate-50 shadow-2xl">
          <CardHeader className="text-center space-y-4 pt-8">
            <div className="flex justify-center">
              <XCircle className="h-20 w-20 text-red-500 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-red-400">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-lg text-slate-300">
              There was an issue processing your subscription payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-400 text-center">
              Your Premium service may be interrupted. Please update your
              payment details or try again.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {/* Primary Action: Retry Payment (using the purple Spotify brand color) */}
              <Link href="/subscription-plan">
                <Button className="w-full  bg-[#4CAF50] text-white font-semibold py-3 transition-colors cursor-pointer">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Payment
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-500 text-center pt-2">
              Error Code: PMT-FAIL-4001
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentFailed;
