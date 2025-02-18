import { Grid, Typography } from "@mui/material";
import CustomizedTab from "../../components/Tabs";
import { lazy, LazyExoticComponent, FC } from "react";
const Mentor = lazy(() => import("./MentorTab"));
const Mentee = lazy(() => import("./MenteeTab"));
const Councellor = lazy(() => import("./Councellor"));
const Councellee = lazy(() => import("./Councelle"));
const UserDashTab = () => {
  const data = [
    {
      index: 0,
      label: "Mentor",
      component: Mentor,
    },
    {
      index: 1,
      label: "Mentee",
      component: Mentee,
    },
    {
      index: 2,
      label: "Councellor",
      component: Councellor,
    },
    {
      index: 3,
      label: "Councellee",
      component: Councellee,
    },
  ];
  return (
    <>
      <Grid item container flexDirection={"column"} gap={3} mt={1}>
        <CustomizedTab data={data} variant="standard" />
      </Grid>
    </>
  );
};

export default UserDashTab;
