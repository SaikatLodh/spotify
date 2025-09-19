import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import SignupGoogle from "./SignupGoogle";

const GoogleSignupWrapper = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID_FOR_GOOLE!}
    >
      <SignupGoogle></SignupGoogle>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignupWrapper;
