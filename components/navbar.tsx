import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@heroui/button";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  return (
    <HeroUINavbar
      className="bg-background/70 backdrop-blur-md border-b border-default-100"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <div className="text-primary">
              <Logo />
            </div>
            <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              LinkFlow
            </p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4 items-center">
          <ThemeSwitch />
          <div className="h-6 w-px bg-default-200" />
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                className="font-medium"
                color="primary"
                radius="full"
                variant="shadow"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-primary/20",
                },
              }}
            />
          </SignedIn>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button color="primary" size="sm" variant="flat">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </NavbarContent>
    </HeroUINavbar>
  );
};
