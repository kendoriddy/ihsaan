import { IMAGES } from "./images";
import { v4 as uuidv4 } from "uuid";

const COURSES = [
  {
    id: uuidv4(),
    courseId: 1,
    stars: 4,
    courseDetails: "course-1",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    title: "Time Management Skills",
    rating: 4.2,
    price: 10000,
    image: IMAGES.course_1,
    path: "/courses",
    type: "course",
    uri: "courses/course-1",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    announcements:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    reviews: [
      {
        id: 1,
        firstname: "John",
        lastname: "Kelvin",
        rating: 4.5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        image: IMAGES.user1,
        date: "Jan 20, 2024",
      },
      {
        id: 2,
        firstname: "Peter",
        lastname: "Parker",
        rating: 1.3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "Feb 20, 2024",
      },
      {
        id: 3,
        firstname: "Abdul",
        lastname: "Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "Mar 20, 2024",
      },
      {
        id: 4,
        firstname: "Ezekiel",
        lastname: "Drake",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "Apr 10, 2023",
      },
      {
        id: 5,
        firstname: "Benedict",
        lastname: "Cumberbatch",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        image: IMAGES.user2,
        date: "Apr 15, 2023",
      },
      {
        id: 6,
        firstname: "Shahrukh",
        lastname: "Khan",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        image: IMAGES.user3,
        date: "Apr 20, 2023",
      },
      {
        id: 7,
        firstname: "Muyiwa",
        lastname: "Adeniyi",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "Apr 25, 2023",
      },
      {
        id: 8,
        firstname: "Adewale",
        lastname: "Ayoola",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "Apr 30, 2023",
      },
      {
        id: 9,
        firstname: "Femi",
        lastname: "Adeniyi",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "May 5, 2023",
      },
      {
        id: 10,
        firstname: "Ezekiel",
        lastname: "Khan",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "May 10, 2023",
      },
      {
        id: 11,
        firstname: "Alade",
        lastname: "Aromikan",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "May 10, 2023",
      },
      {
        id: 11,
        firstname: "Kolade",
        lastname: "Mide",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        date: "May 10, 2023",
      },
    ],
    announcements:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",

    overview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    courseContent: [
      {
        id: 1,
        section: {
          title: "Course Orientation",
          lessons: [
            {
              id: "a1",
              title: "Do You Really Need 8 Hours of Sleep Every Night?",
              duration: "03:54",
              url: "https://res.cloudinary.com/dhpswjep4/video/upload/v1708416764/YRM/zqyidv20f15zitqahytp.mp4",
              isCompleted: false,
              resources: [
                {
                  id: 1,
                  type: "pdf",
                  title: "Course Slides",
                  url: "https://res-console.cloudinary.com/dhpswjep4/media_explorer_thumbnails/1173b9aa173a95a10d9160bdb59ebee5/download",
                },
                {
                  id: 2,
                  type: "link",
                  title: "Course Slides",
                  url: "https://www.google.com",
                },
              ],
            },
            {
              id: "a2",
              title: "Keep your goals to yourself",
              duration: "03:46",
              url: "https://www.youtube.com/watch?v=NHopJHSlVo4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a3",
              title: "TED on Jimmy Kimmel Live",
              duration: "03:35",
              url: "https://www.youtube.com/watch?v=IuzzA3046C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 2,
        section: {
          title: "Exploration Matters",
          lessons: [
            {
              id: "a4",
              title: "Try something new for 30 days",
              duration: "03:28",
              url: "https://www.youtube.com/watch?v=UNP03fDSj1U&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a5",
              title: "Self Motivation",
              duration: "03:11",
              url: "https://www.youtube.com/watch?v=rLXcLBfDwvE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a6",
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 3,
        section: {
          title: "Setting Goals",
          lessons: [
            {
              id: "a7",
              title: "The Strongest Predictor of Success",
              duration: "03:09",
              url: "https://www.youtube.com/watch?v=GfF2e0vyGM4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a8",
              title: "If Introvert Struggles Were A TED Talk",
              duration: "02:33",
              url: "https://www.youtube.com/watch?v=xeYRMOv74eE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a9",
              title: "Ted Talk",
              duration: "02:20",
              url: "https://www.youtube.com/watch?v=K0cyBDohFnE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 4,
        section: {
          title: "Prioritizing",
          lessons: [
            {
              id: "a10",
              title: "Ted Talk on Nothing",
              duration: "03:05",
              url: "https://www.youtube.com/watch?v=ePRiHbM1Ngo&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a11",
              title: "Family Guy",
              duration: "00:18",
              url: "https://www.youtube.com/watch?v=3VQWMqzs5SA&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
              resources: [
                {
                  id: 1,
                  type: "pdf",
                  title: "Course Slides",
                  url: "https://res-console.cloudinary.com/dhpswjep4/media_explorer_thumbnails/1173b9aa173a95a10d9160bdb59ebee5/download",
                },
                {
                  id: 2,
                  type: "link",
                  title: "Course Slides",
                  url: "https://www.google.com",
                },
              ],
            },
            {
              id: "a12",
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 5,
        section: {
          title: "Basic Ethics of Time Management",
          lessons: [
            {
              id: "a13",
              title: "Cut For Time",
              duration: "03:56",
              url: "https://www.youtube.com/watch?v=_U6P80CBRrc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a14",
              title: "Releasing Malaria Mosquitoes",
              duration: "00:34",
              url: "https://www.youtube.com/watch?v=2u8O2a-uEE8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a15",
              title: "DJ Subatomic Supernova TED Talk",
              duration: "00:36",
              url: "https://www.youtube.com/watch?v=sc130AI21Vg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 6,
        section: {
          title: "Expert Consultation",
          lessons: [
            {
              id: "a16",
              title: "This Dog Wants To Change The World",
              duration: "01:24",
              url: "https://www.youtube.com/watch?v=Og1bQuiLQ-M&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a17",
              title: "How To Spot A Liar",
              duration: "02:42",
              url: "https://www.youtube.com/watch?v=cVkjXr2KYJg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a18",
              title: "Got A Meeting? Take A Walk",
              duration: "03:29",
              url: "https://www.youtube.com/watch?v=iE9HMudybyc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 7,
        section: {
          title: "Economic Management Techniques",
          lessons: [
            {
              id: "a19",
              title: "TED Invites The Class Of 2020",
              duration: "01:44",
              url: "https://www.youtube.com/watch?v=HhZiI3PhXwg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a20",
              title: "Do This In The First 6 Minutes Of Your Presentation",
              duration: "02:53",
              url: "https://www.youtube.com/watch?v=5GnEwGvKxUg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a21",
              title: "Lilly Singh Gives A TED Talk In Three Minutes",
              duration: "02:58",
              url: "https://www.youtube.com/watch?v=_gTWC90frEU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 8,
        section: {
          title: "Wonderful Backgrounds Check",
          lessons: [
            {
              id: "a22",
              title: "Smash Mouth's All Star But It's A TED Talk",
              duration: "02:00",
              url: "https://www.youtube.com/watch?v=XA2mrVjjyy0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a23",
              title: "The Perfect TED Talk That Never Happened",
              duration: "03:20",
              url: "https://www.youtube.com/watch?v=D4PFrYteKxI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a24",
              title: "High SChool Training Ground",
              duration: "03:01",
              url: "https://www.youtube.com/watch?v=_Il70mlj38o&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 9,
        section: {
          title: "Exchanging Ideas",
          lessons: [
            {
              id: "a25",
              title: "If The Hood Did TED Talks",
              duration: "01:51",
              url: "https://www.youtube.com/watch?v=j6IyRaWdBj8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a26",
              title: "How To DO Virtual Meeting Right",
              duration: "01:01",
              url: "https://www.youtube.com/watch?v=wfq3OAlVuuk&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a27",
              title: "Why Every Student Deserves A Champion",
              duration: "02:50",
              url: "https://www.youtube.com/watch?v=F23ak31YnTI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 10,
        section: {
          title: "Creating A Plan",
          lessons: [
            {
              id: "a28",
              title: "The Power And Importance Of Reading",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=rW2r5uStgG0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a29",
              title: "Why Happy Couples Cheat",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=gOu9Rwl-yxw&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a30",
              title: "Why Schools Need To Embrace Kid's Creative Side",
              duration: "02:15",
              url: "https://www.youtube.com/watch?v=g4IAa8wZlqU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 11,
        section: {
          title: "Optimizing Rest Time",
          lessons: [
            {
              id: "a31",
              title: "Kids Need Recess",
              duration: "03:39",
              url: "https://www.youtube.com/watch?v=Kh9GbYugA1Y&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a32",
              title: "Make It Easy To Choose",
              duration: "02:55",
              url: "https://www.youtube.com/watch?v=x6OkcGNK_C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a33",
              title: "What Is The Biggest Rock",
              duration: "03:55",
              url: "https://www.youtube.com/watch?v=aO0TUI9r-So&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 12,
        section: {
          title: "Governing Boundaries",
          lessons: [
            {
              id: "a34",
              title: "Every TED Talk Ever in 99 Seconds",
              duration: "01:40",
              url: "https://www.youtube.com/watch?v=ZCXp9GFcDhQ&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a35",
              title: "The Message That Didn't Make Mellody",
              duration: "01:16",
              url: "https://www.youtube.com/watch?v=j9Nqdgcg-LE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a36",
              title: "Why We Make Bad Financial Choice",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=caGlzR9F2zI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 13,
        section: {
          title: "Increasing Your Potential",
          lessons: [
            {
              id: "a37",
              title: "Bill Gates Protest At TED Talk",
              duration: "00:59",
              url: "https://www.youtube.com/watch?v=E_cQh7yw5ko&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a38",
              title: "Using Social Media To Cover For Lack Of Original Thought",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=CK62I-4cuSY&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a39",
              title: "Pre Game Talk",
              duration: "01:47",
              url: "https://www.youtube.com/watch?v=Y_TJHIV5vDs&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 14,
        section: {
          title: "Implementation Of Liberal Process",

          lessons: [
            {
              id: "a40",
              title: "A Swarm Of Mini Drones",
              duration: "03:21",
              url: "https://www.youtube.com/watch?v=u2bQSKvZ2qI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a41",
              title: "Reggie Watts Improve SOng During TED Talk",
              duration: "02:07",
              url: "https://www.youtube.com/watch?v=EfvzZS5ygS8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              id: "a42",
              title: "Transform Your Routine",
              duration: "01:30",
              url: "https://www.youtube.com/watch?v=Q4sxT5A5rLc&pp=ygUPdGltZSBtYW5hZ2VtZW50",
              isCompleted: false,
            },
          ],
        },
      },
    ],

    currentSectionIndex: 0,
    currentLessonIndex: 0,
    students: [
      {
        id: 1,
        name: "John Doe",
        avatar: IMAGES.avatar1,
      },
      {
        id: 2,
        name: "Jane Doe",
        avatar: IMAGES.avatar2,
      },
      {
        id: 3,
        name: "Abdul Qadir",
        avatar: IMAGES.avatar3,
      },
      {
        id: 4,
        name: "John Doe",
        avatar: IMAGES.avatar1,
      },
      {
        id: 5,
        name: "Jane Doe",
        avatar: IMAGES.avatar2,
      },
      {
        id: 6,
        name: "Abdul Qadir",
        avatar: IMAGES.avatar3,
      },
      {
        id: 7,
        name: "John Doe",
        avatar: IMAGES.avatar1,
      },
      {
        id: 8,
        name: "Jane Doe",
        avatar: IMAGES.avatar2,
      },
      {
        id: 9,
        name: "Abdul Qadir",
        avatar: IMAGES.avatar3,
      },
    ],
    skillLevels: "All Levels",
    language: "English",
    caption: "English [Auto]",
    lectures: 28,
    videoDuration: "3 hours",
  },
  {
    id: 2,
    title: "Communication Skills",
    courseId: 2,
    stars: 4,
    courseDetails: "course-2",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    rating: 4,
    price: 12000,
    image: IMAGES.course_2,
    path: "/courses",
    type: "course",
    uri: "courses/course-2",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
    announcements:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",

    overview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    courseContent: [
      {
        id: 1,
        section: {
          title: "Course Orientation",
          lessons: [
            {
              title: "Do You Really Need 8 Hours of Sleep Every Night?",
              duration: "03:54",
              url: "https://mega.nz/file/4KNXRA7L#wNQTaSI6dm1e9I98uckrMOGxrLaDrJO3Y_uXdF5ZmKc",
              isCompleted: true,
            },
            {
              title: "Keep your goals to yourself",
              duration: "03:46",
              url: "https://www.youtube.com/watch?v=NHopJHSlVo4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: true,
            },
            {
              title: "TED on Jimmy Kimmel Live",
              duration: "03:35",
              url: "https://www.youtube.com/watch?v=IuzzA3046C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 2,
        section: {
          title: "Exploration Matters",
          lessons: [
            {
              title: "Try something new for 30 days",
              duration: "03:28",
              url: "https://www.youtube.com/watch?v=UNP03fDSj1U&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Self Motivation",
              duration: "03:11",
              url: "https://www.youtube.com/watch?v=rLXcLBfDwvE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 3,
        section: {
          title: "Setting Goals",
          lessons: [
            {
              title: "The Strongest Predictor of Success",
              duration: "03:09",
              url: "https://www.youtube.com/watch?v=GfF2e0vyGM4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "If Introvert Struggles Were A TED Talk",
              duration: "02:33",
              url: "https://www.youtube.com/watch?v=xeYRMOv74eE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Ted Talk",
              duration: "02:20",
              url: "https://www.youtube.com/watch?v=K0cyBDohFnE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 4,
        section: {
          title: "Prioritizing",
          lessons: [
            {
              title: "Ted Talk on Nothing",
              duration: "03:05",
              url: "https://www.youtube.com/watch?v=ePRiHbM1Ngo&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Family Guy",
              duration: "00:18",
              url: "https://www.youtube.com/watch?v=3VQWMqzs5SA&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 5,
        section: {
          title: "Basic Ethics of Time Management",
          lessons: [
            {
              title: "Cut For Time",
              duration: "03:56",
              url: "https://www.youtube.com/watch?v=_U6P80CBRrc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Releasing Malaria Mosquitoes",
              duration: "00:34",
              url: "https://www.youtube.com/watch?v=2u8O2a-uEE8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "DJ Subatomic Supernova TED Talk",
              duration: "00:36",
              url: "https://www.youtube.com/watch?v=sc130AI21Vg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 6,
        section: {
          title: "Expert Consultation",
          lessons: [
            {
              title: "This Dog Wants To Change The World",
              duration: "01:24",
              url: "https://www.youtube.com/watch?v=Og1bQuiLQ-M&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "How To Spot A Liar",
              duration: "02:42",
              url: "https://www.youtube.com/watch?v=cVkjXr2KYJg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Got A Meeting? Take A Walk",
              duration: "03:29",
              url: "https://www.youtube.com/watch?v=iE9HMudybyc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 7,
        section: {
          title: "Economic Management Techniques",
          lessons: [
            {
              title: "TED Invites The Class Of 2020",
              duration: "01:44",
              url: "https://www.youtube.com/watch?v=HhZiI3PhXwg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Do This In The First 6 Minutes Of Your Presentation",
              duration: "02:53",
              url: "https://www.youtube.com/watch?v=5GnEwGvKxUg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Lilly Singh Gives A TED Talk In Three Minutes",
              duration: "02:58",
              url: "https://www.youtube.com/watch?v=_gTWC90frEU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 8,
        section: {
          title: "Wonderful Backgrounds Check",
          lessons: [
            {
              title: "Smash Mouth's All Star But It's A TED Talk",
              duration: "02:00",
              url: "https://www.youtube.com/watch?v=XA2mrVjjyy0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "The Perfect TED Talk That Never Happened",
              duration: "03:20",
              url: "https://www.youtube.com/watch?v=D4PFrYteKxI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "High SChool Training Ground",
              duration: "03:01",
              url: "https://www.youtube.com/watch?v=_Il70mlj38o&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 9,
        section: {
          title: "Exchanging Ideas",
          lessons: [
            {
              title: "If The Hood Did TED Talks",
              duration: "01:51",
              url: "https://www.youtube.com/watch?v=j6IyRaWdBj8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "How To DO Virtual Meeting Right",
              duration: "01:01",
              url: "https://www.youtube.com/watch?v=wfq3OAlVuuk&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Every Student Deserves A Champion",
              duration: "02:50",
              url: "https://www.youtube.com/watch?v=F23ak31YnTI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 10,
        section: {
          title: "Creating A Plan",
          lessons: [
            {
              title: "The Power And Importance Of Reading",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=rW2r5uStgG0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Happy Couples Cheat",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=gOu9Rwl-yxw&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Schools Need To Embrace Kid's Creative Side",
              duration: "02:15",
              url: "https://www.youtube.com/watch?v=g4IAa8wZlqU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 11,
        section: {
          title: "Optimizing Rest Time",
          lessons: [
            {
              title: "Kids Need Recess",
              duration: "03:39",
              url: "https://www.youtube.com/watch?v=Kh9GbYugA1Y&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Make It Easy To Choose",
              duration: "02:55",
              url: "https://www.youtube.com/watch?v=x6OkcGNK_C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "What Is The Biggest Rock",
              duration: "03:55",
              url: "https://www.youtube.com/watch?v=aO0TUI9r-So&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 12,
        section: {
          title: "Governing Boundaries",
          lessons: [
            {
              title: "Every TED Talk Ever in 99 Seconds",
              duration: "01:40",
              url: "https://www.youtube.com/watch?v=ZCXp9GFcDhQ&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "The Message That Didn't Make Mellody",
              duration: "01:16",
              url: "https://www.youtube.com/watch?v=j9Nqdgcg-LE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why We Make Bad Financial Choice",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=caGlzR9F2zI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 13,
        section: {
          title: "Increasing Your Potential",
          lessons: [
            {
              title: "Bill Gates Protest At TED Talk",
              duration: "00:59",
              url: "https://www.youtube.com/watch?v=E_cQh7yw5ko&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Using Social Media To Cover For Lack Of Original Thought",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=CK62I-4cuSY&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Pre Game Talk",
              duration: "01:47",
              url: "https://www.youtube.com/watch?v=Y_TJHIV5vDs&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 14,
        section: {
          title: "Implementation Of Liberal Process",

          lessons: [
            {
              title: "A Swarm Of Mini Drones",
              duration: "03:21",
              url: "https://www.youtube.com/watch?v=u2bQSKvZ2qI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Reggie Watts Improve SOng During TED Talk",
              duration: "02:07",
              url: "https://www.youtube.com/watch?v=EfvzZS5ygS8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Transform Your Routine",
              duration: "01:30",
              url: "https://www.youtube.com/watch?v=Q4sxT5A5rLc&pp=ygUPdGltZSBtYW5hZ2VtZW50",
              isCompleted: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: 3,
    courseId: 3,
    stars: 4,
    courseDetails: "course-3",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    title: "Living A Healthy Life",
    rating: 4.5,
    price: 15000,
    image: IMAGES.course_3,
    path: "/courses",
    type: "course",
    uri: "courses/course-3",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
    announcements:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",

    overview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    courseContent: [
      {
        id: 1,
        section: {
          title: "Course Orientation",
          lessons: [
            {
              title: "Do You Really Need 8 Hours of Sleep Every Night?",
              duration: "03:54",
              url: "https://mega.nz/file/4KNXRA7L#wNQTaSI6dm1e9I98uckrMOGxrLaDrJO3Y_uXdF5ZmKc",
              isCompleted: true,
            },
            {
              title: "Keep your goals to yourself",
              duration: "03:46",
              url: "https://www.youtube.com/watch?v=NHopJHSlVo4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: true,
            },
            {
              title: "TED on Jimmy Kimmel Live",
              duration: "03:35",
              url: "https://www.youtube.com/watch?v=IuzzA3046C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 2,
        section: {
          title: "Exploration Matters",
          lessons: [
            {
              title: "Try something new for 30 days",
              duration: "03:28",
              url: "https://www.youtube.com/watch?v=UNP03fDSj1U&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Self Motivation",
              duration: "03:11",
              url: "https://www.youtube.com/watch?v=rLXcLBfDwvE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 3,
        section: {
          title: "Setting Goals",
          lessons: [
            {
              title: "The Strongest Predictor of Success",
              duration: "03:09",
              url: "https://www.youtube.com/watch?v=GfF2e0vyGM4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "If Introvert Struggles Were A TED Talk",
              duration: "02:33",
              url: "https://www.youtube.com/watch?v=xeYRMOv74eE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Ted Talk",
              duration: "02:20",
              url: "https://www.youtube.com/watch?v=K0cyBDohFnE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 4,
        section: {
          title: "Prioritizing",
          lessons: [
            {
              title: "Ted Talk on Nothing",
              duration: "03:05",
              url: "https://www.youtube.com/watch?v=ePRiHbM1Ngo&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Family Guy",
              duration: "00:18",
              url: "https://www.youtube.com/watch?v=3VQWMqzs5SA&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 5,
        section: {
          title: "Basic Ethics of Time Management",
          lessons: [
            {
              title: "Cut For Time",
              duration: "03:56",
              url: "https://www.youtube.com/watch?v=_U6P80CBRrc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Releasing Malaria Mosquitoes",
              duration: "00:34",
              url: "https://www.youtube.com/watch?v=2u8O2a-uEE8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "DJ Subatomic Supernova TED Talk",
              duration: "00:36",
              url: "https://www.youtube.com/watch?v=sc130AI21Vg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 6,
        section: {
          title: "Expert Consultation",
          lessons: [
            {
              title: "This Dog Wants To Change The World",
              duration: "01:24",
              url: "https://www.youtube.com/watch?v=Og1bQuiLQ-M&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "How To Spot A Liar",
              duration: "02:42",
              url: "https://www.youtube.com/watch?v=cVkjXr2KYJg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Got A Meeting? Take A Walk",
              duration: "03:29",
              url: "https://www.youtube.com/watch?v=iE9HMudybyc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 7,
        section: {
          title: "Economic Management Techniques",
          lessons: [
            {
              title: "TED Invites The Class Of 2020",
              duration: "01:44",
              url: "https://www.youtube.com/watch?v=HhZiI3PhXwg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Do This In The First 6 Minutes Of Your Presentation",
              duration: "02:53",
              url: "https://www.youtube.com/watch?v=5GnEwGvKxUg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Lilly Singh Gives A TED Talk In Three Minutes",
              duration: "02:58",
              url: "https://www.youtube.com/watch?v=_gTWC90frEU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 8,
        section: {
          title: "Wonderful Backgrounds Check",
          lessons: [
            {
              title: "Smash Mouth's All Star But It's A TED Talk",
              duration: "02:00",
              url: "https://www.youtube.com/watch?v=XA2mrVjjyy0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "The Perfect TED Talk That Never Happened",
              duration: "03:20",
              url: "https://www.youtube.com/watch?v=D4PFrYteKxI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "High SChool Training Ground",
              duration: "03:01",
              url: "https://www.youtube.com/watch?v=_Il70mlj38o&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 9,
        section: {
          title: "Exchanging Ideas",
          lessons: [
            {
              title: "If The Hood Did TED Talks",
              duration: "01:51",
              url: "https://www.youtube.com/watch?v=j6IyRaWdBj8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "How To DO Virtual Meeting Right",
              duration: "01:01",
              url: "https://www.youtube.com/watch?v=wfq3OAlVuuk&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Every Student Deserves A Champion",
              duration: "02:50",
              url: "https://www.youtube.com/watch?v=F23ak31YnTI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 10,
        section: {
          title: "Creating A Plan",
          lessons: [
            {
              title: "The Power And Importance Of Reading",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=rW2r5uStgG0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Happy Couples Cheat",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=gOu9Rwl-yxw&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Schools Need To Embrace Kid's Creative Side",
              duration: "02:15",
              url: "https://www.youtube.com/watch?v=g4IAa8wZlqU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 11,
        section: {
          title: "Optimizing Rest Time",
          lessons: [
            {
              title: "Kids Need Recess",
              duration: "03:39",
              url: "https://www.youtube.com/watch?v=Kh9GbYugA1Y&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Make It Easy To Choose",
              duration: "02:55",
              url: "https://www.youtube.com/watch?v=x6OkcGNK_C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "What Is The Biggest Rock",
              duration: "03:55",
              url: "https://www.youtube.com/watch?v=aO0TUI9r-So&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 12,
        section: {
          title: "Governing Boundaries",
          lessons: [
            {
              title: "Every TED Talk Ever in 99 Seconds",
              duration: "01:40",
              url: "https://www.youtube.com/watch?v=ZCXp9GFcDhQ&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "The Message That Didn't Make Mellody",
              duration: "01:16",
              url: "https://www.youtube.com/watch?v=j9Nqdgcg-LE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why We Make Bad Financial Choice",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=caGlzR9F2zI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 13,
        section: {
          title: "Increasing Your Potential",
          lessons: [
            {
              title: "Bill Gates Protest At TED Talk",
              duration: "00:59",
              url: "https://www.youtube.com/watch?v=E_cQh7yw5ko&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Using Social Media To Cover For Lack Of Original Thought",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=CK62I-4cuSY&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Pre Game Talk",
              duration: "01:47",
              url: "https://www.youtube.com/watch?v=Y_TJHIV5vDs&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 14,
        section: {
          title: "Implementation Of Liberal Process",

          lessons: [
            {
              title: "A Swarm Of Mini Drones",
              duration: "03:21",
              url: "https://www.youtube.com/watch?v=u2bQSKvZ2qI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Reggie Watts Improve SOng During TED Talk",
              duration: "02:07",
              url: "https://www.youtube.com/watch?v=EfvzZS5ygS8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Transform Your Routine",
              duration: "01:30",
              url: "https://www.youtube.com/watch?v=Q4sxT5A5rLc&pp=ygUPdGltZSBtYW5hZ2VtZW50",
              isCompleted: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: 4,
    courseId: 4,
    stars: 4,
    courseDetails: "course-4",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    title: "Self Confidence",
    rating: 4,
    price: 20000,
    image: IMAGES.course_4,
    path: "/courses",
    type: "course",
    uri: "courses/course-4",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
    announcements:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",

    overview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    courseContent: [
      {
        id: 1,
        section: {
          title: "Course Orientation",
          lessons: [
            {
              title: "Do You Really Need 8 Hours of Sleep Every Night?",
              duration: "03:54",
              url: "https://mega.nz/file/4KNXRA7L#wNQTaSI6dm1e9I98uckrMOGxrLaDrJO3Y_uXdF5ZmKc",
              isCompleted: true,
            },
            {
              title: "Keep your goals to yourself",
              duration: "03:46",
              url: "https://www.youtube.com/watch?v=NHopJHSlVo4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: true,
            },
            {
              title: "TED on Jimmy Kimmel Live",
              duration: "03:35",
              url: "https://www.youtube.com/watch?v=IuzzA3046C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 2,
        section: {
          title: "Exploration Matters",
          lessons: [
            {
              title: "Try something new for 30 days",
              duration: "03:28",
              url: "https://www.youtube.com/watch?v=UNP03fDSj1U&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Self Motivation",
              duration: "03:11",
              url: "https://www.youtube.com/watch?v=rLXcLBfDwvE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 3,
        section: {
          title: "Setting Goals",
          lessons: [
            {
              title: "The Strongest Predictor of Success",
              duration: "03:09",
              url: "https://www.youtube.com/watch?v=GfF2e0vyGM4&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "If Introvert Struggles Were A TED Talk",
              duration: "02:33",
              url: "https://www.youtube.com/watch?v=xeYRMOv74eE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Ted Talk",
              duration: "02:20",
              url: "https://www.youtube.com/watch?v=K0cyBDohFnE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 4,
        section: {
          title: "Prioritizing",
          lessons: [
            {
              title: "Ted Talk on Nothing",
              duration: "03:05",
              url: "https://www.youtube.com/watch?v=ePRiHbM1Ngo&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Family Guy",
              duration: "00:18",
              url: "https://www.youtube.com/watch?v=3VQWMqzs5SA&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why You Procrastinate",
              duration: "03:51",
              url: "https://www.youtube.com/watch?v=Rk5C149J9C0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 5,
        section: {
          title: "Basic Ethics of Time Management",
          lessons: [
            {
              title: "Cut For Time",
              duration: "03:56",
              url: "https://www.youtube.com/watch?v=_U6P80CBRrc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Releasing Malaria Mosquitoes",
              duration: "00:34",
              url: "https://www.youtube.com/watch?v=2u8O2a-uEE8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "DJ Subatomic Supernova TED Talk",
              duration: "00:36",
              url: "https://www.youtube.com/watch?v=sc130AI21Vg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 6,
        section: {
          title: "Expert Consultation",
          lessons: [
            {
              title: "This Dog Wants To Change The World",
              duration: "01:24",
              url: "https://www.youtube.com/watch?v=Og1bQuiLQ-M&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "How To Spot A Liar",
              duration: "02:42",
              url: "https://www.youtube.com/watch?v=cVkjXr2KYJg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Got A Meeting? Take A Walk",
              duration: "03:29",
              url: "https://www.youtube.com/watch?v=iE9HMudybyc&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 7,
        section: {
          title: "Economic Management Techniques",
          lessons: [
            {
              title: "TED Invites The Class Of 2020",
              duration: "01:44",
              url: "https://www.youtube.com/watch?v=HhZiI3PhXwg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Do This In The First 6 Minutes Of Your Presentation",
              duration: "02:53",
              url: "https://www.youtube.com/watch?v=5GnEwGvKxUg&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Lilly Singh Gives A TED Talk In Three Minutes",
              duration: "02:58",
              url: "https://www.youtube.com/watch?v=_gTWC90frEU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 8,
        section: {
          title: "Wonderful Backgrounds Check",
          lessons: [
            {
              title: "Smash Mouth's All Star But It's A TED Talk",
              duration: "02:00",
              url: "https://www.youtube.com/watch?v=XA2mrVjjyy0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "The Perfect TED Talk That Never Happened",
              duration: "03:20",
              url: "https://www.youtube.com/watch?v=D4PFrYteKxI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "High SChool Training Ground",
              duration: "03:01",
              url: "https://www.youtube.com/watch?v=_Il70mlj38o&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 9,
        section: {
          title: "Exchanging Ideas",
          lessons: [
            {
              title: "If The Hood Did TED Talks",
              duration: "01:51",
              url: "https://www.youtube.com/watch?v=j6IyRaWdBj8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "How To DO Virtual Meeting Right",
              duration: "01:01",
              url: "https://www.youtube.com/watch?v=wfq3OAlVuuk&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Every Student Deserves A Champion",
              duration: "02:50",
              url: "https://www.youtube.com/watch?v=F23ak31YnTI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 10,
        section: {
          title: "Creating A Plan",
          lessons: [
            {
              title: "The Power And Importance Of Reading",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=rW2r5uStgG0&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Happy Couples Cheat",
              duration: "03:10",
              url: "https://www.youtube.com/watch?v=gOu9Rwl-yxw&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why Schools Need To Embrace Kid's Creative Side",
              duration: "02:15",
              url: "https://www.youtube.com/watch?v=g4IAa8wZlqU&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 11,
        section: {
          title: "Optimizing Rest Time",
          lessons: [
            {
              title: "Kids Need Recess",
              duration: "03:39",
              url: "https://www.youtube.com/watch?v=Kh9GbYugA1Y&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Make It Easy To Choose",
              duration: "02:55",
              url: "https://www.youtube.com/watch?v=x6OkcGNK_C8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "What Is The Biggest Rock",
              duration: "03:55",
              url: "https://www.youtube.com/watch?v=aO0TUI9r-So&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 12,
        section: {
          title: "Governing Boundaries",
          lessons: [
            {
              title: "Every TED Talk Ever in 99 Seconds",
              duration: "01:40",
              url: "https://www.youtube.com/watch?v=ZCXp9GFcDhQ&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "The Message That Didn't Make Mellody",
              duration: "01:16",
              url: "https://www.youtube.com/watch?v=j9Nqdgcg-LE&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Why We Make Bad Financial Choice",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=caGlzR9F2zI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 13,
        section: {
          title: "Increasing Your Potential",
          lessons: [
            {
              title: "Bill Gates Protest At TED Talk",
              duration: "00:59",
              url: "https://www.youtube.com/watch?v=E_cQh7yw5ko&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Using Social Media To Cover For Lack Of Original Thought",
              duration: "03:37",
              url: "https://www.youtube.com/watch?v=CK62I-4cuSY&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Pre Game Talk",
              duration: "01:47",
              url: "https://www.youtube.com/watch?v=Y_TJHIV5vDs&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
          ],
        },
      },
      {
        id: 14,
        section: {
          title: "Implementation Of Liberal Process",

          lessons: [
            {
              title: "A Swarm Of Mini Drones",
              duration: "03:21",
              url: "https://www.youtube.com/watch?v=u2bQSKvZ2qI&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Reggie Watts Improve SOng During TED Talk",
              duration: "02:07",
              url: "https://www.youtube.com/watch?v=EfvzZS5ygS8&pp=ygUIdGVkIHRhbGs%3D",
              isCompleted: false,
            },
            {
              title: "Transform Your Routine",
              duration: "01:30",
              url: "https://www.youtube.com/watch?v=Q4sxT5A5rLc&pp=ygUPdGltZSBtYW5hZ2VtZW50",
              isCompleted: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: 5,
    courseId: 5,
    stars: 4,
    courseDetails: "course-5",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    title: "Self Discipline",
    rating: 4,
    price: 20000,
    image: IMAGES.course_5,
    path: "/courses",
    type: "course",
    uri: "courses/course-5",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
  {
    id: 6,
    title: "Emotional Intelligence",
    courseId: 6,
    stars: 4,
    courseDetails: "course-6",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    rating: 5,
    price: 10000,
    image: IMAGES.course_6,
    path: "/courses",
    type: "course",
    uri: "courses/course-6",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
  {
    id: 7,
    courseId: 7,
    stars: 4,
    courseDetails: "course-7",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    title: "Increase Your Intelligence",
    rating: 4,
    price: 10000,
    image: IMAGES.course_7,
    path: "/courses",
    type: "course",
    uri: "courses/course-7",

    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
  {
    id: 8,
    courseId: 8,
    stars: 4,
    courseDetails: "course-8",
    videoLink: "https://yrm-staging.vercel.app/assets/video/course_preview.mp4",
    title: "Living A Happy Life",
    rating: 5,
    price: 15000,
    image: IMAGES.course_8,
    path: "/courses",
    type: "course",
    uri: "courses/course-8",
    summary: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    ],
    createdAt: "Jan 20, 2024",
    reviews: [
      {
        id: 1,
        name: "External User",
        rating: 4,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 2,
        name: "John Doe",
        rating: 5,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        id: 3,
        name: "Abdul Qadir",
        rating: 3,
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
];

export { COURSES };
