"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "font-medium rounded-2xl transition-all duration-300 cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:from-pink-500 hover:to-pink-600",
    secondary:
      "bg-pink-100 text-pink-600 hover:bg-pink-200 border border-pink-200",
    ghost: "text-pink-500 hover:bg-pink-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
