import { IMAGES } from "./images";

const BOOKS = [
  {
    id: 1,
    title: "Online business",
    category: "Business",
    author: {
      name: "John Doe",
      image: IMAGES.user1,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_1,
    path: "/books",
    type: "book",
    uri: "books",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 2,
    title: "E-commerce",
    category: "E-commerce",
    author: {
      name: "Tafawa Balewa",
      image: IMAGES.user2,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_2,
    path: "/books",
    type: "book",
    uri: "books",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 3,
    title: "UI/UX Design",
    category: "Design",
    author: {
      name: "Colt Steele",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_3,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 4,
    title: "Affiliate Marketing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_4,
    path: "/books",
    type: "book",
    uri: "books",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 5,
    title: "Digital Marketing",
    category: "Marketing",
    author: {
      name: "Aloo Mabo",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_5,
    path: "/books",
    type: "book",
    uri: "books",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 6,
    title: "Affiliate Marketing",
    category: "Marketing",
    author: {
      name: "Uztadh Umar",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_6,
    path: "/books",
    type: "book",
    uri: "books",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 7,
    title: "Adewale Edun",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_7,
    path: "/books",
    type: "book",
    uri: "books",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 8,
    title: "Affiliate Marketing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_8,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 9,
    title: "Sport science",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_9,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 10,
    title: "Affiliate Marketing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_10,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 11,
    title: "Affiliate Marketing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_1,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 12,
    title: "Affiliate Marketing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_2,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 13,
    title: "Affiliate Marketing 2",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_3,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 14,
    title: "Web Development",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_4,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 15,
    title: "App Marketing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_5,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 16,
    title: "Travelling",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_6,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 17,
    title: "Entertainment",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_7,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 18,
    title: "Texhnology",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_8,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 19,
    title: "Testing",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_9,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
  {
    id: 20,
    title: "Blogging",
    category: "Marketing",
    author: {
      name: "Wale Edun",
      image: IMAGES.user3,
      about:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. ",
    },
    rating: 3.5,
    price: 10000,
    image: IMAGES.book_10,
    path: "/books",
    type: "book",
    uri: "books",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    reviews: [
      {
        id: 1,
        name: "John Doe",
        image: IMAGES.user1,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        name: "John Doe",
        image: IMAGES.user2,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
      {
        id: 3,
        name: "John Doe",
        image: IMAGES.user3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        date: "Jan 20, 2024",
      },
    ],
    createdAt: "Jan 20, 2024",
  },
];

export { BOOKS };
