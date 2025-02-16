import { v4 as uuidv4 } from "uuid";

const ADMINCONSTANTS = {
  // Categories
  categories: [
    { id: uuidv4(), category: "Category 1", dateCreated: "2021-10-10" },
    { id: uuidv4(), category: "Category 2", dateCreated: "2021-10-10" },
    { id: uuidv4(), category: "Category 3", dateCreated: "2021-10-10" },
    { id: uuidv4(), category: "Category 4", dateCreated: "2021-10-10" },
    { id: uuidv4(), category: "Category 5", dateCreated: "2021-10-10" },
    { id: uuidv4(), category: "Category 6", dateCreated: "2021-10-10" },
  ],

  // Mentors
  mentors: [
    {
      id: uuidv4(),
      name: "Ismael Waheed",
      course: "Marketing",
      memeberSince: "2021-10-10",
      earned: 400000,
      accountStatus: "active",
      account: "account",
    },
    {
      id: uuidv4(),
      name: "John Thompsons",
      course: "UI/UX",
      memeberSince: "2021-05-10",
      earned: 400000,
      accountStatus: "active",
      account: "account",
    },
    {
      id: uuidv4(),
      name: "Johnson Abram",
      course: "UI/UX Design",
      memeberSince: "2021-01-10",
      earned: 440000,
      accountStatus: "active",
      account: "account",
    },
    {
      id: uuidv4(),
      name: "Wally Askren",
      course: "UI/UX Design",
      memeberSince: "2021-01-10",
      earned: 1440000,
      accountStatus: "active",
      account: "account",
    },
  ],

  // Mentees
  mentees: [
    {
      id: uuidv4(),
      name: "Adewale Waheed",
      course: "Marketing",
      memeberSince: "2021-10-10",
      earned: 400000,
      accountStatus: "active",
      account: "account",
    },
    {
      id: uuidv4(),
      name: "Kayode Thompson",
      course: "UI/UX",
      memeberSince: "2021-05-10",
      earned: 400000,
      accountStatus: "active",
      account: "account",
    },
    {
      id: uuidv4(),
      name: "Basorun Abram",
      course: "UI/UX Design",
      memeberSince: "2021-01-10",
      earned: 440000,
      accountStatus: "active",
      account: "account",
    },
    {
      id: uuidv4(),
      name: "Dotun Adeyinka",
      course: "UI/UX Design",
      memeberSince: "2021-01-10",
      earned: 1440000,
      accountStatus: "active",
      account: "account",
    },
  ],

  // Bookings
  bookings: [
    {
      id: uuidv4(),
      mentorName: "Ismael Waheed",
      course: "Digital Marketing",
      menteeName: "Adewale Waheed",
      earned: 4000,
      time: "2024-03-08T14:390",
      amount: 10000,
    },
    {
      id: uuidv4(),
      mentorName: "John Thompson",
      course: "UI/UX",
      menteeName: "Kayode Thompson",
      earned: 4000,
      time: "2024-03-08T14:39",
      amount: 10000,
    },
    {
      id: uuidv4(),
      mentorName: "Johnson Abram",
      course: "UI/UX Design",
      menteeName: "Basorun Abram",
      earned: 4000,
      time: "2024-03-08T14:390",
      amount: 10000,
    },
    {
      id: uuidv4(),
      mentorName: "Wally Askren",
      course: "UI/UX Design",
      menteeName: "Dotun Adeyinka",
      earned: 4000,
      time: "2024-03-08T14:39",
      amount: 10000,
    },
  ],

  // Quotes
  quotes: [
    {
      id: uuidv4(),
      quote: "The only thing we have to fear is fear itself.",
      source: "Franklin D. Roosevelt",
    },
    {
      id: uuidv4(),
      quote: "In the beginning God created the heavens and the earth.",
      source: "The Bible",
    },
    {
      id: uuidv4(),
      quote:
        "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
      source: "Ralph Waldo Emerson",
    },
    {
      id: uuidv4(),
      quote:
        "The only limit to our realization of tomorrow will be our doubts of today.",
      source: "Franklin D. Roosevelt",
    },
    {
      id: uuidv4(),
      quote: "The only way to do great work is to love what you do.",
      source: "Steve Jobs",
    },
    {
      id: uuidv4(),
      quote:
        "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
      source: "Albert Einstein",
    },
    {
      id: uuidv4(),
      quote:
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      source: "Nelson Mandela",
    },
  ],
};

export { ADMINCONSTANTS };
