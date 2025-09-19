interface Otp {
  email?: string;
  otp: number;
  otpExpire: Date;
  isotpsend?: boolean;
  otpVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export { Otp };
