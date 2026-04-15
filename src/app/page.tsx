"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadState } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = loadState();
    if (state.onboardingComplete && state.plan) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl animate-float mb-4">💕</div>
          <p className="text-pink-400 text-lg">Загружаем...</p>
        </div>
      </div>
    );
  }

  return null;
}
