"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useState, useEffect } from "react";
import { COURSES } from "@/constants";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import { usePathname } from "next/navigation";
import { addCartItem } from "@/utils/redux/userSlice";
import { useSelector, useDispatch } from "react-redux";

const Page = () => {
  // Redux
  const cartItems = useSelector((state) => state.user.user.cartItems);
  const dispatch = useDispatch();

  console.log(cartItems);

  
  function getRandomCourses(COURSES, count) {
    const randomCourses = [];
    const length = COURSES.length;

    count = Math.min(count, length);

    while (randomCourses.length < count) {
      const randomIndex = Math.floor(Math.random() * length);
      const COURSE = COURSES[randomIndex];
      if (!randomCourses.includes(COURSE)) {
        randomCourses.push(COURSE);
      }
    }
    return randomCourses;
  }
  const randomCourses = getRandomCourses(COURSES, 4);
  console.log(randomCourses);

  return (
    <div>
      <div className="relative">
        <Header />

        <main className="min-h-[500px] flex flex-col  justify-center lg:px-12">
          <div className="flex flex-col my-6 px-4 w-full justify-between">
            <div className="">
              <h1 className="font-bold text-[40px] hidden md:block">
                Shopping Cart
              </h1>
            </div>
            <section className="flex flex-col gap-2 md:flex-row-reverse">
              <div className="flex flex-col w-full  justify-between gap-2 mb-6 md:w-[30%]">
                <div className="flex flex-col pb-2 justify-items-start">
                  <div className="font-bold text-slate-500">Total:</div>
                  <span className="text-3xl font-bold"> &#8358;3,200</span>
                  <span className="line-through text-slate-500 text-base">
                    {" "}
                    &#8358;14,500
                  </span>
                  <span className="text-base">78% off</span>
                </div>
                <span className="underline text-blue-700 font-medium">
                  Hide Codes
                </span>
                <button class="bg-blue-500 w-full h-12 text-white font-bold">
                  <Link href="/checkout">Checkout</Link>
                </button>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-base mb-4 font-bold">Promotions</p>
                  <p className="flex gap-2 text-slate-500">
                    <button>
                      <CloseIcon className="text-[20px]" />
                    </button>
                    <span>
                      <b>ST11MT20624</b> is applied
                    </span>
                  </p>
                  <div className="flex w-full">
                    <input
                      placeholder="Enter Coupon"
                      className="border border-black border-r border-r-white-500 w-[85%] px-4 bg-white-500 h-[34px] placeholder-slate-500"
                    />
                    <Link
                      href=""
                      className="bg-blue-500 w-[15%] h-[34px] text-center">
                      <button className="font-bold text-white text-[15px] pt-1">
                        Apply
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mb-6 py-4 md:w-[70%] md:mr-4">
                <h3 className="font-bold mb-2">1 course in Cart</h3>
                <hr className="mb-2"></hr>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-1 w-20">
                    {/* <img src={COURSES[0].image} className="" /> */}
                    <Image
                      src={COURSES[0].image}
                      alt={COURSES[0].title}
                      width={250}
                    />
                  </div>
                  <div className="flex flex-col col-span-4 md:flex-row">
                    <div class="flex">
                      <div className="flex-col gap-2">
                        <h3 className="font-bold">Time Management</h3>
                        <p>
                          4.6<span>(462 ratings)</span>
                        </p>
                        <div className="bg-red-500 inline p-1 mb-4 font-bold">
                          Bestseller
                        </div>
                        <p className="block text-[14px] text-slate-500 font-200">
                          6.5 total hours{" "}
                          <span className="font-bold">&bull;</span> 26 lectures{" "}
                          <span className="font-bold"> &bull;</span> All levels
                        </p>
                        <p className="flex lg:flex-col gap-4 lg:gap-2 text-[14px] text-blue-500">
                          <Link href="">
                            <span>Remove</span>
                          </Link>
                          <Link href="">
                            <span>Save for Later</span>
                          </Link>
                          <Link href="">
                            <span>Move to Wishlist</span>
                          </Link>
                        </p>
                      </div>

                      <div className="col-span-1 w-30">
                        <div className="flex no-wrap text-blue-500">
                          <span className="font-bold mr-2">&#8358;3,200</span>
                          <LocalOfferIcon className="text-[16px]" />
                        </div>
                        <span className="line-through text-slate-500 text-base">
                          &#8358;14,500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="">
              <h2 className="text-[24px] font-bold">You might also like</h2>
              <div className="flex items-top justify-center gap-2">
                <div className="flex w-auto">
                  <Link
                    href=""
                    className="flex flex-col justify-top mt-4 w-64 sm:w-96 md:w-40 lg:w-72">
                    <Image
                      src={COURSES[1].image}
                      alt={COURSES[1].title}
                      width="w-auto"
                      height={250}
                    />
                    <p className="font-bold">
                      Communication Skills: How To Communicate Effectively
                    </p>
                    <p className="text-[13px] text-slate-500">
                      Abdullah Adeoba
                    </p>
                    <p className="">
                      <span className="font-bold">4.8</span>
                      <span>
                        {[1, 2, 3, 4, 5].map((index) => (
                          <span key={index}>
                            <StarIcon
                              className={`${
                                index <= COURSES[1].stars
                                  ? "text-yellow-500"
                                  : "text-slate-400"
                              } text-base`}
                            />
                          </span>
                        ))}
                      </span>{" "}
                      <span className="text-[13px] text-slate-500">(656)</span>
                    </p>
                    <p>
                      <span className="font-bold">&#8358;3200</span>{" "}
                      <span className="line-through text-slate-500">
                        &#8358;19,900
                      </span>
                    </p>
                  </Link>
                </div>
                <div className="flex">
                  {/* <h2 className="font-bold text-2xl w-full items-start"> */}
                  {/* You might also like */}
                  {/* </h2> */}
                  <div className="flex gap-2">
                    {/* <h2 className="font-bold text-2xl w-full items-start"> */}
                    {/* You might also like */}
                    {/* </h2> */}
                    <div className="hidden md:flex gap-2">
                      {randomCourses.map((randomCOURSE) => {
                        return (
                          <></>
                          // <div className="">
                          //   <Link
                          //     href=""
                          //     className="flex flex-col w-auto h-[375px] mt-4"
                          //   >
                          //     <Image
                          //       src={randomCOURSE.image}
                          //       alt={randomCOURSE.name}
                          //       width="w-auto"
                          //       height={250}
                          //     />
                          //     <p className="font-bold">{randomCOURSE.title}</p>
                          //     <p>Author's name</p>
                          //     <p className="">
                          //       <span className="font-bold">4.8</span>{" "}
                          //       <span>
                          //         {[1, 2, 3, 4, 5].map((index) => (
                          //           <span key={index}>
                          //             <StarIcon
                          //               className={`${
                          //                 index <= randomCOURSE.stars
                          //                   ? "text-yellow-500"
                          //                   : "text-slate-400"
                          //               } text-base`}
                          //             />
                          //           </span>
                          //         ))}
                          //       </span>{" "}
                          //       <span className="text-[13px] text-slate-500">
                          //         (656)
                          //       </span>
                          //     </p>
                          //     <p>
                          //       <span className="font-bold">&#8358;3200</span>{" "}
                          //       <span className="line-through text-slate-500">
                          //         &#8358;19,900
                          //       </span>
                          //     </p>
                          //   </Link>
                          // </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default Page;
