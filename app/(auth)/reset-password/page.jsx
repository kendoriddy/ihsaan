"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AuthButton from "@/components/AuthButton";
import FormikControl from "@/components/validation/FormikControl";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { usePost } from "@/hooks/useHttp/useHttp";
import { Formik, Form } from "formik";
import { ResetPasswordSchema } from "@/components/validationSchemas/ValidationSchema";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const intialValues = {
    uid: uid,
    token: token,
    password: "",
    confirm_password: "",
  };
  const { mutate, isLoading } = usePost("/api/auth/password-reset-confirm/", {
    onSuccess: (response) => {
      console.log(response);
      const { data } = response;
      toast.info(data.message || data.detail);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = (values) => {
    const { uid, token, password, confirm_password } = values;
    const payload = {
      uid: uid,
      token: token,
      new_password: password,
      new_password_confirm: confirm_password,
    };
    mutate(payload);
  };
  return (
    <div>
      <main className="h-screen w-screen flex items-center justify-center bg-blue-100">
        <section className="w-[400px] h-[500px] rounded-r-md text-center bg-slate-50">
          <div className="w-full h-full flex justify-center items-center flex-col gap-8">
            <div>
              <div className="text-2xl py-4">Reset Password</div>
            </div>
            <div>
              <Formik
                initialValues={intialValues}
                validationSchema={ResetPasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => {
                  return (
                    <Form>
                      <div className="flex flex-col gap-6">
                        <div>
                          <FormikControl
                            name="password"
                            type={!showPassword ? "text" : "password"}
                            placeholder="Enter new Password"
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
                          <FormikControl
                            name="confirm_password"
                            type={!showPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
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
                            text="Reset Password"
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
              <Link
                className="hover:text-red-600 transition-all duration-300"
                href="/"
              >
                Go Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
