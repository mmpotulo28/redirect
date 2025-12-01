"use client";

import { useEffect, useState } from "react";
import { Progress } from "@heroui/progress";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

import { Logo } from "@/components/icons";

export function RedirectInterstitial({ targetUrl }: { targetUrl: string }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          window.location.href = targetUrl;

          return 100;
        }

        return prev + 2; // 50 steps * 60ms = 3000ms approx
      });
    }, 60);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, [targetUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 shadow-2xl border-none bg-content1/50 backdrop-blur-lg">
        <CardBody className="flex flex-col items-center gap-8 text-center">
          <div className="scale-150 text-primary">
            <Logo />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Redirecting you...
            </h1>
            <p className="text-default-500 text-sm">
              You are being redirected to
            </p>
            <div className="bg-default-100 px-4 py-2 rounded-lg break-all text-sm font-mono text-primary">
              {targetUrl}
            </div>
          </div>

          <div className="w-full space-y-2">
            <Progress
              aria-label="Redirecting..."
              className="max-w-md"
              color="primary"
              size="md"
              value={progress}
            />
            <p className="text-tiny text-default-400">
              Automatic redirect in {timeLeft}s
            </p>
          </div>

          <Link
            className="text-sm text-default-500 hover:text-primary transition-colors"
            href={targetUrl}
          >
            Click here if you are not redirected
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
