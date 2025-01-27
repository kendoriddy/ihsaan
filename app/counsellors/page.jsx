// Components
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
0.0;

//useState
import { useState, useRef, useEffect } from "react";

//material-ui-select-country;
import { COUNTRIES } from "@/constants";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
//location_icon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import InfoIcon from "@mui/icons-material/Info";
//import mentors details
//import { COUNSELLORS } from "@/constants";
//pagination
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Image from "next/image";

function Page({ props }) {
  const [mentorIndex, setMentorIndex] = useState([0, 3]);
  const [page, setPage] = useState(1);
  const searchRef = useRef(null);
  //const [counsellors, setCounsellors] = useState(COUNSELLORS);
  const [counselors, setCounselors] = useState([]);

  const [options, setOptions] = useState(COUNTRIES);
  const [search, setSearch] = useState("");

  //const options = (COUNTRIES);
  const [value, setValue] = useState(options[0]);
  const [inputValue, setInputValue] = useState("");
  const [inputSearchValue, setInputSearchValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //setSearch(searchRef.current.value);
  };

  function handlePageChange(event, value) {
    setPage(value);
    setMentorIndex([(value - 1) * 3, value * 3]);
  }

  // const filterByCountry = () => {
  //   const data = [...MENTORS].filter((mentor) => {
  //     if (
  //       mentor?.country_of_origin?.toLowerCase() === value?.label.toLowerCase()
  //     ) {
  //       return mentor;
  //     }
  //   });

  //   setMentors(data);
  // };

  // const filterFromInput = () => {
  //   const data = [...COUNSELLORS].filter((item) => {
  //     if (item.field.toLowerCase().includes(inputSearchValue.toLowerCase())) {
  //       return item;
  //     }
  //   });
  //   setCounsellors(data);
  // };

  useEffect(() => {
    //Fetch data from the API
    const fetchData = async () => {
      const counselorsResponse = await fetch("/api/counselors");

      const counselors = await counselorsResponse.json();

      setCounselors(counselors.counselor);
    };

    fetchData();
  }, [search]);

  console.log(counselors);
  // const data = [...COUNSELLORS].filter((mentor) => {
  //   // Return all mentors at first
  //   if (value === "" || value === "All") {
  //     return mentor;
  //     return;
  //   }

  //   if (
  //     mentor?.country_of_origin?.toLowerCase() ===
  //       value?.label?.toLowerCase() ||
  //     value === "" ||
  //     value?.label?.toLowerCase() === "all"
  //   ) {
  //     if (
  //       mentor?.field?.toLowerCase().includes(inputSearchValue?.toLowerCase())
  //     ) {
  //       return mentor;
  //     }
  //   }
  // });

  // setCounsellors(data);
  //}, [inputSearchValue, value]);

  // useEffect(() => {
  //   const data = [...COUNTRIES].filter((item) => {
  //     if (item.label.toLowerCase().includes(search.toLowerCase())) {
  //       return item;
  //     }
  //   });
  //   setOptions(data);
  // }, [search]);

  //const newMentors = MENTORS.slice(mentorIndex[0],mentorIndex[1]);

  return (
    <div>
      <div className="relative">
        <Header />
        <main
          className="min-h-[500px] flex flex-col  align-top
          p-4 md:flex-row gap "
        >
          <section className="flex flex-col lg:flex-row  md:w-[800px] h-[360px]">
            <div className="flex-col flex border  lg:w-[400px] p-3">
              <div className="top border-b p-2 h-[54.4px]">
                <h4 className="text-xl">Search Filter</h4>
              </div>
              <div className="bottom flex-col p-2">
                <form
                  action=""
                  method="post"
                  onSubmit={(e) => handleSubmit(e)}
                  className="flex-col gap-4"
                >
                  <div>
                    <p className="text-[16px]">Filter By Country</p>
                    {/* <input type="country" className="w-full border border-slate-100 shadow-white-500" placeholder="Search by Location"/> */}
                    <div>
                      <Autocomplete
                        id="country-select-demo"
                        sx={{ width: 350 }}
                        options={COUNTRIES}
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                          // filterByCountry();
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > Image": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            <Image
                              loading="lazy"
                              width="20"
                              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                              alt=""
                            />
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Choose a country"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                            ref={searchRef}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[16px] mt-2">Filter By Field</p>
                    <input
                      type="text"
                      className="w-full border border-slate-100 shadow-white-500 h-[50px]"
                      placeholder="Search by field"
                      ref={searchRef}
                      // onChange={(e) => setSearch(e.target.value)}
                      onChange={(e) => setInputSearchValue(e.target.value)}
                    />
                  </div>

                  {/* <button
                    type="submit"
                    className="w-full mt-2 h-12 text-white bg-blue-500 rounded">
                    Search
                  </button> */}
                </form>
              </div>
            </div>
          </section>
          {/* RENDER  MENTORS */}
          <section className="flex flex-col min-h-[800px] lg:w-full gap-5">
            <div className="flex flex-col items-center justify-center">
              {counselors && counselors?.length === 0 ? (
                <p className="flex justify-center">
                  No counsellors data to show
                </p>
              ) : (
                counselors
                  .slice(mentorIndex[0], mentorIndex[1])
                  .map((counselor) => {
                    return (
                      <div
                        className="flex flex-col lg:flex-row lg:justify-around justify-center border lg:h-[193px] gap-2 p-2 mb-2 w-full items-center"
                        key={counselor.id}
                      >
                        <div className="flex lg:w-full">
                          {/* <img
                        className="rounded-md w-[145px] h-[145px]"
                        alt="mentor_pic"
                        src={MENTOR.image}
                      /> */}
                          <Image
                            src={counselor.image}
                            alt={counselor.first_name}
                            width={145}
                          />
                        </div>
                        <div className="flex flex-col items-center lg:items-start lg:w-full ">
                          <span className="text-lg">
                            {counselor.first_name} {counselor.last_name}
                          </span>
                          <span className="text-slate-500">
                            {counselor.field}
                          </span>
                          <div>
                            {[1, 2, 3, 4, 5].map((index) => (
                              <span key={index}>
                                <StarIcon
                                  className={`${
                                    index <= counselor.stars
                                      ? "text-yellow-500"
                                      : "text-slate-400"
                                  } text-base`}
                                />
                              </span>
                            ))}
                            {/* <span>{Array(MENTOR.stars).fill(<StarIcon className="text-yellow-500 text-base"/>)}</span> */}
                            ({counselor.no_of_rating})
                          </div>
                          <div className="items-end">
                            <span className="text-base">
                              <LocationOnIcon className="text-base text-slate-500" />
                            </span>
                            <span className="text-slate-500">
                              {counselor.options}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col lg:mr-5 lg lg:w-full items-start text-slate-500 gap-2">
                          <div className="flex gap-3">
                            <span>
                              <ReviewsOutlinedIcon className="text-[16px]" />
                            </span>
                            <span>{counselor.no_of_feedback} Feedback</span>
                          </div>
                          <div className="flex gap-3 justify-bottom">
                            <span>
                              <LocationOnIcon className="text-[16px]" />
                            </span>
                            <span>{counselor.location}</span>
                          </div>
                          <div className="flex gap-3 justify-bottom">
                            <span>
                              <PaymentsOutlinedIcon className="text-[16px]" />
                            </span>
                            <span className="flex items-center gap-1">
                              {counselor.bookings}{" "}
                              <InfoIcon className="text-[16px]" />
                            </span>
                          </div>
                          <Link href="/cart" className="w-full">
                            <button className="bg-blue-500 w-full text-white h-10 p-2 rounded">
                              ADD TO CART
                            </button>
                          </Link>
                        </div>
                        <div key={counselor.id} className="flex lg:w-full">
                          <Link
                            href={`counsellors/${counselor.id}`}
                            className="w-full"
                          >
                            <button className="bg-blue-500 h-10 p-2 text-white rounded w-full">
                              MORE DETAILS
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            <div className="flex gap justify-between border items-center h-[110px] p-2.5">
              <div>Mentors:12</div>
              <Stack spacing={2}>
                <Pagination
                  count={4}
                  variant="outlined"
                  shape="rounded"
                  onChange={handlePageChange}
                />
              </Stack>
            </div>
          </section>
        </main>

        {/* Main */}
        {/* <main className="min-h-[500px] bg-neutral-500">

          <div className="">
          <div>Left</div>
          <div>Right</div>
          </div>

        </main> */}
        <Footer />
      </div>
    </div>
  );
}

export default Page;
