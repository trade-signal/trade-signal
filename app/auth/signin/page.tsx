"use client";

import AuthorizationModal from "@/app/components/AuthorizationModal";

const SignIn = () => {
  return (
    <AuthorizationModal
      type="signin"
      withCloseButton={false}
      visible={true}
      onClose={() => {}}
    />
  );
};

export default SignIn;
