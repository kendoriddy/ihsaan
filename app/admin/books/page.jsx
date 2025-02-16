"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";

import Toastify from "@/components/Toastify";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import Modal from "@/components/validation/Modal";
import AuthButton from "@/components/AuthButton";
import { IMAGES } from "@/constants";
// import Button from "@mui/material/Button";

function Page() {
  const currentRoute = usePathname();
  const [open, setOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookIdx, setBookIdx] = useState([0, 6]);
  const [isAddBookModalClose, setIsAddBookModalClose] = useState(true);
  const [isEditBookModalClose, setIsEditBookModalClose] = useState(true);
  const [books, setBooks] = useState();
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const searchRef = useRef(null);
  const [bookToEdit, setBookToEdit] = useState({});

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditBtn = (id) => {
    // Open the modal
    setIsEditBookModalClose(false);
    setBookToEdit(books.find((book) => book.id === id));
  };

  const handleChange = (event, value) => {
    setBookIdx([(value - 1) * 6, value * 6]);
  };

  // Search Books
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

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Image form
    const imageFormData = new FormData();
    imageFormData.append("file", data.file);
    imageFormData.append("title", data.title);
    imageFormData.append("type", "IMAGE");

    try {
      // Post book image
      const imageResponse = await fetch("/api/resources/", {
        method: "POST",
        // body: file,
        body: imageFormData,
      });
      const fetchedImageResponse = await imageResponse.json();
      const { media_url } = { ...fetchedImageResponse };
      console.log(media_url);

      data.bookimage_url = media_url;
      console.log(data);

      // Post book
      const bookResponse = await fetch("/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const book = await bookResponse.json();

      // Clear the form
      e.target.reset();
      // Close the modal
      setOpen(false);
      toast("Book added successfully");

      // Fetch Data
      fetchData();
    } catch (error) {
      console.log(error);
      toast(error.message || "An error occurred");
    }
  };

  // update Book
  const updateBook = async (e, id) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Image form
    const imageFormData = new FormData();
    imageFormData.append("file", data.file);
    imageFormData.append("title", data.title);
    imageFormData.append("type", "IMAGE");

    // console.log(data)
    // console.log(imageFormData)

    try {
      // Post book image
      const imageResponse = await fetch("/api/resources/", {
        method: "POST",
        body: imageFormData,
      });
      const fetchedImageResponse = await imageResponse.json();
      const { media_url } = { ...fetchedImageResponse };

      data.bookimage_url = media_url;
      console.log("Data");
      console.log(data);

      // // Post book
      const bookResponse = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const book = await bookResponse.json();

      // Clear the form
      e.target.reset();
      // Close the modal
      setIsEditBookModalClose(false);
      toast("Book Updated successfully");

      // Fetch Data
      fetchData();
    } catch (error) {
      console.log(error);
      toast(error.message || "An error occurred");
    }
  };

  // Delete Book
  const deleteBook = async (id) => {
    try {
      const bookResponse = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      const book = await bookResponse.json();

      toast("Book deleted successfully");

      fetchData();
    } catch (error) {
      console.log(error);
      toast(error.message || "An error occurred");
    }
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      // Fetch Books
      const booksResponse = await fetch("/api/books");
      const books = await booksResponse.json();
      setBooks(books.books);
      setDisplayedBooks(books.books);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch Data
    fetchData();
  }, []);

  const intialValues = {
    title: "",
    price: "",
    image: "",
    summary: "",
    author: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const { title, price, image, summary, author, about_author } = values;
    const payload = {
      title: title,
      price: price,
      summary: summary,
      book_image: image,
      author: author,
      about_the_author: about_author,
    };
    console.log(values);
  };

  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Toast */}
      <Toastify timeout={1000} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        {/* Main Body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}>
          {/* Content Goes Here */}
          <div className="p-4">
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">Books</div>
              <div>
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setOpen(true)}
                  // onClick={() => setIsAddBookModalClose(false)}
                >
                  Add Book
                </Button>
              </div>
            </div>

            {/* Search bar */}
            <div className=" pt-8 max-w-[700px] m-auto">
              <form
                action=""
                method="post"
                className="w-full flex justify-center gap-2">
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
            <section className="pb-12 ">
              <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8">
                {displayedBooks?.slice(bookIdx[0], bookIdx[1]).map((book) => (
                  <div
                    key={book?.id}
                    className="group shadow-xl w-[250px] rounded-md overflow-hidden mt-8 bg-gra-100 ">
                    <div className=" w-full h-[200px] relative">
                      <Image
                        src={book?.bookimage_url || IMAGES.logo}
                        // width={200}
                        // height={300}
                        fill
                        alt={book?.title}
                        objectFit="cover"
                      />
                    </div>
                    {/* Book bottom */}
                    <div className="px-2 py-2">
                      <div className="text-xm text-red-600">
                        {book?.category}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{book?.title}</h3>
                      </div>
                      <div className="text-sm text-gray-600 py-2">
                        By {book.author}
                      </div>

                      {/* Created Date */}

                      <div className="flex justify-between items-center py-2 text-xs">
                        <div
                          className="px-3 py-2 border-2 border-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300 rounded "
                          onClick={() => handleEditBtn(book?.id)}>
                          Edit
                        </div>
                        <div
                          className="bg-red-600 px-3 py-2 text-white cursor-pointer hover:bg-red-800 transition-all duration-300 rounded"
                          onClick={() => deleteBook(book?.id)}>
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

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
          </div>
        </section>

        {/* Add Book Modal */}

        <Modal
          isOpen={open}
          title={"Add Book"}
          handleClose={() => setOpen(false)}>
          <form action="#" className="p-4" onSubmit={(e) => addBook(e)}>
            {/* Title */}
            <div className="py-3">
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
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
              />
            </div>

            {/* Book Image */}
            <div className="py-3 flex items-center">
              <input input type="file" name="file" />

              <div className="text-gray-600 text-sm">Add Book Image</div>
            </div>

            {/* Summary */}
            <div className=" flex gap-4 flex-col lg:flex-row py-3">
              <textarea
                name="summary"
                id="content"
                cols="10"
                rows="5"
                placeholder="Summary"
                className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
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
              />
            </div>

            {/* About the author */}
            <div className=" flex gap-4 flex-col lg:flex-row py-3">
              <textarea
                name="about_the_author"
                id="content"
                cols="10"
                rows="5"
                placeholder="About the author"
                className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center py-4">
              <Button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                Add Book
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Book Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
            isEditBookModalClose && "hidden"
          }`}>
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            <div className="bg-white w-4/5 h-4/5 rounded overflow-y-scroll">
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edit Book</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsEditBookModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form
                action="#"
                className="p-4"
                onSubmit={(e) => updateBook(e, bookToEdit?.id)}>
                {/* Title */}
                <div className="py-3">
                  <input
                    type="text"
                    name="title"
                    defaultValue={bookToEdit?.title}
                    className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Price */}
                <div className="py-3">
                  <input
                    type="number"
                    name="price"
                    defaultValue={bookToEdit?.price}
                    className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Book Image */}
                <div className="py-3 flex items-center">
                  <div>
                    <Image
                      src={bookToEdit?.bookimage_url || IMAGES.logo}
                      width={200}
                      height={300}
                      alt={bookToEdit?.title}
                      objectFit="cover"
                    />
                  </div>

                  <input type="file" name="file" />
                  <div className="text-gray-600 text-sm">Add Book Image</div>
                </div>

                {/* Summary */}
                <div className=" flex gap-4 flex-col lg:flex-row py-3">
                  <textarea
                    name="summary"
                    cols="10"
                    rows="5"
                    defaultValue={bookToEdit?.summary}
                    className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Author */}
                <div className="py-3">
                  <input
                    type="text"
                    name="author"
                    defaultValue={bookToEdit?.author}
                    className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* About the author */}
                <div className=" flex gap-4 flex-col lg:flex-row py-3">
                  <textarea
                    name="about_the_author"
                    cols="10"
                    rows="5"
                    defaultValue={bookToEdit?.about_the_author}
                    className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <Button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Update Book
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
