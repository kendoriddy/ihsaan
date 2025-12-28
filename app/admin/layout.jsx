"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuth, userRole } from "@/utils/redux/slices/auth.reducer";
import Loader from "@/components/Loader";

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);
  const roles = useSelector(userRole);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Allow access to admin login page (which redirects to /login)
    if (pathname === "/admin/login") {
      setIsChecking(false);
      setIsAuthorized(true);
      return;
    }

    // Check authentication
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isAuthenticated = isAuth || !!token;

    if (!isAuthenticated) {
      setIsChecking(false);
      setIsAuthorized(false);
      router.push("/login");
      return;
    }

    // Check admin role
    let userRoles = roles;
    if (!userRoles || userRoles.length === 0) {
      try {
        const rolesStr = typeof window !== "undefined" ? localStorage.getItem("roles") : null;
        if (rolesStr) {
          userRoles = JSON.parse(rolesStr);
        }
      } catch (error) {
        console.error("Error parsing roles:", error);
      }
    }

    const hasAdminRole =
      (Array.isArray(userRoles) && (userRoles.includes("ADMIN") || userRoles.includes("SUPERADMIN"))) ||
      (typeof userRoles === "string" && (userRoles === "ADMIN" || userRoles === "SUPERADMIN"));

    if (!hasAdminRole) {
      setIsChecking(false);
      setIsAuthorized(false);
      router.push("/login");
      return;
    }

    setIsChecking(false);
    setIsAuthorized(true);
  }, [pathname, isAuth, roles, router]);

  // Show loader while checking authentication
  if (isChecking) {
    return <Loader />;
  }

  // If not authorized, show loader (redirect is happening)
  if (!isAuthorized) {
    return <Loader />;
  }

  // Render children - let individual pages decide their layout
  // Pages can use AdminLayout component or render their own layout
  return <>{children}</>;
}

