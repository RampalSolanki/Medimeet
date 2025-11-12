"use client";

import React from "react";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function AuthControls() {
  return (
    <div className="flex items-center space-x-2">
      <SignedOut>
        <SignInButton>
          <Button variant="secondary">Sign In</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "shadow-xl",
              userPreviewMainIdentifier: "font-semibold",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  );
}
