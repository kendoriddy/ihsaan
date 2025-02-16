import { IMAGES } from "./images";

const BLOG = {
  posts: [
    {
      id: 1,
      title:
        "The best thing that happend to us is an amazing team. Fill the form to join us.",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog1,
      category: "Education",
      tags: "Education, School, Learning",
      author: {
        name: "Taofeek Lawal",
        image: IMAGES.user1,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 2",
            image: IMAGES.user2,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 3",
            image: IMAGES.user3,
          },
          date: "Jan 20, 2024",
        },
      ],

      date: "Jan 20, 2024",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 2,
      title: "Consider subscribing to our newsletter",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog2,
      category: "Sport",
      tags: "Sport, Football, Entertainment",
      author: {
        name: "Author 2",
        image: IMAGES.user2,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],

      date: "Dec 25, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 3,
      title: "Considering the US election",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog3,
      author: {
        name: "Author 3",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      category: "Learning",
      tags: "Learning, School, Education",
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 4,
      title: "Blog Post 4",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog4,
      category: "Entertainment",
      tags: "Entertainment, Music, Sport",
      author: {
        name: "Author 4",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 5,
      title: "This is another blogpost",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog2,
      category: "Entertainment",
      tags: "Entertainment, Music, Sport",
      author: {
        name: "Author 4",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 6,
      title: "Miss Rahmat is a great teacher",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog2,
      category: "Entertainment",
      tags: "Entertainment, Music, Sport",
      author: {
        name: "Author 4",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 7,
      title: "Study is hard but it pays off",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog2,
      category: "Entertainment",
      tags: "Entertainment, Music, Sport",
      author: {
        name: "Author 4",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 8,
      title: "Hala Madrid!",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog2,
      category: "Entertainment",
      tags: "Entertainment, Music, Sport",
      author: {
        name: "Author 4",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
    {
      id: 9,
      title: "Blog post 9",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
      image: IMAGES.blog2,
      category: "Entertainment",
      tags: "Entertainment, Music, Sport",
      author: {
        name: "Author 4",
        image: IMAGES.user3,
      },
      comments: [
        {
          id: 1,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 2,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
        {
          id: 3,
          body: "This is a comment",
          author: {
            name: "Author 1",
            image: IMAGES.user1,
          },
          date: "Jan 20, 2024",
        },
      ],
      date: "Feb 22, 2023",
      updatedDate: "Jan 20, 2024",
    },
  ],
  categories: ["Education", "Sport", "Entertainment", "News", "Technology"],
  tags: [
    "E-commerce",
    "Digital",
    "Business",
    "Technology",
    "Education",
    "School",
    "Learning",
    "Football",
    "Music",
    "Politics",
    "News",
    "Entertainment",
    "Sport",
    "Learning",
    "School",
    "Music",
    "Football",
    "Politics",
    "News",
    "Technology",
  ],
};

export { BLOG };
