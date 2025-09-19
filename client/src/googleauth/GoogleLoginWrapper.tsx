import SigninGoogle from "./SigninGoogle";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleLoginWrapper = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID_FOR_GOOLE!}
    >
      <SigninGoogle></SigninGoogle>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginWrapper;
