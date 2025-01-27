"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectIsAuth } from "@/utils/redux/slices/auth.reducer";
import Loader from "@/components/Loader";
import path from "path";

const authenticatedRoutes = ["/dashboard"];

export default function RequireAuth({ children }) {
  const pathname = usePathname();
  const { push } = useRouter();
  const isAuth = useSelector(selectIsAuth);
  useEffect(() => {
    if (!isAuth && authenticatedRoutes.includes(pathname)) {
      push("/login");
    }
  }, []);

  if (!isAuth) return <Loader />;

  return <>{children}</>;
}
