"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-40 group-hover:opacity-70 transition-opacity" />
        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg p-1.5">
          <FileText className={`${sizeClasses[size]} text-white`} />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${textClasses[size]}`}>
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
            Career
          </span>
          <span className="text-foreground">Forge</span>
        </span>
      )}
    </Link>
  );
}
