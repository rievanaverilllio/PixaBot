"use client";

import { signIn } from "next-auth/react";
import { siGoogle } from "simple-icons";
import { toast } from "sonner";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={cn(className)}
      onClick={async (e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        try {
          await signIn("google", { callbackUrl: "/dashboard" });
        } catch {
          toast.error("Google sign-in failed");
        }
      }}
      {...props}
    >
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continue with Google
    </Button>
  );
}
