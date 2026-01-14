"use client";

import { useState } from "react";

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

export function AccountSwitcher({
  users,
}: {
  readonly users: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const [activeUser, setActiveUser] = useState(users[0]);
  const toTitleCase = (s: string) =>
    s
      .trim()
      .split(/\s+/)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

  const displayNameFor = (name?: string) => (name && name.trim() ? toTitleCase(name) : "Unnamed");
  const initialsFor = (name?: string) => (name && name.trim() ? getInitials(toTitleCase(name)) : "UN");

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={activeUser.avatar || undefined} alt={displayNameFor(activeUser.name)} />
          <AvatarFallback className="rounded-lg">{initialsFor(activeUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {users.map((user) => (
          <DropdownMenuItem
            key={user.email}
            className={cn("p-0", user.id === activeUser.id && "border-l-2 border-l-primary bg-accent/50")}
            onClick={() => setActiveUser(user)}
          >
            <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
                <Avatar className="size-9 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={displayNameFor(user.name)} />
                <AvatarFallback className="rounded-lg">{initialsFor(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayNameFor(user.name)}</span>
                <span className="truncate text-xs capitalize">{user.role}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
