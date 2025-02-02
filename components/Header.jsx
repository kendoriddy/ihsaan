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
import { selectIsAuth, currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
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

function Header() {
  const currentRoute = usePathname();
  const queryClient = useQueryClient();
  const [isMobileHeaderOpen, setIsMobileHeaderOpen] = useState(false);
  const {
    data: getAuthUserInformation,
    isLoading,
    refetch,
  } = useFetch("authUser", `/auth/logged-in-user/`);
  const authenticatedUsersPayload = getAuthUserInformation && getAuthUserInformation?.data;
  const isAuth = useSelector(selectIsAuth);
  const signedInUserName = useSelector(currentlyLoggedInUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const intialValues = {
    first_name: signedInUserName || "",
    last_name: authenticatedUsersPayload?.last_name || "",
    middle_name: authenticatedUsersPayload?.middle_name || "",
    password: "",
    confirm_password: "",
    email: authenticatedUsersPayload?.email || "",
    mentorship_areas: authenticatedUsersPayload?.mentorship_areas || "",
    years_of_experience: authenticatedUsersPayload?.years_of_experience || "",
    country: authenticatedUsersPayload?.country || "",
    about_me: authenticatedUsersPayload?.about_me || "",
    additional_informations: authenticatedUsersPayload?.additional_information || "",
    skills: authenticatedUsersPayload?.skill || "",
    qualifications: authenticatedUsersPayload?.qualification || "",
    religion: authenticatedUsersPayload?.religion || "",
    marital_status: authenticatedUsersPayload?.marital_status || "",
    date_of_birth: authenticatedUsersPayload?.date_of_birth || "",
    gender: authenticatedUsersPayload?.gender || "",
    picture: authenticatedUsersPayload?.picture || "",
    menteeGender: authenticatedUsersPayload?.menteeGender || "",
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
  const handleCloseModal = () => {
    setOpen(false);
    router.push("/dashboard");
  };
  const { mutate: createNewaccounts, isLoading: isUpdating } = usePost("/auth/register", {
    onSuccess: () => {
      toast.success(
        "Registration successful. Please verify your email by clicking the link sent to your mail."
      );
      queryClient.invalidateQueries("authUser");
      handleCloseModal();
    },
    onError: (error) => {
      console.log(error);
      toast.error("error occured, please try again later");
    },
  });
  const handleSubmit = (values) => {
    const {
      first_name,
      last_name,
      middle_name,
      email,
      password,
      confirm_password,
      mentorship_areas,
      years_of_experience,
      country,
      about_me,
      additional_informations,
      skills,
      qualifications,
      marital_status,
      religion,
      date_of_birth,
      gender,
      picture,
      menteeGender,
    } = values;
    const payload = {
      roles: type === "mentor" ? ["user", "mentor"] : ["user", "counsellor"],
      first_name: first_name,
      last_name: last_name,
      middle_name: middle_name,
      email: email,
      password: password,
      confirm_password: confirm_password,
      date_joined: authenticatedUsersPayload?.date_joined,
      newsletter_subscribed: authenticatedUsersPayload?.newsletter_subscribed,
      mentorship_areas: mentorship_areas,
      years_of_experience: years_of_experience,
      country: country,
      about_me: about_me,
      availability: true,
      additional_information: additional_informations,
      skill: skills,
      qualification: qualifications,
      marital_status: marital_status,
      religion: religion,
      date_of_birth: date_of_birth,
      gender: gender,
      picture: picture,
      menteeGender: menteeGender,
    };
    createNewaccounts(payload);
  };
  const logOut = () => {
    dispatch(logoutUser());
    router.push("/login");
  };
  const isUserMentor = authenticatedUsersPayload?.roles?.includes("mentor");
  const isUserCouncellor = authenticatedUsersPayload?.roles?.includes("counsellor");
  const isUserBoth = ["mentor", "counsellor"].every((role) =>
    authenticatedUsersPayload?.roles?.includes(role)
  );
  const countriesList = countryNames.map((country) => {
    return { key: country, value: country.toLowerCase().replace(/\s+/g, "-") };
  });
  const qualificationsList = allPossibleQualifications.map((qualification) => {
    return { key: qualification, value: qualification.toLowerCase().replace(/\s+/g, "-") };
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
  const menteeGender = [
    { key: "Male", value: "male" },
    { key: "Female", value: "female" },
    { key: "Both", value: "both" },
  ];

  const religion = [
    { key: "Islam", value: "muslim" },
    { key: "Christanity", value: "christain" },
    { key: "Others", value: "others" },
  ];
  const maritalStatus = [
    { key: "Single", value: "single" },
    { key: "Married", value: "married" },
    { key: "Others", value: "others" },
  ];
  useEffect(() => {
    refetch();
  }, [createNewaccounts]);
  return (
    <header className="sticky top-0 text-sm z-20 bg-white py-3 px-2 md:px-24 max-w-[100vw]">
      <div className="flex justify-between items-center py-2 px-0 sm:px-4">
        {/* Logo */}
        <div className="text-lg font-bold">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl">
              <Image src={IMAGES.icon} alt="logo" width={50} height={50} />
              <div>IHSAAN</div>
            </Link>
          </div>
        </div>
        {/* Desktop menu */}
        <div className="hidden lg:flex-1 lg:flex justify-end">
          <ul className="flex gap-2 items-center text-[15px] font-bold">
            <li>
              <Link href="/" className={` navlink ${currentRoute == "/" && "text-primary"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={` navlink ${currentRoute.includes("/about") && "text-primary"}`}
              >
                Why us
              </Link>
            </li>
            {/* <li>
              <Link
                href="/mentors"
                className={` navlink ${currentRoute.includes("/mentors") && "text-primary"}`}
              >
                Mentors
              </Link>
            </li>
            <li>
              <Link
                href="/counsellors"
                className={` navlink ${currentRoute.includes("/counsellors") && "text-primary"}`}
              >
                Counselors
              </Link>
            </li> */}
            <li>
              <Link
                href="/courses"
                className={` navlink ${currentRoute.includes("/courses") && "text-primary"}`}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                href="/books"
                className={` navlink ${currentRoute.includes("/books") && "text-primary"}`}
              >
                Books
              </Link>
            </li>
            {isAuth && (
              <li>
                <Link
                  href="/dashboard"
                  className={` navlink ${currentRoute.includes("/dashboard") && "text-primary"}`}
                >
                  Dashboard
                </Link>
              </li>
            )}

            {/* Show when logged in */}
            {/* {!isAuth && (
              <li>
                <Link
                  href="admin/dashboard"
                  className={` navlink ${
                    currentRoute.includes("admin/dashboard") && "text-primary"
                  }`}
                >
                  Admin Dashboard
                </Link>
              </li>
            )} */}

            <li>
              <Link
                href="/blog"
                className={` navlink ${currentRoute.includes("/blog") && "text-primary"}`}
              >
                Blog
              </Link>
            </li>
            {/* {!isAuth && (
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
            )} */}

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

            {/* {isUserBoth ? null : (
              <div className="relative text-slate-50 rounded group cursor-pointer">
                <div className="bg-primary px-3 py-2">Become a mentor/counsellor</div>
                <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] w-full transition-all duration-300">
                  {!isUserMentor && (
                    <div className="bg-slate-500 px-3 py-2 hover:bg-blue-600 transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenModal("mentor");
                          setType("mentor");
                        }}
                      >
                        Become a mentor
                      </div>
                    </div>
                  )}
                  {!isUserCouncellor && (
                    <div className="bg-slate-500 px-3 py-2 hover:bg-blue-600 transition-all duration-300">
                      <div
                        className="block w-full h-full"
                        onClick={() => {
                          handleOpenModal("councellor");
                          setType("councellor");
                        }}
                      >
                        Become a counsellor
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )} */}

            {/* MODAL */}
            <Modal
              title={
                type === "mentor"
                  ? "Become a Mentor on YRM Learning"
                  : "Become a Councellor on YRM Learning"
              }
              isOpen={open}
              handleClose={() => setOpen(false)}
            >
              <div>
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
                            <FormikControl name="first_name" placeholder="First name" />
                          </div>
                          <div>
                            <FormikControl name="last_name" placeholder="Last name" />
                          </div>
                          <div>
                            <FormikControl name="middle_name" placeholder="Middle name" />
                          </div>
                          <div>
                            <FormikControl name="email" placeholder="Email address" />
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
                          {type === "mentor" && (
                            <div>
                              <FormikControl
                                name="mentorship_areas"
                                placeholder="Enter intrested areas of mentorship with comma seperating each"
                                multiline
                                minRows={3}
                              />
                            </div>
                          )}
                          {type === "councellor" && (
                            <div>
                              <FormikControl
                                name="councelling_areas"
                                placeholder="Enter intrested areas of councelling with comma seperating each"
                                multiline
                                minRows={3}
                              />
                            </div>
                          )}
                          <div>
                            <FormikControl
                              name="years_of_experience"
                              options={yearsOfExperienceOptions}
                              control={"select"}
                              placeholder="Total years of experience"
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
                              name="about_me"
                              placeholder="Discuss about your self professionally(max 250words)"
                              multiline
                              minRows={3}
                              maxLength={250}
                            />
                          </div>
                          <div>
                            <FormikControl
                              name="additional_informations"
                              placeholder="Other information you will like us to know about(max 250words)"
                              multiline
                              minRows={3}
                              maxLength={250}
                            />
                          </div>
                          <div>
                            <FormikControl
                              control="tagInput"
                              name="skills"
                              placeholder="List skills related to your field"
                            />
                          </div>
                          <div>
                            <FormikControl
                              name="qualifications"
                              options={qualificationsList}
                              control={"select"}
                              placeholder="Select your highest qualification"
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
                          <div>
                            <FormikControl
                              name="marital_status"
                              options={maritalStatus}
                              control={"select"}
                              placeholder="Marital status"
                            />
                          </div>
                          <div>
                            <FormikControl
                              name="date_of_birth"
                              control={"date"}
                              placeholder="Input your date of birth"
                            />
                          </div>
                          <div>
                            <FormikControl
                              control="imageUpload"
                              name="picture"
                              placeholder="Upload your picture"
                            />
                          </div>
                          <div>
                            <FormikControl
                              name="menteeGender"
                              options={menteeGender}
                              control={"select"}
                              placeholder="Which gender of mentee do you prefer?"
                            />
                          </div>

                          {/* <div>
                            <FormikControl
                              name="availability"
                              control={"checkbox"}
                              label="Check box if you are currently available (you can update your availability after registering)"
                            />
                          </div> */}

                          <div className="flex justify-center">
                            <AuthButton
                              text="submit"
                              isLoading={isUpdating}
                              disabled={isUpdating}
                              onClick={handleSubmit}
                            />
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </Modal>
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

                  {/* Dropdown button */}
                  <div className="relative text-slate-50 rounded group  cursor-pointer">
                    <div className="bg-primary px-3 py-2">Become a mentor/counsellor</div>
                    <div className="absolute top-[38px] left-0 z-30 h-0 overflow-hidden group-hover:h-[77px] w-full transition-all duration-300 ">
                      <div className="bg-slate-500 px-3 py-2 hover:bg-blue-600 transition-all duration-300">
                        <Link href="/mentors" className="block w-full h-full">
                          Become a mentor
                        </Link>
                      </div>
                      <div className="bg-slate-500 px-3 py-2 hover:bg-blue-600 transition-all duration-300">
                        <Link href="/counsellors" className="block w-full h-full">
                          Become a counsellor
                        </Link>
                      </div>
                    </div>
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
          <div className={`lg:hidden overflow-hidden `}>
            <div className="">
              <ul className="flex flex-col gap-2 px-6 pt-2">
                <li>
                  <Link href="/" className={` navlink ${currentRoute == "/" && "text-primary"}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={` navlink ${currentRoute.includes("/about") && "text-primary"}`}
                  >
                    Why Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mentors"
                    className={` navlink ${currentRoute.includes("/mentors") && "text-primary"}`}
                  >
                    Mentors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/counsellors"
                    className={` navlink ${currentRoute.includes("/counselors") && "text-primary"}`}
                  >
                    Counselors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className={` navlink ${currentRoute.includes("/courses") && "text-primary"}`}
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books"
                    className={` navlink ${currentRoute.includes("/books") && "text-primary"}`}
                  >
                    Books
                  </Link>
                </li>
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
                        currentRoute.includes("admin/dashboard") && "text-primary"
                      }`}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    href="/blog"
                    className={` navlink ${currentRoute.includes("/blog") && "text-primary"}`}
                  >
                    Blog
                  </Link>
                </li>
                {!isAuth && (
                  <li>
                    <Link
                      href="/admin/login"
                      className={` navlink ${currentRoute.includes("/admin") && "text-primary"}`}
                    >
                      Admin
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    href="/cart"
                    className={` navlink ${currentRoute.includes("/cart") && "text-primary"}`}
                  >
                    Cart
                  </Link>
                </li>
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
                {/* Dropdown button */}
                <div className="relative w-full h-[38.5px] rounded-md overflow-hidden hover:h-[116px] transition-all duration-300">
                  <div
                    className="absolute top-0 left-0 w-full border text-neutral-50 cursor-pointer 
                "
                  >
                    <div className="bg-primary px-3 py-2">Become a mentor/counsellor</div>
                    <div className="bg-slate-500 px-3 py-2 hover:bg-blue-600 transition-all duration-300">
                      <Link href="/mentors" className="block w-full h-full">
                        Become a mentor
                      </Link>
                    </div>
                    <div className="bg-slate-500 px-3 py-2 hover:bg-blue-600 transition-all duration-300">
                      <Link href="/counsellors" className="block w-full h-full">
                        Become a counsellor
                      </Link>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
