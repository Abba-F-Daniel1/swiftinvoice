import React from "react";
import { SignIn } from "@clerk/clerk-react"; // Import Clerk's SignIn component

const SignInPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
