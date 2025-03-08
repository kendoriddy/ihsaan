"use client";
import { Formik, Form } from "formik";

import FormikControl from "@/components/validation/FormikControl";
import AuthButton from "@/components/AuthButton";
import { LoginSchema } from "@/components/validationSchemas/ValidationSchema";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { usePost } from "@/hooks/useHttp/useHttp";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { loginUserSuccess } from "@/utils/redux/slices/auth.reducer";
import { IMAGES } from "@/constants";
import Image from "next/image";

const LogIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const intialValues = {
    email: "",
    password: "",
  };

  const { mutate, isLoading } = usePost("/auth/login", {
    onSuccess: (response) => {
      const { data } = response;
      console.log(data, "data sent");

      dispatch(loginUserSuccess({ payload: data }));
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh-token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("roles", JSON.stringify(data.roles));
      router.push("/admin/dashboard");
      toast.success("Logged in successfully");
      data.roles?.includes("ADMIN")
        ? router.push("/admin/dashboard")
        : router.push("/dashboard");
    },
    onError: (error) => {
      console.log(error, "Error occurred");

      // Check if error.response exists
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
      } else if (error.request) {
        // Network error (request was made but no response received)
        toast.error("Network error: Please check your internet connection");
      } else {
        // Some other error occurred
        toast.error("An unknown error occurred");
      }

      toast.error("You do not have the necessary role to login");
    },
  });

  const handleSubmit = (values) => {
    mutate(values);
  };

  return (
    <>
      <main className="h-screen w-screen flex items-center justify-center bg-blue-100">
        <section className="w-[350px] bg-primary h-[500px] rounded-l-md hidden md:flex items-center justify-center">
          <Image src={IMAGES.icon} alt="logo" width={100} height={100} />
        </section>

        <section className="w-[350px]  h-[500px] rounded-r-md text-center bg-slate-50">
          <div className="p-9 flex flex-col gap-3">
            <div className="mt-16">
              <h1 className="text-2xl">Login</h1>
            </div>
            <div>
              <h1 className="text-sm">Access to our Dashboard</h1>
            </div>
            <div>
              <Formik
                initialValues={intialValues}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => {
                  return (
                    <Form>
                      <div className="flex flex-col gap-6">
                        <div>
                          <FormikControl name="email" placeholder="Email" />
                        </div>

                        <div>
                          <FormikControl
                            name="password"
                            type={!showPassword ? "text" : "password"}
                            placeholder="Password"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                        <div>
                          <AuthButton
                            text="Login"
                            isLoading={isLoading}
                            disabled={isLoading}
                            onClick={handleSubmit}
                          />
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            <div className="text-gray-400">
              <h1>
                Forgot your password ?{" "}
                <Link href={"/forgot-password"}>
                  <span className=" underline underline-offset-4 cursor-pointer hover:text-blue-500">
                    Click here
                  </span>
                </Link>
              </h1>
            </div>
            <div className="text-gray-400">
              <h1>
                Dont have an account ?{" "}
                <Link href={"/register"}>
                  <span className="mr-2 cursor-pointer hover:text-blue-500">
                    Register
                  </span>
                </Link>
                <p>or</p>
                <Link href={"/"}>
                  <span className="ml-2 cursor-pointer hover:text-blue-500">
                    Go Home
                  </span>
                </Link>
              </h1>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LogIn;
