"use client";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputAdornment, IconButton, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerSchema } from "@/components/validationSchemas/ValidationSchema";
import FormikControl from "@/components/validation/FormikControl";
import AuthButton from "@/components/AuthButton";
import { Formik, Form } from "formik";
import { usePost } from "@/hooks/useHttp/useHttp";
import Autocomplete from "@mui/material/Autocomplete";

function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    roles: ["user"], // Default role includes "user"
  };

  const roleOptions = [
    "user",
    "admin",
    "super admin",
    "counsellee",
    "counsellor",
    "mentee",
    "mentor",
    "visitor",
  ];

  const { mutate, isLoading } = usePost("/auth/register", {
    onSuccess: (response) => {
      toast.info(
        "Registration successful. Please verify your email by clicking the link sent to your mail."
      );
      router.push("/");
    },
    onError: (error) => {
      const errorMessage = error.response.data.email
        ? error.response.data.email.join(", ")
        : "An error occurred";
      console.log(errorMessage);
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (values) => {
    const { first_name, last_name, email, password, roles } = values;
    const payload = {
      first_name,
      last_name,
      email,
      password,
      roles, // Pass the selected roles array
    };
    mutate(payload);
  };

  return (
    <div>
      <main className="h-screen w-screen flex items-center justify-center bg-blue-100">
        <section className="xs:w-[320px] p-2 sm:p-1 w-[500px] h-[700px] rounded-r-md text-center bg-slate-50">
          <div className="w-full h-full flex justify-center items-center flex-col gap-8">
            <div>
              <div className="text-2xl py-4">Register</div>
              <div>Access to our dashboard</div>
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="col-span-6">
                          <FormikControl name="first_name" placeholder="First Name" />
                        </div>
                        <div className="col-span-6">
                          <FormikControl name="last_name" placeholder="Last Name" />
                        </div>
                      </div>

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
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
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
                          placeholder="Confirm Password"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>

                      {/* Role selection using Autocomplete */}
                      <div>
                        <Autocomplete
                          multiple
                          options={roleOptions}
                          value={values.roles}
                          onChange={(event, newValue) => setFieldValue("roles", newValue)}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" placeholder="Roles" />
                          )}
                        />
                      </div>

                      <div>
                        <AuthButton
                          text="Register"
                          isLoading={isLoading}
                          disabled={isLoading}
                          onClick={handleSubmit}
                        />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="xs:flex xs:flex-col sm:flex sm:flex-row items-center gap-2 text-gray-600">
              <p>Already have an account?</p>
              <Link className="hover:text-red-600 transition-all duration-300" href={"/login"}>
                Login
              </Link>{" "}
              <p>or</p>
              <Link className="hover:text-red-600 transition-all duration-300" href="/">
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
