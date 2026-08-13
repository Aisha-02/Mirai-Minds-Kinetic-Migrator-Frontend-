"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthSession,
  fetchCurrentUser,
  getStoredAuthUser,
  homePathForRole,
  storeAuthSession,
  type AuthUser,
  type UserRole,
} from "@/lib/api/auth";
import { getAuthToken } from "@/lib/api/http";

type RequireAuthProps = {
  children: ReactNode;
  roles?: UserRole[];
};

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const rolesKey = useMemo(() => (roles ? roles.join(",") : ""), [roles]);

  useEffect(() => {
    let cancelled = false;
    const allowedRoles = rolesKey
      ? (rolesKey.split(",") as UserRole[])
      : undefined;

    async function verify() {
      const token = getAuthToken();
      if (!token) {
        router.replace("/signin");
        return;
      }

      try {
        const me = await fetchCurrentUser();
        if (cancelled) return;
        storeAuthSession(token, me);

        if (allowedRoles && !allowedRoles.includes(me.role)) {
          router.replace(homePathForRole(me.role));
          return;
        }

        setUser(me);
      } catch {
        clearAuthSession();
        if (!cancelled) {
          router.replace("/signin");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    const cached = getStoredAuthUser();
    if (cached && (!allowedRoles || allowedRoles.includes(cached.role))) {
      setUser(cached);
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [router, rolesKey]);

  if (checking && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-on-surface">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Checking session…
        </p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
