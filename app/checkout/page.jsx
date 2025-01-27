"use client";
import Header from "@/components/Header";
import Link from "next/link";
//material-ui-select-country;
import { COUNTRIES } from "@/constants";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import HttpsIcon from "@mui/icons-material/Https";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { cartItems } from "@/constants";
import { useState } from "react";
import Image from "next/image";
import paypalImage from "@/assets/images/paypal.webp";

const Page = () => {
  const [openedOption, setOpenedOption] = useState(0);

  const handleOpenedOption = (option) => setOpenedOption(option);

  return (
    <div className="">
      <div className="relative">
        <Header />
        <div className="flex w-full">
          <main className="min-h-[500px] flex flex-col items-center justify-center px-8 lg:pl-12 md:w-[60%] md:justify-start ">
            <section className="flex flex-col mb-8">
              <h1 className="text-[32px] my-8 font-bold">Checkout</h1>
              <h2 className="text-[24px] mb-4 mt-[0px] font-bold">
                Billing address
              </h2>
              <label className="text-sm font-bold p-2 flex justify-between md:w-[264px]">
                Country{" "}
                <span className="text-sm font-normal text-slate-500 ml-[8px]">
                  Required
                </span>
              </label>
              <div className="w-full">
                <Autocomplete
                  id="country-select-demo"
                  className=" w-full md:w-[264px] mb-2"
                  sx={{}}
                  options={COUNTRIES}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}>
                      <Image
                        width={20}
                        alt=""
                        // srcSet={paypalImage}
                        src={paypalImage}
                      />
                      {/* <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      /> */}
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Please select a country"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
              <div className="text-[12px] text-slate-500">
                RightMentors is required by law to collect applicable
                transaction taxes for purchase made in certain tax jurisdictions
              </div>
            </section>
            <section className="w-full mb-8">
              <div className=" flex mb-4 items-start justify-between">
                <h2 className="text-2xl font-bold">Payment Method</h2>
                <p className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">
                    Secured connection
                  </span>
                  <svg className="h-[20px] w-[20px]">
                    <HttpsIcon className="" />
                  </svg>
                </p>
              </div>

              <div id="accordion" className="border border-gray-300">
                <div className="border-gray-200">
                  <div className="bg-gray-100 flex items-center gap-2 h-[44px] p-2">
                    <input
                      type="radio"
                      name="accordion"
                      id="first"
                      onClick={() => handleOpenedOption(1)}
                    />
                    <label
                      for="first"
                      className="flex justify-between w-full p-2 items-center">
                      <div className=" flex mr-4 items-center">
                        <span className=" p-[1px] rounded-md bg-white-700 border text-center mr-2">
                          <CreditCardIcon className="" />
                        </span>
                        <span className="font-bold">Credit/Debit Card</span>
                      </div>
                      <span className="flex gap-1">
                        <Image
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-amex.svg"
                          width={42}
                          height={28}
                          className="border rounded-md"
                          alt="amex"
                        />
                        <Image
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-discover.svg"
                          width={42}
                          height={28}
                          className="border rounded-md"
                          alt="discover"
                        />
                        <Image
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-mastercard.svg"
                          width={42}
                          height={28}
                          className="border rounded-md"
                          alt="mastercard"
                        />
                        <Image
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-visa.svg"
                          width={42}
                          height={28}
                          className="border rounded-md"
                          alt="visa"
                        />
                        {/* <img
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-amex.svg"
                          className="h-[28px] w-[42px] border rounded-md"
                        />
                        <img
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-discover.svg"
                          className="h-[28px] w-[42px] border rounded-md"
                        />
                        <img
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-mastercard.svg"
                          className="h-[28px] w-[42px] border rounded-md"
                        />
                        <img
                          src="https://www.udemy.com/staticx/udemy/images/v9/card-visa.svg"
                          className="h-[28px] w-[42px] border rounded-md"
                        /> */}
                      </span>
                    </label>
                  </div>
                  <div
                    className={`${
                      openedOption === 1 ? "block" : "hidden"
                    }  py-8 px-6`}>
                    <form className="flex flex-col items-center">
                      <div>
                        <label
                          for="card_name"
                          className="flex justify-between font-bold">
                          Name on card
                          <span className="text-gray-500 ml-2 font-normal text-[12px]">
                            Required
                          </span>
                        </label>
                        <input
                          type="text"
                          id="card_name"
                          name="card_name"
                          size="40"
                          required
                          minLength="8"
                          maxLength="40"
                          placeholder="Name on card"
                          className="border border-solid border-black focus:border focus:border-solid focus:border-black p-4"
                        />
                      </div>
                      <div>
                        <label
                          for="card_number"
                          className="flex justify-between font-bold">
                          Card Number
                          <span className="text-gray-500 ml-2 font-normal text-[12px]">
                            Required
                          </span>
                        </label>
                        <input
                          type="text"
                          id="card_number"
                          name="card_number"
                          size="40"
                          required
                          minLength="8"
                          maxLength="40"
                          placeholder="1234 5678 9012 3456"
                          className="border border-solid border-black focus:border focus:border-solid focus:border-black p-4"
                        />
                      </div>
                      <div>
                        <label
                          for="exp_date"
                          className="flex justify-between font-bold">
                          Expiry date
                          <span className="text-gray-500 ml-2 font-normal text-[12px]">
                            Required
                          </span>
                        </label>
                        <input
                          type="month"
                          value="2018-07"
                          id="exp_date"
                          name="exp_date"
                          required
                          size="40"
                          className="border border-solid border-black pt-3 px-4 min-w-[360px] h-[48px]"
                        />
                      </div>

                      <div>
                        <label
                          for="cvv_cvc"
                          className="flex justify-between font-bold">
                          CVC/CVV
                          <span className="text-gray-500 ml-2 font-normal text-[12px]">
                            Required
                          </span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          id="cvv_cvc"
                          name="cvv_cvc"
                          size="40"
                          required
                          minLength="3"
                          maxLength="3"
                          placeholder="CVC"
                          className="border border-solid border-black focus:border focus:border-solid focus:border-black p-4 min-w-[360px]"
                        />
                      </div>

                      <div className=" flex gap-4">
                        <input type="checkbox" />
                        <label>
                          Securely save this card for my later purchase
                        </label>
                      </div>
                      <div className="mt-4">
                        <b>The amount your card will be charged is $17.06</b>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="">
                  <div className="bg-gray-100 p-2 flex gap-2 items-center">
                    <input
                      type="radio"
                      name="accordion"
                      id="second"
                      className="mr-2"
                      onClick={() => handleOpenedOption(2)}
                    />
                    <label for="second" className="flex mr-4">
                      <Image
                        src={paypalImage}
                        width={42}
                        height={28}
                        className=" bg-white border rounded-md mr-2"
                        alt="paypal"
                      />
                      {/* <img
                        src="https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png"
                        className="h-[28px] w-[42px] bg-white border rounded-md mr-2"
                      /> */}
                      <span className="font-bold">Paypal</span>
                    </label>
                  </div>
                  <div
                    className={`${
                      openedOption === 2 ? "block" : "hidden"
                    } flex flex-col py-8 px-6`}>
                    <div className="">
                      In order to complete your transaction, we will transfer
                      you over to PayPal's secure servers.
                    </div>
                    <b>The amount your card will be charged is $17.06</b>
                  </div>
                </div>
              </div>
            </section>
            {/* Section */}
            <section className="flex flex-col mb-12 justify-start items-start w-full">
              <div>
                <h2 className="font-bold text-[24px] mb-4">Order details</h2>
              </div>

              <div className="w-full">
                <ul>
                  {cartItems.map((cartItem) => {
                    return (
                      <li
                        key={cartItem.id}
                        className="flex w-full items-center justify-between py-2 ">
                        <div className="flex items-center ">
                          <Image
                            src={cartItem.image}
                            width={32}
                            height={32}
                            className="mr-2"
                            alt={""}
                          />
                          {/* <img
                          src={cartItem.image}
                          className="w-[32px] h-[32px] mr-2"
                        /> */}
                          <span className="capitalize text-sm font-bold">
                            {cartItem.title}
                          </span>
                        </div>

                        <span className="text-[14px] text-gray-500">
                          NGN {cartItem.price}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </main>
          <aside className="bg-gray-100 hidden md:flex flex-col items-center w-[40%]">
            <div className="mt-[104px] pr-8 pl-12">
              <section className="">
                <h2 className="text-2xl mb-4 font-bold">Summary</h2>
                <div className="flex justify-between text-[14px]">
                  <span>Original Price:</span>
                  <span>&#8358; 24,900</span>
                </div>
                <hr className="my-[12px]" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="md:hidden">&#8358; 24,900</span>
                </div>
              </section>
              <div className="flex flex-col justify-center gap-2">
                <span className="text-[12px]">
                  By completing your purchase you agree to these {""}
                  <Link href="" className="text-blue-500">
                    Terms of Service.
                  </Link>
                </span>
                <Link href="">
                  <button className="w-full bg-blue-500 text-white h-[60px] font-bold">
                    Complete Checkout
                  </button>
                </Link>
                <div className="text-center text-[12px]">
                  30-Day Money-Back Guarantee
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="mb-10 md:pb-[96px] px-[32px] sticky">
          <section className="md:hidden">
            <h2 className="text-2xl mb-4 font-bold">Summary</h2>
            <div className="flex justify-between text-[14px]">
              <span>Original Price:</span>
              <span>&#8358; 24,900</span>
            </div>
            <hr className="my-[12px]" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="md:hidden">&#8358; 24,900</span>
            </div>
          </section>
        </div>

        <section className="flex flex-col py-3 px-4 bg-white-500 shadow-lg border border-white-500 relative md:hidden">
          <div className="flex justify-between font-bold mb-2 text-[19px]">
            <span>Total:</span>
            <span>&#8358;14,500</span>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <span className="text-[12px]">
              By completing your purchase you agree to these {""}
              <Link href="" className="text-blue-500">
                Terms of Service.
              </Link>
            </span>
            <Link href="">
              <button className="w-full bg-blue-500 text-white h-[60px] font-bold">
                Complete Checkout
              </button>
            </Link>
            <div className="text-center text-[12px]">
              30-Day Money-Back Guarantee
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Page;
