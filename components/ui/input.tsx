"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

import { Eye, EyeOff } from "lucide-react";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  onChanged?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: (value: string) => void;
  validationError?: string | null;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { className, type, error, validate, validationError, onChanged, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <div className="relative">
          <input
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              error || validationError ? "border-red-500" : "",
              type === "password" ? "pr-10" : "", // padding right to accommodate the icon
              className,
            )}
            ref={ref}
            type={type === "password" && showPassword ? "text" : type}
            onChange={(e) => {
              if (type === "email" || type === "password") {
                validate?.(e.target.value);
              }
              onChanged?.(e);
            }}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {(error || validationError) && (
          <p className="mt-1 text-xs text-red-500">
            {error || validationError}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
