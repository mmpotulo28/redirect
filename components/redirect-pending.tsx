"use client";

import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Logo } from "@/components/icons";

export function RedirectPending() {
 return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
   <Card className="w-full max-w-md p-6 shadow-2xl border-none bg-content1/50 backdrop-blur-lg">
    <CardBody className="flex flex-col items-center gap-8 text-center">
     <div className="scale-150 text-primary">
      <Logo />
     </div>

     <div className="space-y-4">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
       Coming Soon
      </h1>
      <p className="text-default-500">
       This link has been reserved but doesn't have a destination yet.
      </p>
      <div className="p-4 rounded-lg bg-primary/10 text-primary text-sm">
       Please check back later!
      </div>
     </div>

     <Link
      href="/"
      className="text-sm text-default-500 hover:text-primary transition-colors"
     >
      Create your own link
     </Link>
    </CardBody>
   </Card>
  </div>
 );
}
