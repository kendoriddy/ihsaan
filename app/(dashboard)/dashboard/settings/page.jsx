"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import RequireAuth from "@/app/lib/ReuquireAuth";
import FormikControl from "@/components/validation/FormikControl";
import { Formik, Form } from "formik";
import AuthButton from "@/components/AuthButton";

function Page({ params }) {
  const currentRoute = usePathname();
  const user = useSelector(currentlyLoggedInUser);

  return (
    <RequireAuth>
      <Header />
      <main className=" py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />
        <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
          <div className="px-4  w-full py-8 lg:py-0">
            <form action="">
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="First Name"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="text"
                  name="middlename"
                  id="firstname"
                  placeholder="Second Name"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="text"
                  name="lastname"
                  id="firstname"
                  placeholder="Last Name"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Summary */}
              <div className="py-3">
                <textarea
                  name="professionalSummary"
                  id="professionalSummary"
                  cols="30"
                  rows="10"
                  placeholder="Professional summary"
                  className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* DoB and Gender */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="date"
                  name="DOB"
                  id="DOB"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />

                <select
                  name="gender"
                  id="gender"
                  // placeholder="Gender"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                >
                  <option value="Gender" className="bg-gray-400">
                    Select Your gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Email */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="number"
                  name="mobile"
                  id="mobile"
                  placeholder="Mobile number"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Address */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Aaddress"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* City */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="text"
                  name="state"
                  id="state"
                  placeholder="State"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Zip */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="number"
                  name="zipcode"
                  id="zipcode"
                  placeholder="Zip Code"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Country"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Company */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="company"
                  id="company"
                  placeholder="Company"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="text"
                  name="jobRole"
                  id="jobRole"
                  placeholder="Job Role"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Academic Qualification */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="academicQualification"
                  id="academicQualification"
                  placeholder="Highest Academic Qualification"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="file"
                  name="certificate"
                  id="certificate"
                  placeholder="Upload Certificate"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Institution */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="institution"
                  id="institution"
                  placeholder="Name of Institution"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Personal Qualification */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="personalQualification"
                  id="personalQualification"
                  placeholder="Professional Qualification"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="url"
                  name="linkToCertificate"
                  id="linkToCertificate"
                  placeholder="Link to Certificate"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Preferred Mentoring Field */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="preferredMentoringField"
                  id="preferredMentoringField"
                  placeholder="Preferred Mentoring Field"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="number"
                  name="monthlyRate"
                  id="monthlyRate"
                  placeholder="Monthly Rate"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="text"
                  name="oneTimeField"
                  id="oneTimeField"
                  placeholder="One Time Field"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Languages */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="text"
                  name="languages"
                  id="languages"
                  placeholder="Languages"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <select
                  name="maritalStatus"
                  id="maritalStatus"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                >
                  <option value="" className="bg-gray-400">
                    Marital Status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
                <input
                  type="text"
                  name="mentoringAvailability"
                  id="mentoringAvailability"
                  placeholder="Mentoring Availability"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* LinedIn */}
              <div className=" flex gap-4 flex-col lg:flex-row py-3">
                <input
                  type="url"
                  name="linkedInURL"
                  id="linkedInURL"
                  placeholder="LinkendIn Profile"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />

                <input
                  type="url"
                  name="CVURL"
                  id="CVURL"
                  placeholder="Link to CV"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
                <input
                  type="url"
                  name="profilePageURL"
                  id="profilePageURL"
                  placeholder="Profile Page"
                  className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                />
              </div>

              {/* Check boxes */}
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="accurateInformation"
                    id="accurateInformation"
                    className="bg-gray-100 border-2 border-gray-400 rounded"
                  />
                  <label htmlFor="accurateInformation">
                    I attest that all information supplied is correct
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="backgroundCheck"
                    id="backgroundCheck"
                    className="bg-gray-100 border-2 border-gray-400 rounded"
                  />
                  <label htmlFor="backgroundCheck">Ihsaan can run background checks about me</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="lawfulTransaction"
                    id="lawfulTransaction"
                    className="bg-gray-100 border-2 border-gray-400 rounded"
                  />
                  <label htmlFor="lawfulTransaction">
                    No unlawful transactions in a way that goes against YRMs instructions or legal
                    laws
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="newsletter"
                    id="newsletter"
                    className="bg-gray-100 border-2 border-gray-400 rounded"
                  />
                  <label htmlFor="newsletter">I want to receive monthly newsletters</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="bg-gray-100 border-2 border-gray-400 rounded"
                  />
                  <label htmlFor="terms">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600">
                      Terms & Conditions
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-center py-4">
                <button type="submit" className="theme-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </RequireAuth>
  );
}

export default Page;
