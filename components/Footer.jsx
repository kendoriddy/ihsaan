"use client";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Divider from "@mui/material/Divider";
import { usePost } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import { newsLetterSchema } from "./validationSchemas/ValidationSchema";
import FormikControl from "./validation/FormikControl";
import AuthButton from "./AuthButton";
function Footer() {
  const footerDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    if (year > 2024) return `2024-${year}`;
    return year;
  };

  const { mutate: subscribe, isLoading } = usePost("/subscribe-newsletter/", {
    onSuccess: (response, { resetForm }) => {
      toast.success("Subscribed successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const initialValues = {
    email: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const { email } = values;
    const payload = { email: email };
    subscribe(payload);
    resetForm();
  };

  return (
    <div className="text-[13px] bg-neutral-100 px-6">
      {/* top */}
      <div className="flex  flex-col md:flex-row justify-evenly py-6 gap-4">
        {/* Left */}
        <div className="flex-1">
          <div className="text-lg font-bold py-3">Your Right Mentor </div>
          <div>
            YOUR RIGHT MENTORS is at your fingertips to help you find the
            perfect mentors and counsellors, whether you are a beginner or an
            expert. Whether you want to achieve a specific goal or get rid of
            some hurdles in your life, our trained mentors and counsellors will
            guide you to success:
            <Link href={"/mentors"} className="link">
              {" "}
              Mentors{" "}
            </Link>{" "}
            ||
            <Link href={"/counselors"} className="link">
              {" "}
              Counselors{" "}
            </Link>{" "}
            ||
            <Link href={"/courses"} className="link">
              {" "}
              Courses{" "}
            </Link>{" "}
            ||
            <Link href={"/books"} className="link">
              {" "}
              Books{" "}
            </Link>{" "}
            .
            <p className="py-2">
              Join YOUR RIGHT MENTORS family now and start your journey to
              success!
            </p>
            <div className="py-2 flex gap-2">
              <Link
                href={"https://www.facebook.com"}
                target="_blank"
                className="link"
              >
                <FacebookIcon />
              </Link>
              <Link
                href={"https://www.youtube.com"}
                target="_blank"
                className="link"
              >
                <YouTubeIcon />
              </Link>
              <Link href={"https://www.x.com"} target="_blank" className="link">
                <XIcon />
              </Link>
              <Link
                href={"https://www.instagram.com"}
                target="_blank"
                className="link"
              >
                <InstagramIcon />
              </Link>
              <Link
                href={"https://www.linkedin.com"}
                target="_blank"
                className="link"
              >
                <LinkedInIcon />
              </Link>
            </div>
          </div>
        </div>
        {/* Middle */}
        <div className="flex-1 flex flex-col ">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold py-3 ">Quick Links</h3>
            <div>
              <ul>
                <li className="link">
                  <Link href={"/mentors"}>Mentors</Link>
                </li>
                <li className="link">
                  <Link href={"/counselors"}>Counselors</Link>
                </li>
                <li className="link">
                  <Link href={"/courses"}>Courses</Link>
                </li>
                <li className="link">
                  <Link href={"/books"}>Books</Link>
                </li>
                {/* <li className="link">
                  <Link href={"/register"}>Become A Mentor</Link>
                </li> */}
                <li className="link">
                  <Link href={"/blog"}>Blog</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact us */}
          <div>
            <h3 className="text-lg font-bold py-3">Contact Us</h3>
            <div>
              <div className="flex gap-3">
                <span>
                  <PhoneIcon />
                </span>
                <span>
                  <Link href="tel:+2348130938573" className="link">
                    +2348130938573
                  </Link>
                </span>
              </div>
              <div className="flex gap-3 py-1">
                <span>
                  <EmailIcon />
                </span>
                <span>
                  <Link
                    href="mailto:contact@yourrightmentors.com"
                    className="link"
                  >
                    contact@yourrightmentors.com
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex-1  flex flex-col md:items-center ">
          <h3 className="text-lg font-bold py-3">
            Subscribe to our Newsletter
          </h3>

          <p className="max-w-[500px] ">
            Get actionable tips, insights and opportunities around the world to
            help you achieve your goals - delivered straight to your inbox
            weekly (For all: Students, Working Class, Entrepreneurs, Investors,
            Parents, Others.)
          </p>
          {/* Form */}

          <div className="py-3 w-full max-w-[500px] ">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={newsLetterSchema}
            >
              <Form>
                <div className="flex flex-col gap-2">
                  <div>
                    <FormikControl
                      placeholder={"kindly include a valid email"}
                      name={"email"}
                    />
                  </div>
                  <div>
                    <AuthButton
                      text={"subscribe"}
                      disabled={isLoading}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <div className="max-w-[700px] m-auto">
        <Divider />
      </div>

      {/* Bottom */}
      <div className="py-4 flex flex-col lg:flex-row justify-between text-center gap-3">
        <div>
          &copy; {footerDate()} Your Right Mentors. All rights reserved.
        </div>
        <div>
          <Link href={"/privacy-policy"} className="link">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href={"/terms-of-service"} className="link">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
