import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";

function loading() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {/* <Box sx={{ display: "flex" }}> */}
      <CircularProgress />
      {/* </Box> */}
    </div>
  );
}

export default loading;
