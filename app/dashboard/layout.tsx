"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const pathname = usePathname();
 const paths = pathname.split("/").filter(Boolean);

 return (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   <div className="mb-6">
    <Breadcrumbs>
     <BreadcrumbItem href="/">Home</BreadcrumbItem>
     {paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1;

      return (
       <BreadcrumbItem key={path} href={href} isCurrent={isLast}>
        {path.charAt(0).toUpperCase() + path.slice(1)}
       </BreadcrumbItem>
      );
     })}
    </Breadcrumbs>
   </div>
   {children}
  </div>
 );
}
