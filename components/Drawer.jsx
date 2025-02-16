"use client";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { IMAGES } from "@/constants";
import { FaAmazon } from "react-icons/fa";
import { formatDate, serverDateFormat } from "@/utils/utilFunctions";
import { useRef } from "react";

import Button from "@mui/material/Button";
import { addCartItem } from "@/utils/redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuth } from "@/utils/redux/slices/auth.reducer";

import ToastContainer from "@/components/ToastContainer";
import { showToast } from "@/utils/toastUtils";

function Drawer({
  drawerBook,
  isDrawerOpen,
  closeDrawer,
  drawerBookReviews,
  fetchReviews,
  user,
}) {
  const reviewRef = useRef(null);

  const isAuth = useSelector(selectIsAuth);

  // Redux
  const cartItems = useSelector((state) => state.user.user.cartItems);
  const dispatch = useDispatch();

  const postReview = async (e) => {
    e.preventDefault();

    const reviewer_name = user;
    const review_text = reviewRef.current.value;
    const review_date = serverDateFormat(new Date());
    const book = drawerBook.id;

    // If review is empty
    if (review_text === "") {
      showToast("Review cannot be empty", "error");

      return;
    }

    // If review is less than 10 characters
    if (review_text.length < 10) {
      showToast("Review must be at least 10 characters", "error");

      return;
    }

    try {
      const response = await fetch(`/api/books/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewer_name, review_text, review_date, book }),
      });

      const data = await response.json();

      showToast("Review posted successfully", "success");

      // Clear the review textarea
      reviewRef.current.value = "";

      // Fetch reviews
      fetchReviews();
    } catch (error) {
      console.error(error.message);
    }
  };

  // HandleAddToCart
  const handleAddToCart = () => {
    // Check if item is already in cart
    const itemInCart = cartItems.find((item) => item.id === drawerBook.id);

    if (itemInCart) {
      // toast.error("Item already in cart");
      showToast("Item already in cart", "error");
      return;
    }

    dispatch(addCartItem({ ...drawerBook, quantity: 1 }));
    showToast("Item added to cart", "success");
    // toast("Item added to cart");
  };

  return (
    <div className="w-screen">
      {/* Toast */}
      <ToastContainer />

      <div
        className={`fixed bg-neutral-100 top-0 left-0 z-40 max-w-[800px] h-screen ${
          isDrawerOpen ? "w-4/5" : "w-0"
        } transition-all duration-300 overflow-y-scroll overflow-x-hidden `}>
        {/* Top */}
        <div className="flex justify-between items-center px-4 py-4 shadow">
          <div className="text-2xl font-bold">Book Details</div>
          <div
            className="hover:text-red-500 transition-all duration-300 cursor-pointer"
            onClick={closeDrawer}>
            <CloseIcon sx={{ fontSize: 40 }} />
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 pt-4">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4">
            <div>
              <Image
                src={drawerBook?.book_image}
                width={100}
                height={150}
                alt={drawerBook?.title}
                objectFit="cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{drawerBook?.title}</h3>
              <p className="text-gray-400">Author: {drawerBook?.author}</p>
              <Rating
                name="half-rating-read"
                defaultValue={drawerBook?.rating}
                precision={0.5}
                size="small"
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <span className=""> NGN</span>{" "}
              {drawerBook?.price.toLocaleString("en-US")}
              .00
            </div>
            <div className="flex flex-col gap-2">
              <div className="">
                <Button
                  variant="contained"
                  className="theme-btn text-center"
                  size="small"
                  onClick={() => handleAddToCart()}>
                  Add to cart
                </Button>
              </div>
              <div className="link flex items-center gap-2">
                <span>Purchase on</span>
                <Link
                  href={"https://www.amazon.com"}
                  target="_blank"
                  className="hover:scale-150 duration-300">
                  <FaAmazon />
                </Link>
                or{" "}
                <Link
                  href={"https://www.jumia.com.ng"}
                  target="_blank"
                  className="hover:scale-150 duration-300">
                  <Image
                    src={IMAGES.jumiaLogo}
                    width={50}
                    height={50}
                    alt="Jumia"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="px-4 py-4">
            <h3 className="text-lg font-semibold text-center">Summary</h3>
            <div className="py-4 w-[200px] m-auto">
              <Divider />
            </div>
            <p className="text-gray-500">{drawerBook?.summary}</p>
          </div>
        </div>

        {/* Author */}
        <div>
          <div className="px-4 py-4">
            <h3 className="text-lg font-semibold text-center">
              About the Author
            </h3>
            <div className="py-4 w-[200px] m-auto">
              <Divider />
            </div>
            <p className="text-gray-500">{drawerBook?.about_the_author}</p>
          </div>
        </div>

        {/* Review */}
        <div>
          <div className="px-4 py-4 ">
            <h3 className="text-lg font-semibold text-center">Reviews</h3>
            <div className="py-4 w-[200px] m-auto">
              <Divider />
            </div>
            <div className="">
              {drawerBookReviews?.slice(0, 100).map((review) => (
                <div
                  className="flex flex-col py-4 px-2 rounded even:bg-gray-200 even:text-neutral-950"
                  key={review.id}>
                  <div className="text-gray-500">{review.review_text}</div>
                  <div className="flex justify-between">
                    <div className="text-gray-500">{review.reviewer_name}</div>
                    <div className="text-gray-500">
                      {formatDate(review.review_date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* <p className="text-gray-500">{drawerBook?.author.about}</p> */}
          </div>
        </div>

        {/* Add a review */}
        <div>
          {isAuth && (
            <div className="px-4 py-4">
              <h3 className="text-lg font-semibold text-center">
                Add a Review
              </h3>
              <div className="py-4 w-[200px] m-auto">
                <Divider />
              </div>
              {/* Post Review */}
              <form action="" onSubmit={(e) => postReview(e)}>
                <div className="flex flex-col gap-4">
                  <textarea
                    name="review"
                    id="review"
                    cols="30"
                    rows="5"
                    placeholder="Review"
                    ref={reviewRef}
                    className="border p-2 rounded"></textarea>
                  <Button className="theme-btn" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
