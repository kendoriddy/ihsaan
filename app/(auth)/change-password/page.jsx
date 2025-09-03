"use client";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { usePost } from "@/hooks/useHttp/useHttp";
import { useRouter } from "next/navigation";
import FormikControl from "@/components/validation/FormikControl";
import { InputAdornment, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import { useState } from "react";
import { Formik, Form } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ChangePasswordSchema } from "@/components/validationSchemas/ValidationSchema";
import Swal from "sweetalert2";

function Page() {
  const router = useRouter();
  const intialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const { mutate, isLoading } = usePost("api/auth/login", {
    onSuccess: (response) => {
      console.log(response);
      const { data } = response;
      toast.info(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error) => {
      Swal.fire({
        title: error.message,
        icon: "error",
        customClass: {
          confirmButton: "my-confirm-btn",
        },
      });
    },
  });
  const handleSubmit = (values) => {
    mutate(values);
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
                validationSchema={ChangePasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => {
                  return (
                    <Form>
                      <div className="flex flex-col gap-6">
                        <div>
                          <FormikControl
                            name="old_password"
                            type={!showPassword ? "text" : "password"}
                            placeholder="Enter old Password"
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
                            name="new_password"
                            type={!showPassword ? "text" : "password"}
                            placeholder="Enter New Password"
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
                            text="Submit"
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
