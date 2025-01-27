"use client";
import { useState, Suspense } from "react";
import { Tabs, Tab, Box, Grid, styled } from "@mui/material";
import Loader from "./Loader";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-${index}`}
      aria-labelledby={`service-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `service-${index}`,
    "aria-controls": `service-tabpanel-${index}`,
  };
}

const CustomizedTab = ({ data, variant }) => {
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: "none",
      borderBottom: "none",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: "1.3rem",
      marginRight: theme.spacing(1),
      color: "semibold.secondary",
      width: "max-content",
      borderRadius: ".8rem",
      paddingInline: "1.8rem",
      paddingBlock: ".6rem",
      minWidth: 0,
      minHeight: 0,
      "& .MuiTabs-indicator": {
        display: "none",
      },
      "&.Mui-selected": {
        color: "#fff",
        backgroundColor: "#1C2458",
        boxShadow: "0px 0px 3px 0px #D7D7D8",
      },
      "&.Mui-focusVisible": {
        backgroundColor: "transparent",
      },
    })
  );

  const StyledTabs = styled((props) => <Tabs {...props} variant={variant} />)({
    "& .MuiTabs-indicator": {
      display: "none",
    },
    alignItems: "center",
    paddingInline: ".5rem",
    backgroundColor: "#FAFAFA",
    width: "max-content",
    marginTop: "1rem",
    border: "1px solid #ECEBEC",
    borderRadius: "1rem",
  });

  StyledTabs.defaultProps = {
    variant: "fullWidth",
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <StyledTabs
          allowScrollButtonsMobile
          value={value}
          onChange={handleChange}
          aria-label="tabs"
        >
          {data.map((item) => (
            <StyledTab
              key={item.label}
              label={item.label}
              icon={item.icon}
              {...a11yProps(item.index)}
            />
          ))}
        </StyledTabs>
      </Box>
      <Suspense
        fallback={
          <Grid item my={1}>
            <Loader />
          </Grid>
        }
      >
        {data.map((item) => (
          <CustomTabPanel value={value} index={item.index} key={item.index}>
            <item.component />
          </CustomTabPanel>
        ))}
      </Suspense>
    </Box>
  );
};

export default CustomizedTab;
