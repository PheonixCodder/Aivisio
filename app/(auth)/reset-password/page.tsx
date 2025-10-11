import ResetPasswordForm from "@/components/auth/forms/ResetPasswordForm";
import Testimonials from "@/components/auth/testimonials/Testimonials";
import Logo from "@/components/ui/Logo";
import Image from "next/image";
import React from "react";


const ResetPasswordPage = async () => {
  return (
    <main className="h-screen grid grid-cols-2 relative">
      <div className="relative w-full flex flex-col bg-muted p-10 text-primary-foreground">
        <div className="w-full h-[20%] bg-gradient-to-t from-transparent to-black/50 absolute top-0 left-0 z-10" />
        <div className="w-full h-[40%] bg-gradient-to-b from-transparent to-black/50 absolute bottom-0 left-0 z-10" />
        <Image
          src="/login-bg.jpeg"
          alt="login-bg"
          fill
          className="w-full h-full object-cover"
        />
        <div className="relative flex items-center z-20">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <Testimonials />
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center p-8 h-full w-full">
        <div className="w-[350px] mx-auto max-w-xl">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
