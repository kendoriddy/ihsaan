import "./globals.css";
import ReduxProvider from "@/utils/redux/ReduxProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import { muiTheme } from "@/utils/muiTheme";
import Provider from "./provider";
import Toastify from "@/components/Toastify";
import { Suspense } from "react";
import { FrontendCartProvider } from "@/utils/FrontendCartContext";

export const metadata = {
  title: "IHSAAN ACADEMIA",
  description: "IHSAAN ACADEMIA",
};

export default function RootLayout({ children }) {
  return (
    <Suspense>
      <ReduxProvider>
        <ThemeProvider theme={muiTheme}>
          <html lang="en">
            <Provider>
              <FrontendCartProvider>
                <body className={`font-nunito text-sm`}>
                  {children}
                  <Toastify />
                </body>
              </FrontendCartProvider>
            </Provider>
          </html>
        </ThemeProvider>
      </ReduxProvider>
    </Suspense>
  );
}
