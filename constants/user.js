import { IMAGES } from "./images";

const USERS = [
  {
    id: 1,
    firstname: "Alao",
    secondname: "Akala",
    email: "Alaoakala22@mail.com",
    password: "password",
    role: "user",
    avatar: IMAGES.avatar1,
    courses: [
      {
        id: 1,
        title: "React",
        progressPercentage: 50,
      },
      {
        id: 2,
        title: "JavaScript",
        progressPercentage: 85,
      },
      {
        id: 3,
        title: "HTML",
        progressPercentage: 10,
      },
    ],
  },
];

export { USERS };
