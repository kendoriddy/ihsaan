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
import { usePost } from "../hooks/useHttp/useHttp";
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
    <div className="text-[13px] bg-[#7e1a0b] text-white px-6 py-6">
      <div className="flex flex-col md:flex-row justify-evenly py-6 gap-4">
        <div className="flex-1">
          <div className="text-lg font-bold py-3">IHSAAN ACADEMIA</div>
          <p>
            IHSAAN ACADEMIA is dedicated to providing high-quality Islamic
            education, teaching Arabic and other essential subjects to nurture
            strong and knowledgeable Muslims.
          </p>
          <p className="py-2">
            Join our growing community and embark on a journey of learning and
            faith.
          </p>
          <div className="py-2 flex gap-3">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              className="hover:text-[#ff6600]"
            >
              <FacebookIcon />
            </Link>
            <Link
              href="https://www.youtube.com"
              target="_blank"
              className="hover:text-[#ff6600]"
            >
              <YouTubeIcon />
            </Link>
            <Link
              href="https://www.x.com"
              target="_blank"
              className="hover:text-[#ff6600]"
            >
              <XIcon />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              className="hover:text-[#ff6600]"
            >
              <InstagramIcon />
            </Link>
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              className="hover:text-[#ff6600]"
            >
              <LinkedInIcon />
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold py-3">Quick Links</h3>
          <ul>
            <li className="hover:text-[#ff6600]">
              <Link href="/about">About Us</Link>
            </li>
            <li className="hover:text-[#ff6600]">
              <Link href="/courses">Courses</Link>
            </li>
            <li className="hover:text-[#ff6600]">
              <Link href="/faq">FAQs</Link>
            </li>
            <li className="hover:text-[#ff6600]">
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold py-3">Contact Us</h3>
          <div className="flex gap-3">
            <PhoneIcon />
            <Link href="tel:+2348130938573" className="hover:text-[#ff6600]">
              +2348000000000
            </Link>
          </div>
          <div className="flex gap-3 py-1">
            <EmailIcon />
            <Link
              href="mailto:contact@ihsaanacademy.com"
              className="hover:text-[#ff6600]"
            >
              contact@ihsaanacademy.com
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold py-3">
            Subscribe to our Newsletter
          </h3>
          <p>
            Get updates on new courses, events, and learning resources directly
            to your inbox.
          </p>
          <div className="py-3 w-full max-w-[500px]">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={newsLetterSchema}
            >
              <Form>
                <div className="flex flex-col gap-2">
                  <FormikControl
                    placeholder="Enter your email"
                    name="email"
                    className="text-white"
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        color: "#ffffff", // Change text color inside input
                        fontWeight: "bold",
                        padding: "12px", // Adjust padding
                      },
                      "& .MuiInputLabel-root.Mui-error": {
                        color: "#ff6600", // Your custom error color
                        fontWeight: "bold",
                      },
                      "& .MuiOutlinedInput-root.Mui-error": {
                        borderColor: "#ff6600", // Change input border on error
                      },
                      "& .MuiInputLabel-root": {
                        color: "#ffffff", // Change label color
                        fontSize: "1rem",
                        fontWeight: "bold",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#ffffff", // Change color on focus
                      },
                      "& .Mui-error": {
                        color: "red", // Error state color
                      },
                    }}
                  />
                  <AuthButton
                    text="Subscribe"
                    disabled={isLoading}
                    isLoading={isLoading}
                  />
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      <div className="max-w-[700px] m-auto">
        <Divider className="bg-[#ff6600]" />
      </div>

      <div className="py-4 flex flex-col lg:flex-row justify-between text-center gap-3">
        <div>&copy; {footerDate()} IHSAAN ACADEMIA. All rights reserved.</div>
        <div>
          <Link href="/privacy-policy" className="hover:text-[#ff6600]">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="/terms-of-service" className="hover:text-[#ff6600]">
            {" "}
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
