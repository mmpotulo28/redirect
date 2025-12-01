"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  <div className="flex items-center justify-center min-h-screen bg-background p-4">
   <Card className="w-full max-w-md">
    <CardHeader className="flex flex-col gap-1 text-center">
     <h1 className="text-xl font-bold">Password Protected</h1>
     <p className="text-small text-default-500">
      This link requires a password to access.
     </p>
    </CardHeader>
    <CardBody>
     <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
       isRequired
       errorMessage={error ? "Incorrect password" : ""}
       isInvalid={error}
       label="Password"
       placeholder="Enter password"
       type="password"
       value={password}
       onValueChange={setPassword}
      />
      <Button color="primary" isLoading={isLoading} type="submit">
       Access Link
      </Button>
     </form>
    </CardBody>
   </Card>
  </div>
 );
}
