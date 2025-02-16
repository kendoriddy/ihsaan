import "./globals.css";
import ReduxProvider from "@/utils/redux/ReduxProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import { muiTheme } from "@/utils/muiTheme";
import Provider from "./provider";
import Toastify from "@/components/Toastify";

export const metadata = {
  title: "Your Right Mentors",
  description: "Your Right Mentors",
};

export default function RootLayout({ children }) {
  return (
    <ReduxProvider>
      <ThemeProvider theme={muiTheme}>
        <html lang="en">
          <Provider>
            <body className={`font-nunito text-sm`}>
              {children}
              <Toastify />
            </body>
          </Provider>
        </html>
      </ThemeProvider>
    </ReduxProvider>
  );
}
