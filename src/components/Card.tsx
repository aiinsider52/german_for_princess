"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-pink-100 p-6 
        ${hover ? "hover:shadow-md hover:border-pink-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}
