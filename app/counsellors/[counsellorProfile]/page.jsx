"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

//import icon
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import ForumIcon from "@mui/icons-material/Forum";
import CallIcon from "@mui/icons-material/Call";
import { COUNSELLORS } from "@/constants";
import { usePathname } from "next/navigation";

function Page({ params }) {
  const pathname = usePathname();

  const getIdFromURL = pathname.split("/").pop();

  const [counselor, setCounselor] = useState({});

  // Fetch Data

  useEffect(() => {
    const fetchData = async (id) => {
      //Mentors
      const counselorResponse = await fetch(`/api/counselors/${id}`);
      console.log(counselorResponse);
      const counselor = await counselorResponse.json();
      setCounselor(counselor.counselor);

      console.log(counselor);
    };

    fetchData(getIdFromURL);
  }, [getIdFromURL]);

  // const COUNSELLOR = COUNSELLORS.filter((counsellor) => {
  //   return counsellor.path == params.counsellorProfile;
  // });

  //console.log(MENTOR);

  //const [mentorIndex, setMentorIndex] = useState(MENTOR);
  //const [page, setPage] = useState(1);

  return (
    <div>
      <div className="relative">
        <Header />
        <main className="min-h-[500px] flex items-center justify-center  pt-[30px]">
          <div className="text-3xl flex flex-col items-center justify-center w-full gap-8">
            <section className="flex flex-col lg:flex-row w-full lg:w-[956px] mx-12px p-[20px] border justify-between gap-2">
              <div className="flex flex-col lg:flex-row justify-between lg:w-full border-slate-500">
                <div className="flex flex-col lg:flex-row justify-between gap-10">
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="flex item-center h-[80px] w-[80px] bg-blue-300  border-[3px] 
                        border-blue-500 rounded-full text-center"
                    >
                      {/* <img
                        src={MENTOR[0].image}
                        className="h-[50px] w-[50px] rounded-full"
                      /> */}
                    </div>
                    <div>
                      {" "}
                      {[1, 2, 3, 4, 5].map((index) => (
                        <span key={index}>
                          <StarIcon
                            className={`${
                              index <= counselor.stars ? "text-yellow-500" : "text-slate-400"
                            } text-base`}
                          />
                        </span>
                      ))}
                    </div>
                    <LocationOnIcon className="text-[20px] text-slate-500" />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    {/* <p className="text-[16px] text-slate-500">Contact Me</p> */}
                    <div class="flex flex-col justify-center items-center text-[16px] text-slate-500">
                      <p>
                        {counselor.first_name}
                        {counselor.last_name}
                      </p>
                      <p>{counselor.gender}</p>
                      {/* <p>{counselor.title}</p> */}
                      <p>{counselor.skill}</p>

                      <p>{counselor.role}</p>
                      <p>{counselor.skill}</p>
                      <p>{counselor.current_workplace}</p>
                      <p>{counselor.years_of_experience} years</p>
                      {/* <div className="flex items-center justify-center h-[40px] w-[40px] p-[10px] bg-blue-500 rounded-full border border-blue-500 text-white">
                        <Link href="##">
                          <ForumIcon className="text-[18px]" />
                        </Link>
                      </div>
                      <div className="flex items-center text-center justify-center h-[40px] w-[40px] p-[10px] bg-blue-500 rounded-full border border-blue-500 text-white">
                        <Link href="##">
                          <EmailIcon className="text-[18px]" />
                        </Link>
                      </div>
                      <div className="flex items-center text-center justify-center h-[40px] w-[40px] p-[10px] bg-blue-500 rounded-full border border-blue-500 text-white">
                        <Link href="##" className="text-[18px] ">
                          <CallIcon className="text-[20px]" />
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[18px]"> {counselor.charges}/Session</span>
                  <Link
                    href=""
                    className="bg-blue-500 text-[18px] text-white rounded-full py-[10px] px-[40px]"
                  >
                    Hire Me
                  </Link>
                </div>
              </div>
            </section>
            {/* Origin and Residence */}

            <section className="flex p-[20px] w-full lg:w-[956px] border border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full  border-slate-400 ">
                <ul className="text-[16px] flex justify-between">
                  <li>Country of Residence : {counselor.country}</li>
                  <li>Country of Origin : {counselor.country}</li>
                </ul>
              </div>
            </section>
            {/* Mentoring fields */}
            <section className="flex p-[20px] w-full lg:w-[956px] border border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full  border-slate-400 ">
                <h4 className=" text-[18px]">Counselling Fields/Skills</h4>
                <hr className="text-slate-700 my-[16px]"></hr>

                <ul className="list-disc flex flex-wrap justify-between gap-4 p-2 capitalize">
                  {counselor.mentorship_areas}
                  {/* {counselor.mentoring_areas.map((item, index) => {
                    return (
                      <li key={index} className="text-[16px] mr-2">
                        <span>{item}</span>
                      </li>
                    );
                  })} */}
                </ul>
              </div>
            </section>

            {/* About Me */}
            <section className="flex flex-col lg:flex-row p-[20px] lg:w-[956px] mx-12px border border-b-2 border-b-blue-500 justify-center">
              <div className="flex flex-col justify- lg:w-full ">
                <h4 className="text-[18px] mb-4 border-b border-slate-500">About Me</h4>
                <p className="text-[14px] mb-4">{counselor.about_me}</p>
              </div>
            </section>

            {/* Qualification */}
            <section className="flex border w-full lg:w-[956px] mx-12px mb-[30px] border-b-2 border-b-blue-500">
              <div className="flex flex-col border-slate-400 w-full  p-[24px]">
                <h4 className="w-full text-[18px]">Qualifications</h4>
                <hr className="text-slate-700 my-[16px]"></hr>
                <div className="flex flex-col gap-4">
                  {counselor.qualification}
                  {/* {COUNSELLOR[0].qualifications.map((item, index) => {
                    return (

                  <div className= "flex gap-4" key={index}>
                    <p className="text-[18px] font-bold text-blue-700">&#x2756;</p>
                    <div className="flex-col">
                      <p className="capitalize text-[18px]">{item.institution}</p>
                      <p className="text-[16px]">{item.type_of_qualification} &bull; {item.area_of_qualification}</p>
                      <p className="text-sm text-slate-500">{item.start_date} - {item.finish_date}</p>
                      <a href= "https://www.credentials.com" target="_blank" className="rounded-full text-sm bg-slate-200 p-1">Show credential</a>
                      <p className="text-sm text-slate-500"><span>Skills acquired: {item.skills_acquired}</span></p>
                    </div>
                  </div>
                  );           
                  })} */}
                </div>
              </div>
            </section>

            {/* Licences and Certifications */}
            <section className="flex p-[20px] w-full lg:w-[956px] border border-b-2 border-b-blue-500">
              <div className="flex flex-col border-slate-400 w-full  p-[24px]">
                <h4 className="w-full text-[18px]">Licences & Certification</h4>
                <hr className="text-slate-700 my-[16px]"></hr>
                <div className="flex flex-col gap-4">
                  {/* {COUNSELLOR[0].certifications.map((item, index) => {
                    return (

                  <div className= "flex gap-4" key={index}>
                    <p className="text-[18px] font-bold text-blue-700">&#x2756;</p>
                    <div className="flex-col">
                      <p className="capitalize text-[18px]">{item.title}</p>
                      <p className="text-[16px]">{item.issued_by}</p>
                      <p className="text-sm text-slate-500">Issued {item.date}</p>
                      <a href= "https://www.credentials.com" target="_blank" className="rounded-full text-sm bg-slate-200 p-1">Show credential</a>
                      <p className="text-sm text-slate-500"><span>Skills acquired: {item.skills_acquired}</span></p>
                    </div>
                  </div>
                  );
                  })} */}
                </div>
              </div>
            </section>

            {/* Work Experience */}

            <section className="flex border lg:w-[956px] w-full mb-[30px] border-b-2 border-b-blue-500">
              <div className="flex flex-col border-slate-400 w-full  p-[24px]">
                <h4 className="w-full text-[18px]">Work Experience</h4>
                <hr className="text-slate-700 my-[16px]"></hr>
                <div className="flex flex-col gap-4">
                  {/* {COUNSELLOR[0].work_experience.map((item, index) => {

                    return (
                      <div className="flex gap-4" key={index}>
                        <p className="text-[18px] font-bold text-blue-700">
                          &#x2756;
                        </p>
                        <div className="flex-col">
                          <p className="capitalize text-[18px]">
                            {item.job_title}
                          </p>
                          <p className="text-[16px]">{item.company}</p>
                          <p className="text-sm text-slate-500">
                            <span>{item.start_date}</span> to{" "}
                            <span>{item.end_date}</span> &bull; {item.duration}
                          </p>
                          <p className="text-sm text-slate-500">
                            <span>{item.location}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })} */}
                </div>
              </div>
            </section>

            {/* Recommendations */}

            <section className="flex border w-full lg:w-[956px] mx-12px mb-[30px] border-b-2 border-b-blue-500">
              <div className="flex flex-col border-slate-400 w-full  p-[24px]">
                <h4 className="w-full text-[18px]">Recommended By</h4>
                <hr className="text-slate-700 my-[16px]"></hr>
                <div className="flex flex-col gap-4">
                  {/* {COUNSELLOR[0].recommendations.map((item, index) => {
                    return (

                  <div className= "flex gap-4" key={index}>
                    <p className="text-[18px] font-bold text-blue-700">&#x2756;</p>
                    <div className="flex-col">
                      <p className="capitalize text-[18px]">{item.fullname}</p>
                      <p className="text-[16px]">{item.profession}</p>
                      <p className="text-sm text-slate-500">{item.workplace}</p>
                      <p className="text-sm text-slate-500"><span>{item.location}</span></p>
                    </div>
                  </div>
                  );
                  })} */}
                </div>
              </div>
            </section>
            {/* communication platform */}

            <section className="flex border w-full lg:w-[956px] mx-12px mb-[30px] border-b-2 border-b-blue-500">
              <div className="flex flex-col border-slate-400 w-full  p-[24px]">
                <h4 className="w-full text-[18px]">Communication Platforms</h4>
                <hr className="text-slate-700 my-[16px]"></hr>
                <div className="flex flex-wrap justify-between">
                  {/* <ul className="list-disc flex flex-wrap justify-between gap-4 p-2">
                    {counselor.communication_platforms.map((item, index) => {

//                   <ul className="list-disc flex flex-wrap justify-between gap-4 p-2">
//                     {COUNSELLORS[0].communication_platforms.map((item, index) => { 
                      return (
                        <li key={index} className="text-[16px] mr-2 list-none">
                          <span className="capitalize">
                            <input type="checkbox" checked />
                            {item}{" "}
                          </span>
                        </li>
                      );
                    })}
                  </ul> */}
                </div>
              </div>
            </section>

            {/* Additional information */}
            <section className="flex p-[20px] w-full lg:w-[956px] border border-b-2 border-b-blue-500">
              <div className="flex flex-col w-full  border-slate-400 ">
                <h4 className=" text-[18px]">Additional Information</h4>
                <hr className="text-slate-700 my-[16px]"></hr>
                <div className="list-none flex flex-col text-[14px] lg:flex-row lg:w-full gap-8 justify-between w-full">
                  {counselor.additional_information}
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Page;
