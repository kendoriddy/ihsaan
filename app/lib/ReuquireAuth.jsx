"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectIsAuth, userRole } from "@/utils/redux/slices/auth.reducer";
import Loader from "@/components/Loader";

export default function RequireAuth({ children }) {
  const pathname = usePathname();
  const { push } = useRouter();
  const isAuth = useSelector(selectIsAuth);
  const roles = useSelector(userRole);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Check if route requires authentication
      const isDashboardRoute = pathname.startsWith("/dashboard");
      const isAdminRoute = pathname.startsWith("/admin");
      const isAdminLoginRoute = pathname === "/admin/login";

      // Allow access to admin login page without auth (it redirects to /login)
      if (isAdminLoginRoute) {
        setIsChecking(false);
        return;
      }

      // Check if user is authenticated
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const isAuthenticated = isAuth || !!token;

      // Require authentication for dashboard routes, admin routes, and any route using this component
      if (!isAuthenticated) {
        // Not authenticated - redirect to login
        push("/login");
        return;
      }

      // For admin routes, check if user has admin role
      if (isAdminRoute && !isAdminLoginRoute) {
        let userRoles = roles;
        
        // If roles not in Redux, check localStorage
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

        // Check if user has admin or superadmin role
        const hasAdminRole = 
          (Array.isArray(userRoles) && (userRoles.includes("ADMIN") || userRoles.includes("SUPERADMIN"))) ||
          (typeof userRoles === "string" && (userRoles === "ADMIN" || userRoles === "SUPERADMIN"));

        if (!hasAdminRole) {
          // User doesn't have admin role - redirect to login
          push("/login");
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, isAuth, roles, push]);

  // Show loader while checking authentication
  if (isChecking) {
    return <Loader />;
  }

  // If not authenticated, don't render children (redirect is happening)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = isAuth || !!token;
  
  if (!isAuthenticated) {
    return <Loader />;
  }

  // For admin routes, verify admin role before rendering
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname === "/admin/login";
  
  if (isAdminRoute && !isAdminLoginRoute) {
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
      return <Loader />;
    }
  }

  return <>{children}</>;
}
