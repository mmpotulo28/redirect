"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRef, useState } from "react";
import { mutate } from "swr";

import { createRedirect } from "@/hooks/use-redirects";

export function CreateRedirectForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createRedirect({
        targetUrl: formData.get("targetUrl") as string,
        shortCode: formData.get("shortCode") as string,
        description: formData.get("description") as string,
      });
      mutate("/api/redirects");
      ref.current?.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={ref}
      className="flex flex-col md:flex-row gap-4 items-stretch md:items-end"
      onSubmit={handleSubmit}
    >
      <Input
        required
        className="flex-1"
        label="Target URL"
        name="targetUrl"
        placeholder="https://example.com"
        type="url"
      />
      <Input
        className="w-full md:w-48"
        label="Short Code (Optional)"
        name="shortCode"
        placeholder="custom-code"
      />
      <Input
        className="w-full md:w-64"
        label="Description (Optional)"
        name="description"
        placeholder="Marketing campaign"
      />
      <Button
        className="w-full md:w-auto"
        color="primary"
        isLoading={isLoading}
        type="submit"
      >
        Create
      </Button>
    </form>
  );
}
