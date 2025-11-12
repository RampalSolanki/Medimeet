"use client";

import React from "react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function SignUpCTA() {
  return (
    <SignUpButton>
      <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
        <button>Sign Up Now</button>
      </Button>
    </SignUpButton>
  );
}
