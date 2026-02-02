"use client";

import React from "react";
import UserProvider from "./UserContext";

export default function UserProviderContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserProvider>{children}</UserProvider>;
}
