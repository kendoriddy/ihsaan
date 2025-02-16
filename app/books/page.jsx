"use client";

// Components
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { useState, useRef, useEffect } from "react";

import { breadcrumbData } from "@/constants";
import MainTop from "@/components/MainTop";
import Image from "next/image";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Drawer from "@/components/Drawer";
import Button from "@/components/Button";
import Divider from "@mui/material/Divider";
import { selectIsAuth } from "@/utils/redux/slices/auth.reducer";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import { useSelector } from "react-redux";
import { useFetch } from "@/hooks/useHttp/useHttp";

function Page() {
  const [bookIdx, setBookIdx] = useState([0, 6]);
  const [books, setBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [bookReviews, setBookReviews] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerBook, setDrawerBook] = useState(null);
  const [drawerBookReviews, setDrawerBookReviews] = useState([]);
  const searchRef = useRef(null);
  const [isAddBookModalClose, setIsAddBookModalClose] = useState(true);
  const user = useSelector(currentlyLoggedInUser);

  const isAuth = useSelector(selectIsAuth);

  console.log(isAuth);

  // Refs
  const titleRef = useRef();
  const priceRef = useRef();
  const summaryRef = useRef();
  const bookimageRef = useRef();
  const authorRef = useRef();
  const about_the_authorRef = useRef();

  const openDrawer = (book) => {
    setIsDrawerOpen(true);

    setDrawerBook(book);
    setDrawerBookReviews(bookReviews.filter((review) => review.book === book.id));
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    // Refresh this page

    try {
      const reviewsResponse = await fetch("/api/booksssss/reviews");
      const reviewsData = await reviewsResponse.json();
      setBookReviews(reviewsData.booksReviews);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      // Fetch Books
      const booksResponse = await fetch("/api/booksssss");
      const books = await booksResponse.json();
      setBooks(books.books);
      setDisplayedBooks(books.books);

      // Fetch Reviews
      const reviewsResponse = await fetch("/api/booksssss/reviews");
      const reviewsData = await reviewsResponse.json();
      setBookReviews(reviewsData.booksReviews);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, data, error, isError, refetch } = useFetch(
    "fetchBooksReviews",
    "/api/books",
    (data) => console.log("Success:", data),
    (error) => console.log("Error:", error)
  );
  console.log(isLoading, data, error, isError);
  // Handle data update when `data` changes
  useEffect(() => {
    if (data) {
      setBooks(data.books); // Assuming `data.books` is the array of books
      setDisplayedBooks(data.books);
      setBookReviews(data.booksReviews); // Assuming `data.booksReviews` is for reviews
    }
  }, [data]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleChange = (event, value) => {
    setBookIdx([(value - 1) * 6, value * 6]);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = searchRef.current.value;

    // Filter Books
    const filteredBooks = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        book.author.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setDisplayedBooks(filteredBooks);
  };

  // Add Book
  const addBook = async (e) => {
    e.preventDefault();

    const newBook = {
      title: titleRef.current.value,
      price: priceRef.current.value,
      summary: summaryRef.current.value,
      book_image: bookimageRef.current.files[0],
      author: authorRef.current.value,
      about_the_author: about_the_authorRef.current.value,
    };

    try {
      const bookResponse = await fetch("/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      const book = await bookResponse.json();
      console.log(book);
    } catch (error) {
      console.log(error);
      toast(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    // Fetch Data
    fetchData();
  }, []);

  return (
    <div>
      <div className="relative">
        <Header />

        {/* Main */}
        <main className="main">
          <MainTop breadcrumbData={breadcrumbData.books} />

          {/* Add Book */}
          {isAuth && (
            <div className="flex justify-between items-center p-8 max-w-[1300px]">
              <div className="text-lg font-bold"></div>
              <div>
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setIsAddBookModalClose(false)}
                >
                  Add Book
                </Button>
              </div>
            </div>
          )}

          {/* Top */}
          <section className="max-w-[500px] mx-auto text-center py-8">
            <div className="text-primary py-4">Published Books</div>
            <div>
              Invest in your future with industry-expert authored books. Our books are written by
              top experts in their fields, so you can be confident that you are getting the most
              up-to-date information and advice.
            </div>
          </section>

          {/* Search bar */}
          <div className="py-8 max-w-[700px] m-auto">
            <form action="" method="post" className="w-full flex justify-center gap-2">
              <input
                type="text"
                placeholder="Search books, authors..."
                className="w-full  border border-red-600 rounded-md py-2 px-2"
                ref={searchRef}
                onChange={(e) => handleSearch(e)}
              />
              {/* <button type="submit" className="theme-btn">
                Search
              </button> */}
            </form>
          </div>

          {/* LIST BOOKS */}
          <section className="py-12 px-4">
            <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8">
              {displayedBooks?.slice(bookIdx[0], bookIdx[1]).map((book) => (
                <div
                  key={book.id}
                  className="group shadow-xl w-[300px] rounded-md overflow-hidden mt-8 cursor-pointer hover:bg-neutral-200 transition-all duration-300"
                  onClick={() => openDrawer(book)}
                >
                  <div className=" w-full h-[300px] relative">
                    <Image
                      src={book.book_image}
                      // width={200}
                      // height={300}
                      fill
                      alt={book?.title}
                      objectFit="cover"
                    />
                  </div>
                  {/* Book bottom */}
                  <div className="px-2 py-2">
                    <div className="text-xm text-primary">{book.category}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                    </div>
                    <div className="text-sm text-gray-500 py-2">By {book.author}</div>

                    <div className="flex justify-between items-center py-2">
                      <div>
                        <CreditCardIcon className="text-neutral-400" />
                        <span className=""> NGN</span> {book.price.toLocaleString("en-US")}
                      </div>
                      <div>
                        <Rating
                          name="half-rating-read"
                          defaultValue={book.rating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TemporaryDrawer  */}
          <Drawer
            drawerBook={drawerBook}
            isDrawerOpen={isDrawerOpen}
            closeDrawer={closeDrawer}
            drawerBookReviews={drawerBookReviews}
            fetchReviews={fetchReviews}
            user={user}
          />

          {/* Pagination */}
          <section className="pt-4 pb-12">
            <div className="w-4/5 mx-auto border flex flex-col lg:flex-row justify-between items-center px-4 rounded">
              <div>Total Books: {books?.length}</div>
              <div>
                <Stack spacing={2} className="py-5">
                  <Pagination
                    count={Math.ceil(books?.length / 6)}
                    variant="outlined"
                    shape="rounded"
                    onChange={handleChange}
                  />
                </Stack>
              </div>
            </div>
          </section>

          {/* Modals */}
          {/* Add Book Modal */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
              isAddBookModalClose && "hidden"
            }`}
          >
            <div className="w-screen h-screen flex justify-center items-center  p-4  ">
              <div className="bg-white w-4/5 h-4/5 rounded overflow-y-scroll">
                {/* Top */}
                <div>
                  <div className="flex justify-between items-center p-4">
                    <div className="text-lg font-bold">Add Book</div>
                    <div
                      className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                      onClick={() => setIsAddBookModalClose(true)}
                    >
                      Close
                    </div>
                  </div>
                  <Divider />
                </div>

                <form action="#" className="p-4" onSubmit={(e) => addBook(e)}>
                  {/* Title */}
                  <div className="py-3">
                    <input
                      type="text"
                      name="text"
                      id="title"
                      placeholder="Title"
                      className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                      ref={titleRef}
                    />
                  </div>

                  {/* Price */}
                  <div className="py-3">
                    <input
                      type="number"
                      name="price"
                      id="price"
                      placeholder="Price"
                      className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                      ref={priceRef}
                    />
                  </div>

                  {/* Book Image */}
                  <div className="py-3 flex items-center">
                    <input
                      type="file"
                      name="image"
                      id="image"
                      ref={bookimageRef}
                      // onChange={(e) => {
                      //   setFile(e.target.files[0]);
                      // }}
                    />
                    <div className="text-gray-600 text-sm">Add Book Image</div>
                  </div>

                  {/* Summary */}
                  <div className=" flex gap-4 flex-col lg:flex-row py-3">
                    <textarea
                      name="text"
                      id="content"
                      cols="10"
                      rows="5"
                      placeholder="Summary"
                      className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                      ref={summaryRef}
                    />
                  </div>

                  {/* Author */}
                  <div className="py-3">
                    <input
                      type="text"
                      name="author"
                      id="author"
                      placeholder="Author"
                      className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                      ref={authorRef}
                    />
                  </div>

                  {/* About the author */}
                  <div className=" flex gap-4 flex-col lg:flex-row py-3">
                    <textarea
                      name="text"
                      id="content"
                      cols="10"
                      rows="5"
                      placeholder="About the author"
                      className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                      ref={about_the_authorRef}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-center py-4">
                    <Button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]"
                    >
                      Add Book
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Page;
