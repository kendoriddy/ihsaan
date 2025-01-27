"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { IMAGES, USERS } from "@/constants";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ededed",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

// Create Document Component
const Certificate = ({ courseTitle }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View>
        <Image
          src={
            "https://res.cloudinary.com/dhpswjep4/image/upload/v1708518002/YRM/logo.png"
          }
          style={{
            width: 100,
            // height: 100,
            marginHorizontal: "auto",
            paddingTop: 20,
          }}
          alt="Logo"
        />
      </View>

      <View style={{ paddingVertical: 10 }}>
        <Text>Certificate of cource</Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text>This is hereby granted to</Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", paddingVertical: 10 }}>
          {USERS[0].firstname} {USERS[0].secondname}{" "}
        </Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text>
          For successful completion of the{" "}
          <Text style={{ textTransform: "uppercase" }}>{courseTitle}</Text>{" "}
          course
        </Text>
      </View>
    </Page>
  </Document>
);

export default Certificate;
