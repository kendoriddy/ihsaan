"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import GoogleIcon from "@mui/icons-material/Google";
import FormikControl from "@/components/validation/FormikControl";
import { Form, Formik } from "formik";
import { ForgotPasswordSchema } from "@/components/validationSchemas/ValidationSchema";
import { useRouter } from "next/navigation";
import { usePost } from "@/hooks/useHttp/useHttp";
import AuthButton from "@/components/AuthButton";

function Page() {
  const router = useRouter();
  const intialValues = {
    email: "",
  };
  const { mutate, isLoading } = usePost("api/auth/password-reset", {
    onSuccess: (response) => {
      console.log(response);
      const { data } = response;
      toast.info(data.message);
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = (values) => {
    mutate(values);
  };
  return (
    <div>
      <main className="h-screen w-screen flex items-center justify-center bg-blue-100">
        {/* Left */}
        <section className="w-[350px] bg-blue-600 h-[500px] rounded-l-md hidden md:block">
          {" "}
        </section>
        {/* Right */}
        <section className="w-[350px]  h-[500px] rounded-r-md text-center bg-slate-50">
          <div className="w-full h-full flex justify-center items-center flex-col gap-8">
            {/* Right top */}
            <div>
              <div className="text-2xl py-4">Forgot Password ?</div>
              <div>Enter your email to get a password reset link</div>
            </div>
            {/* Form */}
            <div>
              <Formik
                initialValues={intialValues}
                validationSchema={ForgotPasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ values }) => {
                  return (
                    <Form>
                      <div className="flex flex-col gap-6">
                        <div className="cols-span-4">
                          <FormikControl name="email" placeholder="Email" />
                        </div>

                        <div>
                          <AuthButton
                            text="Request"
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
              Remember your password ?{" "}
              <Link href="/admin/login" className="link">
                Login{" "}
              </Link>{" "}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
