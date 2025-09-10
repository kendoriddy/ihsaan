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
import { fetchProgrammes } from "@/utils/redux/slices/programmeSlice";
import CartDrawer from "./CartDrawer";
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
import {
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import NahuProgramme from "./NahuProgramme";
import { getAuthToken } from "@/hooks/axios/axios";
import PrimaryProgramme from "./PrimaryProgramme";
import SecondaryProgramme from "./SecondaryProgramme";
import QuranTutorApplicationModal from "./QuranTutorApplicationModal";
import BecomeTutorForm from "./BecomeTutorForm";
import StudentRegistrationFlow from "./StudentRegistrationFlow";

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
  const { itemCount } = useSelector((state) => state.cart);
  const programmesState = useSelector((state) => state.programme);
  const programmes = programmesState?.programmes || [];
  const programmesStatus = programmesState?.status || "idle";
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [programmeOpen, setProgrammeOpen] = useState(false);
  const [type, setType] = useState(null);
  const [userType, setUserType] = useState(null);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [quranTutorModalOpen, setQuranTutorModalOpen] = useState(false);
  const [registerMenuAnchorEl, setRegisterMenuAnchorEl] = useState(null);
  const [programmeMenuAnchorEl, setProgrammeMenuAnchorEl] = useState(null);
  const [coursesMenuAnchorEl, setCoursesMenuAnchorEl] = useState(null);
  const [quranTutorsMenuAnchorEl, setQuranTutorsMenuAnchorEl] = useState(null);
  const [mobileRegisterMenuAnchorEl, setMobileRegisterMenuAnchorEl] =
    useState(null);
  const [mobileProgrammeMenuAnchorEl, setMobileProgrammeMenuAnchorEl] =
    useState(null);
  const [mobileQuranTutorsMenuAnchorEl, setMobileQuranTutorsMenuAnchorEl] =
    useState(null);

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

  // Fetch programmes on component mount
  useEffect(() => {
    if (programmesStatus === "idle") {
      dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
    }
  }, [dispatch, programmesStatus]);

  const handleOpenModal = (mode) => {
    setOpen(true);
  };

  const [mode, setMode] = useState("");
  const handleOpenProgrammeModal = (mode, programme = null) => {
    setMode(mode);
    setProgrammeOpen(true);
    if (programme) {
      setSelectedProgramme(programme);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    router.push("/dashboard");
  };

  const handleCloseProgrammeModal = () => {
    setProgrammeOpen(false);
    router.push("/dashboard");
  };

  // Menu handlers
  const handleRegisterMenuOpen = (event) => {
    setRegisterMenuAnchorEl(event.currentTarget);
  };

  const handleRegisterMenuClose = () => {
    setRegisterMenuAnchorEl(null);
  };

  const handleProgrammeMenuOpen = (event) => {
    setProgrammeMenuAnchorEl(event.currentTarget);
  };

  const handleProgrammeMenuClose = () => {
    setProgrammeMenuAnchorEl(null);
  };

  const handleCoursesMenuOpen = (event) => {
    setCoursesMenuAnchorEl(event.currentTarget);
  };

  const handleCoursesMenuClose = () => {
    setCoursesMenuAnchorEl(null);
  };

  const handleQuranTutorsMenuOpen = (event) => {
    setQuranTutorsMenuAnchorEl(event.currentTarget);
  };

  const handleQuranTutorsMenuClose = () => {
    setQuranTutorsMenuAnchorEl(null);
  };

  // Mobile menu handlers
  const handleMobileRegisterMenuOpen = (event) => {
    setMobileRegisterMenuAnchorEl(event.currentTarget);
  };

  const handleMobileRegisterMenuClose = () => {
    setMobileRegisterMenuAnchorEl(null);
  };

  const handleMobileProgrammeMenuOpen = (event) => {
    setMobileProgrammeMenuAnchorEl(event.currentTarget);
  };

  const handleMobileProgrammeMenuClose = () => {
    setMobileProgrammeMenuAnchorEl(null);
  };

  const handleMobileQuranTutorsMenuOpen = (event) => {
    setMobileQuranTutorsMenuAnchorEl(event.currentTarget);
  };

  const handleMobileQuranTutorsMenuClose = () => {
    setMobileQuranTutorsMenuAnchorEl(null);
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
    console.log(values, "====values====");
    const {
      first_name,
      last_name,
      email,
      password,
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
      years_of_experience,
      become_quran_tutor,
      ajzaa_memorized,
      country_of_origin,
      country_of_residence,
      display_profile_pic,
      tejweed_level,
      religion_sect,
      tutor_summary,
      languages,
    } = values;
    const payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      roles: become_quran_tutor
        ? ["USER", "TUTOR", "QURAN_TUTOR"]
        : type === "student"
        ? ["USER", "STUDENT"]
        : ["USER", "TUTOR"],
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
      years_of_experience: years_of_experience,
      tutor_application_status: "PENDING",
      student_application_status: "PENDING",

      country_of_origin: country_of_origin,
      country_of_residence: country_of_residence,
      display_profile_pic: display_profile_pic,
      ajzaa_memorized: ajzaa_memorized,
      tejweed_level: tejweed_level,
      religion_sect: religion_sect,
      tutor_summary: tutor_summary,
      languages: languages,
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
  }, [createNewaccounts, refetch]);
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
            <li>
              <Button
                className="navlink"
                onClick={handleQuranTutorsMenuOpen}
                sx={{
                  textTransform: "none",
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "semibold",
                  padding: "0",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#f97316",
                  },
                }}
              >
                Qur&apos;an Tutors
              </Button>
              <Menu
                anchorEl={quranTutorsMenuAnchorEl}
                open={Boolean(quranTutorsMenuAnchorEl)}
                onClose={handleQuranTutorsMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                  },
                }}
              >
                {!isUserMentor && (
                  <MenuItem
                    onClick={() => {
                      router.push("/quran-tutors");
                      handleQuranTutorsMenuClose();
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f97316",
                      },
                    }}
                  >
                    Pick a Qur'an Tutor
                  </MenuItem>
                )}
              </Menu>
            </li>

            <li>
              <Button
                className="navlink"
                onClick={handleCoursesMenuOpen}
                sx={{
                  textTransform: "none",
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "semibold",
                  padding: "0",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#f97316",
                  },
                }}
              >
                Courses
              </Button>
              <Menu
                anchorEl={coursesMenuAnchorEl}
                open={Boolean(coursesMenuAnchorEl)}
                onClose={handleCoursesMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/courses");
                    handleCoursesMenuClose();
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f97316",
                    },
                  }}
                >
                  Take a Course
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/courses");
                    handleCoursesMenuClose();
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f97316",
                    },
                  }}
                >
                  Upload and Sell a Course
                </MenuItem>
              </Menu>
            </li>

            <li>
              <Button
                className="navlink"
                onClick={handleProgrammeMenuOpen}
                sx={{
                  textTransform: "none",
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "semibold",
                  padding: "0",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#f97316",
                  },
                }}
              >
                Programmes
              </Button>
              <Menu
                anchorEl={programmeMenuAnchorEl}
                open={Boolean(programmeMenuAnchorEl)}
                onClose={handleProgrammeMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                  },
                }}
              >
                {programmes && programmes.length > 0 ? (
                  programmes.map((programme) => (
                    <MenuItem
                      key={programme.id}
                      onClick={() => {
                        handleOpenProgrammeModal(programme.name, programme);
                        setType("student");
                        handleProgrammeMenuClose();
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f97316",
                        },
                      }}
                    >
                      {programme.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {programmesStatus === "loading"
                      ? "Loading programmes..."
                      : "No programmes available"}
                  </MenuItem>
                )}
              </Menu>
            </li>

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
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="navlink cursor-pointer"
              >
                <Badge badgeContent={itemCount || 0} color="primary">
                  <AddShoppingCartIcon />
                </Badge>
              </button>
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
            {/* Register Menu */}
            {isUserBoth ? null : (
              <li>
                <Button
                  style={{
                    backgroundColor: "#f97316",
                    color: "white",
                    fontWeight: "semibold",
                    textTransform: "none",
                  }}
                  className="bg-primary hover:bg-primary/90 text-white px-3 py-2 min-w-[100px] text-center"
                  onClick={handleRegisterMenuOpen}
                  sx={{
                    textTransform: "none",
                    fontWeight: "semibold",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#f97316",
                    },
                  }}
                >
                  Register
                </Button>
                <Menu
                  anchorEl={registerMenuAnchorEl}
                  open={Boolean(registerMenuAnchorEl)}
                  onClose={handleRegisterMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      borderRadius: 2,
                    },
                  }}
                >
                  {!isUserMentor && (
                    <MenuItem
                      onClick={() => {
                        handleOpenModal("student");
                        setType("student");
                        handleRegisterMenuClose();
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f97316",
                        },
                      }}
                    >
                      Become a student
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleOpenModal("teacher");
                      setType("teacher");
                      handleRegisterMenuClose();
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f97316",
                      },
                    }}
                  >
                    Become a tutor
                  </MenuItem>
                </Menu>
              </li>
            )}

            {/* MODAL */}
            <Modal
              title={
                type === "student"
                  ? "Register as a Student"
                  : "Register as a Tutor"
              }
              isOpen={open}
              handleClose={() => setOpen(false)}
            >
              <li>
                {type === "teacher" ? (
                  <BecomeTutorForm
                    onSubmit={handleSubmit}
                    isLoading={isCreating}
                  />
                ) : (
                  <StudentRegistrationFlow
                    setOpen={setOpen}
                    selectedProgramme={selectedProgramme}
                  />
                )}
              </li>
            </Modal>

            <Modal
              title={`Welcome to ${mode}`}
              isOpen={programmeOpen}
              handleClose={() => setProgrammeOpen(false)}
            >
              <StudentRegistrationFlow
                setOpen={setProgrammeOpen}
                selectedProgramme={selectedProgramme}
              />
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
                    <button
                      onClick={() => setIsCartDrawerOpen(true)}
                      className="navlink cursor-pointer"
                    >
                      <Badge badgeContent={itemCount || 0} color="primary">
                        <AddShoppingCartIcon />
                      </Badge>
                    </button>
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
                <div>
                  <Button
                    className="navlink"
                    onClick={handleMobileQuranTutorsMenuOpen}
                    sx={{
                      textTransform: "none",
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "normal",
                      justifyContent: "flex-start",
                      padding: "8px 16px",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#f97316",
                      },
                    }}
                  >
                    Qur&apos;an Tutors
                  </Button>
                  <Menu
                    anchorEl={mobileQuranTutorsMenuAnchorEl}
                    open={Boolean(mobileQuranTutorsMenuAnchorEl)}
                    onClose={handleMobileQuranTutorsMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: 2,
                      },
                    }}
                  >
                    {!isUserMentor && (
                      <MenuItem
                        onClick={() => {
                          router.push("/quran-tutors");
                          handleMobileQuranTutorsMenuClose();
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f97316",
                          },
                        }}
                      >
                        Pick a Qur'an Tutor
                      </MenuItem>
                    )}
                  </Menu>
                </div>
                <div>
                  <Button
                    className="navlink"
                    onClick={handleMobileProgrammeMenuOpen}
                    sx={{
                      textTransform: "none",
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "normal",
                      justifyContent: "flex-start",
                      padding: "8px 16px",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#f97316",
                      },
                    }}
                  >
                    Programmes
                  </Button>
                  <Menu
                    anchorEl={mobileProgrammeMenuAnchorEl}
                    open={Boolean(mobileProgrammeMenuAnchorEl)}
                    onClose={handleMobileProgrammeMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: 2,
                      },
                    }}
                  >
                    {programmes && programmes.length > 0 ? (
                      programmes.map((programme) => (
                        <MenuItem
                          key={programme.id}
                          onClick={() => {
                            handleOpenProgrammeModal(programme.name, programme);
                            setType("student");
                            handleMobileProgrammeMenuClose();
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#f97316",
                            },
                          }}
                        >
                          {programme.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        {programmesStatus === "loading"
                          ? "Loading programmes..."
                          : "No programmes available"}
                      </MenuItem>
                    )}
                  </Menu>
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
                <div>
                  <Button
                    className="navlink"
                    onClick={handleMobileRegisterMenuOpen}
                    sx={{
                      textTransform: "none",
                      color: "black",
                      fontSize: "15px",
                      fontWeight: "normal",
                      justifyContent: "flex-start",
                      padding: "8px 16px",
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#f97316",
                      },
                    }}
                  >
                    Register
                  </Button>
                  <Menu
                    anchorEl={mobileRegisterMenuAnchorEl}
                    open={Boolean(mobileRegisterMenuAnchorEl)}
                    onClose={handleMobileRegisterMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: 2,
                      },
                    }}
                  >
                    {!isUserMentor && (
                      <MenuItem
                        onClick={() => {
                          handleOpenModal("student");
                          setType("student");
                          handleMobileRegisterMenuClose();
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f97316",
                          },
                        }}
                      >
                        Become a student
                      </MenuItem>
                    )}
                    {!isUserCouncellor && (
                      <MenuItem
                        onClick={() => {
                          handleOpenModal("tutor");
                          setType("tutor");
                          handleMobileRegisterMenuClose();
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f97316",
                          },
                        }}
                      >
                        Become a tutor
                      </MenuItem>
                    )}
                  </Menu>
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

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </header>
  );
}

export default Header;
