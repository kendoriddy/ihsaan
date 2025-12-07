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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-nunito text-sm`} suppressHydrationWarning>
        <Suspense>
          <ReduxProvider>
            <ThemeProvider theme={muiTheme}>
              <Provider>
                <FrontendCartProvider>
                  {children}
                  <Toastify />
                </FrontendCartProvider>
              </Provider>
            </ThemeProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
