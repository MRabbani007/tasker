"use client";

import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export default function ProfileHydrator({
  profile,
}: {
  profile?: ProfileDto | null;
}) {
  const { setProfile } = useUser();

  useEffect(() => {
    if (profile !== undefined) setProfile(profile);
  }, [profile]);
  return null;
}
