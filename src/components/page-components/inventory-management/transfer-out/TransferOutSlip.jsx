import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    lineHeight: 1.4,
    padding: 10,
    minHeight: "100%", // Ensure the page height is at least full
    position: "relative", // Allow absolute positioning of footer
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, // Adds some space between rows if needed
  },
});

const TransferOutSlip = ({ data }) => {
  return (
    <Document>
      <Page size="A6" orientation="landscape" style={styles.page}>
        <View style={styles.row}>
          <Text>No. {data.id}</Text>
        </View>
        <View style={[styles.row, { justifyContent: "center" }]}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            Transfer Out Slip
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default TransferOutSlip;
