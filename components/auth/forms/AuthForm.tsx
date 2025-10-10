"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";
import SignupForm from "./SignupForm";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const AuthForm = ({ state }: { state: AuthFormType }) => {
  const router = useRouter();
  const [mode, setMode] = useState<AuthFormType>(state || "login");

  const title =
    mode === "login"
      ? "Login"
      : mode === "reset"
      ? "Reset Password"
      : "Sign Up";
  const desc =
    mode === "login"
      ? "Enter your email below to login to your account"
      : mode === "reset"
      ? "Enter your email below to reset your password"
      : "Enter your information below to create your account";

  const Form =
    mode === "login" ? (
      <LoginForm
        onClick={(mode: AuthFormType) => {
          setMode(mode);
          router.push(`${ROUTES.LOGIN}?state=${mode}`);
        }}
      />
    ) : mode === "reset" ? (
      <ResetForm
        onClick={(mode: AuthFormType) => {
          setMode(mode);
          router.push(`${ROUTES.LOGIN}?state=${mode}`);
        }}
      />
    ) : (
      <SignupForm
        onClick={(mode: AuthFormType) => {
          setMode(mode);
          router.push(`${ROUTES.LOGIN}?state=${mode}`);
        }}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center ">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {Form}
    </div>
  );
};

export default AuthForm;
