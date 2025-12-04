"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";

import { verifyPassword } from "@/app/actions";

export function PasswordEntry({ shortCode }: { shortCode: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const isValid = await verifyPassword(shortCode, password);

    if (isValid) {
      router.refresh();
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-default-200">
        <CardHeader className="flex flex-col gap-4 items-center text-center pt-8 pb-0">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
            <Lock size={48} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-success">
              <ShieldCheck size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Secure Access</span>
            </div>
            <h1 className="text-2xl font-bold">Password Protected</h1>
            <p className="text-default-500 px-4">
              This link is password protected. Please enter the credentials to continue.
            </p>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              isRequired
              classNames={{
                inputWrapper: "h-12",
              }}
              errorMessage={error ? "Incorrect password provided" : ""}
              isInvalid={error}
              label="Password"
              labelPlacement="outside"
              placeholder="Enter access password"
              startContent={<KeyRound className="text-default-400" size={18} />}
              type="password"
              value={password}
              variant="bordered"
              onValueChange={(val) => {
                setPassword(val);
                if (error) setError(false);
              }}
            />
            <Button
              className="h-12 font-medium text-medium"
              color="primary"
              endContent={<ArrowRight size={18} />}
              isLoading={isLoading}
              type="submit"
            >
              Unlock Link
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
