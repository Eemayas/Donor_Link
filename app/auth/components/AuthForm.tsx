/** @format */
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useCallback, useState } from "react";
import { GoogleIcon } from "@/components/social-icons/icons";
import { z } from "zod";
import Link from "next/link";

export function AuthForm() {
  const emailSchema = z.string().email("Invalid email address");
  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    );
  const [emailError, setEmailError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [isRegistering, setisRegisteringing] = useState(false);

  const handleValidationError = useCallback(
    (
      error: unknown,
      setError: React.Dispatch<React.SetStateAction<string | null>>,
    ) => {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("An unknown error occurred");
      }
    },
    [],
  );

  const validateEmail = useCallback(
    (value: string) => {
      try {
        emailSchema.parse(value);
        setEmailError(null);
      } catch (error) {
        handleValidationError(error, setEmailError);
      }
    },
    [handleValidationError],
  );

  const validatePassword = useCallback(
    (value: string) => {
      try {
        passwordSchema.parse(value);
        setPasswordError(null);
        if (isRegistering && confirmPassword && value !== confirmPassword) {
          setConfirmPasswordError("Passwords do not match");
        } else {
          setConfirmPasswordError(null);
        }
      } catch (error) {
        handleValidationError(error, setPasswordError);
      }
    },
    [confirmPassword, isRegistering, handleValidationError],
  );

  const validateConfirmPassword = useCallback(
    (value: string) => {
      setConfirmPasswordError(
        value !== password ? "Passwords do not match" : null,
      );
    },
    [password],
  );
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isRegistering) {
      console.log("Registering user:", email, password, confirmPassword);
    } else {
      console.log("Signing in user:", email, password);
    }
  };

  return (
    <Card className="w-[300px] sm:w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {isRegistering ? "Create an account" : "Sign in"}
        </CardTitle>
        <CardDescription>
          {isRegistering
            ? "Enter your email below to create your account"
            : "Enter your email and password to sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline">
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <InputField
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              value={email}
              onChanged={(e) => setEmail(e.target.value)}
              validationError={emailError}
              validate={validateEmail}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <InputField
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChanged={(e) => setPassword(e.target.value)}
              validationError={passwordError}
              validate={validatePassword}
            />
            {!isRegistering ? (
              <Link
                href="#"
                className="ml-auto inline-block text-xs font-bold text-blue-500 underline"
              >
                Forgot your password?
              </Link>
            ) : (
              ""
            )}
          </div>
          {isRegistering && (
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChanged={(e) => setConfirmPassword(e.target.value)}
                validationError={confirmPasswordError}
                validate={validateConfirmPassword}
              />
            </div>
          )}{" "}
          <Button
            type="submit"
            disabled={!!(passwordError || confirmPasswordError || emailError)}
            className="w-full"
          >
            {isRegistering ? "Create account" : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase"></div>
      </div>

      <div className="my-5 bg-background px-2 text-center text-xs uppercase">
        {isRegistering
          ? "Or Already have an Account? "
          : "Or Register with a new account? "}
        <Button
          variant="link"
          className="p-0 text-xs font-bold text-blue-500 underline"
          onClick={() => setisRegisteringing(!isRegistering)}
        >
          {isRegistering ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </Card>
  );
}
