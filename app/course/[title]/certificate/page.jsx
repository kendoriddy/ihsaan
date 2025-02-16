"use client";

import Footer from "@/components/Footer";
import { COURSES, IMAGES } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePathname, useRouter } from "next/navigation";
import { PDFViewer, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import Certificate from "@/components/Certificate";

function Page({ params }) {
  const router = useRouter();
  const pathname = usePathname();
  const [domLoaded, setDomLoaded] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  const handleGoBack = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    viewer: {
      width: "100%",
      height: "100%",
      padding: 20,
    },
  });

  useEffect(() => {
    const getCourseTitle = () => {
      const parts = pathname.split("/");
      setCourseTitle(parts[parts.length - 2]);
    };

    getCourseTitle();

    setDomLoaded(true);
  }, [pathname]);

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link href={"/"}>
            <div className="border-r-2 pr-4 hidden md:block">
              <Image src={IMAGES.logo} alt="logo" width={40} />
            </div>
          </Link>
          <div className="md:hidden">
            <span onClick={handleGoBack}>
              <ArrowBackIcon />
            </span>
          </div>
          <div>{COURSES[0].title}</div>
        </div>
        {/* Right */}
        <div></div>
      </header>

      <main className="main py-6">
        {/* Certificate */}
        <div className="flex justify-center items-center h-[650px]">
          {domLoaded && (
            <PDFViewer style={styles.viewer} showToolbar={false}>
              <Certificate courseTitle={courseTitle} />
            </PDFViewer>
          )}
        </div>

        {/* Download Button */}
        <div className="text-center  py-6">
          {domLoaded && (
            <PDFDownloadLink
              document={<Certificate courseTitle={courseTitle} />}
              fileName="certificate.pdf"
              style={{
                textAlign: "center",
                padding: "10px 20px",
                color: "#fff",
                backgroundColor: "rgb(243, 65, 3)",
                borderRadius: 5,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}>
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Page;
