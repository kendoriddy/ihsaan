"use client";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import GoogleIcon from "@mui/icons-material/Google";
import FormikControl from "@/components/validation/FormikControl";
import { Form, Formik } from "formik";
import { LoginSchema } from "@/components/validationSchemas/ValidationSchema";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { usePost } from "@/hooks/useHttp/useHttp";
import AuthButton from "@/components/AuthButton";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUserSuccess } from "@/utils/redux/slices/auth.reducer";
import { toast } from "react-toastify";

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
      const roles = data && data?.roles;

<<<<<<< HEAD
      if (roles?.includes("ADMIN") || roles?.includes("SUPERADMIN")) {
=======
      if (roles?.includes("admin") || roles?.includes("super admin")) {
>>>>>>> 18fd2aa (initial)
        dispatch(loginUserSuccess(data));
        router.push("/admin/dashboard");
        toast.success("Logged in successfully");
      } else {
        toast.error("You do not have the necessary role to login");
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const handleSubmit = (values, { resetForm }) => {
    mutate(values);
  };
  return (
    <div>
      <main className="h-screen w-screen flex items-center justify-center bg-blue-100">
        <section className="w-[350px] bg-blue-600 h-[500px] rounded-l-md hidden md:block">
          {" "}
        </section>

        <section className="w-[350px]  h-[500px] rounded-r-md text-center bg-slate-50">
          <div className="w-full h-full flex justify-center items-center flex-col gap-4">
            <div>
              <div className="text-2xl py-4">Login</div>
              <div>Access to our dashboard</div>
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
<<<<<<< HEAD
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
=======
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
>>>>>>> 18fd2aa (initial)
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
              Forgot Password ?{" "}
              <Link href="/admin/forgot-password" className=" link">
                <span className=" underline underline-offset-4 cursor-pointer hover:text-blue-500">
                  Click here
                </span>
              </Link>{" "}
            </div>

            <div>
              <Divider>OR</Divider>
            </div>

            <div className="flex items-center gap-2">
              Login with{" "}
              <span className="theme-btn">
                {" "}
                <GoogleIcon sx={{ fontSize: 18 }} />{" "}
              </span>{" "}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LogIn;
