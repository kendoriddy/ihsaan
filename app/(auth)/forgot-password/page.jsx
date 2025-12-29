"use client";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { usePost } from "@/hooks/useHttp/useHttp";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ForgotPasswordSchema } from "@/components/validationSchemas/ValidationSchema";
import FormikControl from "@/components/validation/FormikControl";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";

function Page() {
  const router = useRouter();
  const intialValues = {
    email: "",
  };
  const { mutate, isLoading } = usePost("/auth/password-reset/", {
    onSuccess: (response) => {
      const { data } = response;
      toast.info(data.message);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    },
    onError: (error) => {
      console.log(error, "what is this error");
      Swal.fire({
        title: error.response.data.detail,
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
              <div className="text-2xl py-4">Forgot Password</div>
              <div>Enter your email to get a password reset link</div>
            </div>

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
              Remeber Password ?{" "}
              <Link
                href={"/login"}
                className="hover:text-red-600 transition-all duration-300"
              >
                Login
              </Link>{" "}
              or{" "}
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
