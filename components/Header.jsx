"use client";
import Link from "next/link";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGES } from "@/constants";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  selectIsAuth,
  currentlyLoggedInUser,
} from "../utils/redux/slices/auth.reducer";
import { logoutUser } from "@/utils/redux/slices/auth.reducer";
import { useDispatch } from "react-redux";
import Modal from "./validation/Modal";
import { toast } from "react-toastify";
import FormikControl from "./validation/FormikControl";
import { Formik, Form } from "formik";
import AuthButton from "./AuthButton";
import { countryNames, allPossibleQualifications } from "@/utils/utilFunctions";
import { useFetch, usePost, useProfileUpdate } from "@/hooks/useHttp/useHttp";
import Loader from "./Loader";
import { useQueryClient } from "@tanstack/react-query";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import NahuProgramme from "./NahuProgramme";
import { getAuthToken } from "@/hooks/axios/axios";
import PrimaryProgramme from "./PrimaryProgramme";
import SecondaryProgramme from "./SecondaryProgramme";
import QuranTutorApplicationModal from "./QuranTutorApplicationModal";
import BecomeTutorForm from "./BecomeTutorForm";

function Header() {
  const currentRoute = usePathname();
  const queryClient = useQueryClient();
  const token = getAuthToken();
  const [isMobileHeaderOpen, setIsMobileHeaderOpen] = useState(false);
  const {
    data: getAuthUserInformation,
    isLoading,
    refetch,
  } = useFetch(
    "authUser",
    typeof window !== "undefined" && localStorage.getItem("token")
      ? `/auth/logged-in-user/`
      : null
  );
  const authenticatedUsersPayload =
    getAuthUserInformation && getAuthUserInformation?.data;
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "userFullData",
      JSON.stringify(getAuthUserInformation?.data),
      localStorage.setItem("userId", getAuthUserInformation?.data.id)
    );
  }

  const isAuth = useSelector(selectIsAuth);
  const signedInUserName = useSelector(currentlyLoggedInUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [programmeOpen, setProgrammeOpen] = useState(false);
  const [type, setType] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [quranTutorModalOpen, setQuranTutorModalOpen] = useState(false);

  const intialValues = {
    first_name: authenticatedUsersPayload?.first_name || "",
    last_name: authenticatedUsersPayload?.last_name || "",
    email: authenticatedUsersPayload?.email || "",
    password: "",
    confirm_password: "",
    role: authenticatedUsersPayload?.role || [],
    country: authenticatedUsersPayload?.country || "",
    professional_bio: authenticatedUsersPayload?.professional_bio || "",
    additional_info: authenticatedUsersPayload?.additional_info || "",
    skills: authenticatedUsersPayload?.skills || "",
    highest_qualification:
      authenticatedUsersPayload?.highest_qualification || "",
    religion: authenticatedUsersPayload?.religion || "",
    gender: authenticatedUsersPayload?.gender || "",
    marital_status: authenticatedUsersPayload?.marital_status || "",
    date_of_birth: authenticatedUsersPayload?.date_of_birth || "",
    preferred_mentee_gender:
      authenticatedUsersPayload?.preferred_mentee_gender || "",
    mentorship_areas: authenticatedUsersPayload?.mentorship_areas || "",
    councelling_areas: authenticatedUsersPayload?.councelling_areas || "",
    years_of_experience: authenticatedUsersPayload?.years_of_experience || "",
    student_application_status:
      authenticatedUsersPayload?.student_application_status || "",
    is_active: authenticatedUsersPayload?.is_active || "",
  };

  const toggleMobileHeader = () => {
    setIsMobileHeaderOpen(!isMobileHeaderOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileHeaderOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpenModal = (mode) => {
    setOpen(true);
  };

  const [mode, setMode] = useState("");
  const handleOpenProgrammeModal = (mode) => {
    setMode(mode);
    setProgrammeOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    router.push("/dashboard");
  };

  const handleCloseProgrammeModal = () => {
    setProgrammeOpen(false);
    router.push("/dashboard");
  };

  console.log(token, "getAuthUserInformation", getAuthUserInformation);

  const { mutate: createNewaccounts, isLoading: isCreating } = usePost(
    "/auth/register",
    {
      onSuccess: () => {
        toast.success(
          "Registration successful. Please verify your email by clicking the link sent to your mail."
        );
        queryClient.invalidateQueries("authUser");
        handleCloseModal();
      },
      onError: (error) => {
        if (error.response && error.response.data) {
          const errors = error.response.data;

          // Convert error object into a string
          const errorMessages = Object.keys(errors)
            .map((key) => `${key}: ${errors[key].join(", ")}`)
            .join("\n");

          // Show all errors in a toast
          toast.error(errorMessages);
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      },
    }
  );
  const handleSubmit = (values) => {
    const {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      country,
      professional_bio,
      additional_info,
      skills,
      highest_qualification,
      religion,
      gender,
      marital_status,
      date_of_birth,
      preferred_mentee_gender,
      councelling_areas,
      mentorship_areas,
      years_of_experience,
    } = values;
    const payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      roles: type === "student" ? ["USER", "STUDENT"] : ["USER", "TUTOR"],
      country: country,
      professional_bio: professional_bio,
      skills: skills,
      highest_qualification: highest_qualification,
      additional_info: additional_info,
      religion: religion,
      gender: gender,
      marital_status: marital_status,
      date_of_birth: date_of_birth,
      preferred_mentee_gender: preferred_mentee_gender,
      mentorship_areas: mentorship_areas,
      years_of_experience: years_of_experience,
      tutor_application_status: "PENDING",
      student_application_status: "PENDING",
      is_active: true,
    };
    createNewaccounts(payload);
  };

  const logOut = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  const isUserMentor = authenticatedUsersPayload?.roles?.includes("mentor");
  const isUserCouncellor =
    authenticatedUsersPayload?.roles?.includes("counsellor");
  const isUserBoth = ["mentor", "counsellor"].every((role) =>
    authenticatedUsersPayload?.roles?.includes(role)
  );
  const countriesList = countryNames.map((country) => {
    return { key: country, value: country.toLowerCase().replace(/\s+/g, "-") };
  });
  const qualificationsList = allPossibleQualifications.map((qualification) => {
    return {
      key: qualification,
      value: qualification.toLowerCase().replace(/\s+/g, "-"),
    };
  });
  // Create an array of numbers from 1 to 100
  const yearsOfExperienceOptions = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
  }));
  const gender = [
    { key: "Male", value: "male" },
    { key: "Female", value: "female" },
  ];
  const programme = [
    { key: "Nahu programme", value: "Nahu programme" },
    { key: "Primary programmes", value: "Primary programmes" },
    { key: "Secondary programmes", value: "Secondary programmes" },
  ];

  const religion = [
    { key: "Islam", value: "islam" },
    { key: "Christanity", value: "christain" },
    { key: "Others", value: "others" },
  ];
  const maritalStatus = [
    { key: "Single", value: "single" },
    { key: "Married", value: "married" },
    { key: "Others", value: "others" },
  ];

  console.log(type, "ppppp");

  useEffect(() => {
    refetch();
  }, [createNewaccounts]);
  return (
    <header
      className="sticky top-0 text-sm z-20 bg-white py-3 px-2 md:px-12 max-w-[100vw]"
      style={{ zIndex: "200" }}
    >
      <div className="flex justify-between items-center py-2 px-0 sm:px-4">
        {/* Logo */}
        <div className="text-lg font-bold">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl">
              <Image src={IMAGES.icon} alt="logo" width={120} height={50} />
              <div>Learning Islam Made Easy</div>
            </Link>
          </div>
        </div>
        <div className="ml-1 md:ml-[50px]">
          {/* <p>Learning Islam Made Easy</p> */}
        </div>
        {/* Desktop menu */}
        <div className="hidden lg:flex-1 lg:flex justify-end">
          <ul className="flex gap-5 items-center text-[16px] font-semibold">
            <li>
              <Link
                href="/"
                className={` navlink ${currentRoute == "/" && "text-primary"}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={` navlink ${
                  currentRoute.includes("/about") && "text-primary"
                }`}
              >
                Why us
              </Link>
            </li>
            <div className="relative text-slate-50 rounded group cursor-pointer">
              <h3 className="text-[16px] font-semibold text-black">
                Qur&apos;an Tutors
              </h3>
              <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] transition-all duration-300 w-[200px]">
                {!isUserMentor && (
                  <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                    <div
                      className="block w-full h-full"
                      onClick={() => router.push("/quran-tutors")}
                    >
                      Pick a Qur'an Tutor
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative text-slate-50 rounded group cursor-pointer">
              <h3 className="text-[16px] font-semibold text-black">Courses</h3>
              <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] transition-all duration-300 w-[200px]">
                <div className="bg-slate-500 px-1 py-2 hover:bg-primary transition-all duration-300">
                  <Link href="/courses" className="block w-full h-full">
                    Take a Course
                  </Link>
                </div>
                <div className="bg-slate-500 px-1 py-2 hover:bg-primary transition-all duration-300">
                  <Link href="/courses" className="block w-full h-full">
                    Upload and Sell a Course
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative text-slate-50 rounded group cursor-pointer">
              <h3 className="text-[16px] font-semibold text-black">
                Programmes
              </h3>
              <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[200px] transition-all duration-300 w-[200px]">
                <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                  <div
                    className="block w-full h-full"
                    onClick={() => {
                      handleOpenProgrammeModal("nahu programme");
                      setType("student");
                    }}
                  >
                    Nahu Programme
                  </div>
                </div>
                <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                  <div
                    className="block w-full h-full"
                    onClick={() => {
                      handleOpenProgrammeModal("Primary Programmes");
                    }}
                  >
                    Primary Programmes
                  </div>
                </div>
                <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                  <div
                    className="block w-full h-full"
                    onClick={() => {
                      handleOpenProgrammeModal("Secondary Programmes");
                    }}
                  >
                    Secondary Programmes
                  </div>
                </div>
              </div>
            </div>

            {isAuth && (
              <li>
                <Link
                  href="/admin/dashboard"
                  className={` navlink ${
                    currentRoute.includes("/dashboard") && "text-primary"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/blog"
                className={` navlink ${
                  currentRoute.includes("/blog") && "text-primary"
                }`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/feedback"
                className={` navlink ${
                  currentRoute.includes("/feedback") && "text-primary"
                }`}
              >
                Feedback
              </Link>
            </li>

            <li>
              <Link href={"/cart"}>
                <Badge
                  // badgeContent={4}
                  color="primary"
                  className="navlink cursor-pointer"
                >
                  <AddShoppingCartIcon />
                </Badge>
              </Link>
            </li>
            <div>
              {isAuth ? (
                <div className="navlink" onClick={logOut}>
                  Logout
                </div>
              ) : (
                <Link href="/login" className="navlink">
                  Login
                </Link>
              )}
            </div>
            {/* Dropdown button */}
            {isUserBoth ? null : (
              <div className="relative text-slate-50 rounded group cursor-pointer">
                <div className="bg-primary px-3 py-2 min-w-[200px] text-center">
                  Register
                </div>
                <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] w-full transition-all duration-300">
                  {!isUserMentor && (
                    <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenModal("student");
                          setType("student");
                        }}
                      >
                        Become a student
                      </div>
                    </div>
                  )}
                  {!isUserCouncellor && (
                    <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenModal("teacher");
                          setType("teacher");
                        }}
                      >
                        Become a tutor
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODAL */}
            <Modal
              title={type === "student" ? "Become a Student" : "Become a Tutor"}
              isOpen={open}
              handleClose={() => setOpen(false)}
            >
              <div>
                {type === "teacher" ? (
                  <BecomeTutorForm
                    onSubmit={handleSubmit}
                    isLoading={isCreating}
                  />
                ) : (
                  <Formik
                    initialValues={intialValues}
                    // validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values }) => {
                      return (
                        <Form>
                          <div className="flex flex-col gap-6">
                            <div>
                              <FormikControl
                                disabled={token ? true : false}
                                name="first_name"
                                placeholder="First name"
                              />
                            </div>
                            <div>
                              <FormikControl
                                disabled={token ? true : false}
                                readOnly={token}
                                name="last_name"
                                placeholder="Last name"
                              />
                            </div>
                            <div>
                              <FormikControl
                                disabled={token ? true : false}
                                name="email"
                                placeholder="Email address"
                              />
                            </div>
                            {!token && (
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
                            )}

                            {!token && (
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
                            )}
                            {type === "tutor" && (
                              <div>
                                <div>
                                  <FormikControl
                                    name="additional_info"
                                    placeholder="List skills related to your field, with comma seperating each"
                                    multiline
                                    minRows={3}
                                  />
                                </div>
                              </div>
                            )}
                            {/* <div>
                            <FormikControl
                              name="years_of_experience"
                              options={programme}
                              control={"select"}
                              placeholder="Select programme you are registering for"
                            />
                          </div> */}
                            {/* <div>
                            <FormikControl
                              name="highest_qualification"
                              options={qualificationsList}
                              control={"select"}
                              placeholder="Select your highest qualification"
                            />
                          </div> */}
                            <div>
                              <FormikControl
                                name="years_of_experience"
                                options={yearsOfExperienceOptions}
                                control={"select"}
                                placeholder="Select your years of experience"
                              />
                            </div>
                            <div>
                              <FormikControl
                                name="country"
                                options={countriesList}
                                control={"select"}
                                placeholder="Select your country"
                              />
                            </div>
                            <div>
                              <FormikControl
                                name="additional_info"
                                placeholder="Other info you would like us to know about you (max 250words)"
                                multiline
                                minRows={3}
                                maxLength={250}
                              />
                            </div>

                            <div>
                              <FormikControl
                                name="religion"
                                options={religion}
                                control={"select"}
                                placeholder="Religion"
                              />
                            </div>
                            <div>
                              <FormikControl
                                name="gender"
                                options={gender}
                                control={"select"}
                                placeholder="Gender"
                              />
                            </div>
                            {/* <div>
                            <FormikControl
                              name="marital_status"
                              options={maritalStatus}
                              control={"select"}
                              placeholder="Marital status"
                            />
                          </div> */}
                            <div>
                              <FormikControl
                                name="date_of_birth"
                                control={"date"}
                                placeholder="Input your date of birth"
                              />
                            </div>
                            {/* <div>
                            <FormikControl
                              control="imageUpload"
                              name="picture"
                              placeholder="Upload your picture"
                            />
                          </div> */}
                            {/* <div>
                            <FormikControl
                              name="preferred_mentee_gender"
                              options={menteeGender}
                              control={"select"}
                              placeholder="Which gender of mentee do you prefer?"
                            />
                          </div> */}
                            {type !== "student" && (
                              <div>
                                <FormikControl
                                  name="professional_bio"
                                  placeholder="Enter professional bio"
                                  multiline
                                  minRows={3}
                                />
                              </div>
                            )}
                            {type !== "student" && (
                              <div>
                                <FormikControl
                                  name="mentorship_areas"
                                  placeholder="Areas of expertise"
                                />
                              </div>
                            )}
                            {/* <div>
                            <FormikControl
                              name="councelling_areas"
                              placeholder="Concelling areas"
                            />
                          </div> */}

                            <div className="flex justify-between items-center gap-4">
                              <button
                                className="border border-[#f44336] text-[#f44336] px-4 py-2 rounded-md hover:bg-[#f44336] hover:text-white transition-all duration-300"
                                type="button"
                                onClick={() => setOpen(false)}
                              >
                                Back
                              </button>
                              <AuthButton
                                text="submit"
                                isLoading={isCreating}
                                disabled={isCreating}
                                onClick={handleSubmit}
                              />
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                )}
              </div>
            </Modal>

            <Modal
              title={`Welcome to ${mode}`}
              isOpen={programmeOpen}
              handleClose={() => setProgrammeOpen(false)}
            >
              {mode === "nahu programme" && <NahuProgramme setOpen={setOpen} />}
              {mode === "Primary Programmes" && (
                <PrimaryProgramme setOpen={setOpen} />
              )}
              {mode === "Secondary Programmes" && (
                <SecondaryProgramme setOpen={setOpen} />
              )}
            </Modal>
            <QuranTutorApplicationModal
              isOpen={quranTutorModalOpen}
              handleClose={() => setQuranTutorModalOpen(false)}
            />
          </ul>
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <div>
            <div className="flex items-center gap-2">
              <div className={`  flex items-center gap-2`}>
                <ul className="hidden gap-2 md:flex items-center">
                  <li>
                    <Link href={"/cart"}>
                      <Badge
                        // badgeContent={4}
                        color="primary"
                      >
                        <AddShoppingCartIcon />
                      </Badge>
                    </Link>
                  </li>
                  <div>
                    {isAuth ? (
                      <div className="navlink" onClick={logOut}>
                        Logout
                      </div>
                    ) : (
                      <Link href="/login" className="navlink">
                        Login
                      </Link>
                    )}
                  </div>
                </ul>
              </div>
              <div className={``}>
                <MenuIcon
                  onClick={() => toggleMobileHeader()}
                  sx={{
                    fontSize: 40,
                    cursor: "pointer",
                    transition: "all 2s ease-in-out",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Mobile sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen flex transition-all duration-500 overflow-hidden  ${
          isMobileHeaderOpen ? "max-w-full w-screen" : "max-w-0 w-0"
        }`}
      >
        {/* Left */}
        <div className="h-screen bg-slate-600 w-0 md:w-1/5 opacity-70"></div>
        {/* Right */}
        <div className="h-screen bg-slate-100 w-full md:w-4/5 py-6 px-4 flex flex-col ">
          {/* Top */}
          <div className="justify-self-end self-end">
            <CloseIcon
              sx={{ fontSize: 40, cursor: "pointer" }}
              onClick={() => toggleMobileHeader()}
            />
          </div>

          {/* Bottom */}
          <div className={`lg:hidden overflow-hidden h-screen`}>
            <div className="">
              <ul className="flex flex-col gap-2 px-6 pt-2">
                <li>
                  <Link
                    href="/"
                    className={` navlink ${
                      currentRoute == "/" && "text-primary"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={` navlink ${
                      currentRoute.includes("/about") && "text-primary"
                    }`}
                  >
                    Why Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/courses"
                    className={` navlink ${
                      currentRoute.includes("/courses") && "text-primary"
                    }`}
                  >
                    Courses
                  </Link>
                </li>
                {/* Mobile menu Qur'an Tutors dropdown */}
                <div className="relative text-slate-50 rounded group cursor-pointer">
                  <h3 className="text-[15px] font-normal text-black">
                    Qur&apos;an Tutors
                  </h3>
                  <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] transition-all duration-300 w-[200px]">
                    {!isUserMentor && (
                      <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                        <div
                          className="block w-full h-full"
                          onClick={() => router.push("/quran-tutors")}
                        >
                          Pick a Qur'an Tutor
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative text-slate-50 rounded group cursor-pointer">
                  <h3 className="text-[15px] font-normal text-black">
                    Programmes
                  </h3>
                  <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[200px] transition-all duration-300 w-[200px]">
                    <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenProgrammeModal("nahu programme");
                          setType("student");
                        }}
                      >
                        Nahu Programme
                      </div>
                    </div>
                    <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenProgrammeModal("Primary Programmes");
                        }}
                      >
                        Primary Programmes
                      </div>
                    </div>
                    <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenProgrammeModal("Secondary Programmes");
                        }}
                      >
                        Secondary Programmes
                      </div>
                    </div>
                  </div>
                </div>
                <li>
                  {isAuth && (
                    <Link
                      href="/dashboard"
                      className={` navlink ${
                        currentRoute.includes("/dashboard") && "text-primary"
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                </li>

                {/* Show when logged in */}
                {isAuth && (
                  <li>
                    <Link
                      href="admin/dashboard"
                      className={` navlink ${
                        currentRoute.includes("admin/dashboard") &&
                        "text-primary"
                      }`}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    href="/blog"
                    className={` navlink ${
                      currentRoute.includes("/blog") && "text-primary"
                    }`}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback"
                    className={` navlink ${
                      currentRoute.includes("/feedback") && "text-primary"
                    }`}
                  >
                    Feedback
                  </Link>
                </li>
                {!isAuth && (
                  <li>
                    <Link
                      href="/admin/login"
                      className={` navlink ${
                        currentRoute.includes("/admin") && "text-primary"
                      }`}
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <div className="relative text-slate-50 rounded group cursor-pointer">
                  <div className="text-[15px] font-normal text-black">
                    Register
                  </div>
                  <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] w-full transition-all duration-300">
                    {!isUserMentor && (
                      <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                        <div
                          className="block w-full h-full"
                          onClick={() => {
                            handleOpenModal("student");
                            setType("student");
                          }}
                        >
                          Become a student
                        </div>
                      </div>
                    )}
                    {!isUserCouncellor && (
                      <div className="bg-slate-500 px-3 py-2 hover:bg-primary transition-all duration-300">
                        <div
                          className="block w-full h-full"
                          onClick={() => {
                            handleOpenModal("tutor");
                            setType("tutor");
                          }}
                        >
                          Become a tutor
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <li>
                  {isAuth ? (
                    <div className="navlink" onClick={logOut}>
                      Logout
                    </div>
                  ) : (
                    <Link href="/login" className="navlink">
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
