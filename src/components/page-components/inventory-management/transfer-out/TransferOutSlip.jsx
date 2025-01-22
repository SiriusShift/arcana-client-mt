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
    display: "flex",
    backgroundColor: "white",
    justifyContent: "space-between",
    padding: 10, // Adjust padding around the page
    minHeight: "100%", // Ensure the page height is at least full
    position: "relative", // Allow absolute positioning of footer
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5, // Reduced space between rows
  },
  header: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 5, // Reduced horizontal padding
  },
  text: {
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid black", // Ensure the table has borders
    borderRight: "0px",
    borderBottom: "0px",
    marginTop: 10,
  },
  tableRow: {
    width: "100%",
    display: "table-row",
    flexDirection: "row",
  },
  tableCell: {
    display: "table-cell",
    padding: 5,
    fontSize: 7, // Font size set to 7
    textAlign: "center", // Center-align the cell content
    borderRight: "1px solid black", // Add right border for each cell
    borderBottom: "1px solid black", // Add bottom border for each cell
  },
  tableHeader: {
    fontSize: 7,
    backgroundColor: "#f0f0f0",
    textAlign: "center", // Center-align the header text
    fontWeight: "bold", // Bold header text
  },
  // Adjusted column widths
  tableCellQty: {
    width: "10%", // Reduced Delivery Date column width
  },
  tableCellUnit: {
    width: "10%", // Reduced Invoice No. column width
  },
  tableCellProductCode: {
    width: "20%", // Slightly increased Product Code column width
  },
  tableCellDescription: {
    width: "20%", // Slightly increased Description column width
  },
  tableCellUnitPrice: {
    width: "20%", // Slightly increased Unit Price column width
  },
  tableCellAmount: {
    width: "20%", // Slightly increased Amount column width
  },
  textBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  footerBackground: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    width: "100%",
  },
  footerBox: {
    width: "75%",
    gap: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  footerFrom: {
    width: "40%",
    height: 25,
    paddingHorizontal: 5,
    paddingVertical: 3,
    border: "1px solid black",
  },
  footerBoxTextHeader: {
    fontSize: 6,
    paddingBottom: 2,
    fontWeight: "bold",
    textAlign: "left"
  }
});

const TransferOutSlip = ({ data }) => {
  return (
    <Document>
      <Page size="A6" orientation="landscape" style={styles.page}>
        <View>
          <View fixed style={styles.header}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text style={[styles.text, { fontWeight: "bold" }]}>
                Internal Transfer
              </Text>
              <Text style={styles.text}>No. {data?.id}</Text>
            </View>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
              <Text style={[styles.text, { fontWeight: "bold" }]}>
                Date: {moment(data?.transactionDate).format("MMMM DD, YYYY")}
              </Text>
            </View>
          </View>

          {/* Table with Transfer Items */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellQty,
                ]}
              >
                QTY
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellUnit,
                ]}
              >
                UNIT
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellProductCode,
                ]}
              >
                PRODUCT CODE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellDescription,
                ]}
              >
                DESCRIPTION
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellUnitPrice,
                ]}
              >
                UNIT PRICE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellAmount,
                ]}
              >
                AMOUNT
              </Text>
            </View>

            {/* Iterate through the transfer items */}
            {data?.transferItems?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellQty]}>
                  {item?.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellUnit]}>
                  {item?.uom}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellProductCode]}>
                  {item?.itemCode}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellDescription]}>
                  {item?.itemDescription}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellUnitPrice]}>
                  {/* Unit price can be added here */}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellAmount]}>
                  {/* Amount can be added here */}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View fixed style={styles.footerBackground}>
          <View style={styles.footerBox}>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <View style={styles.footerFrom}>
                <Text
                  style={styles.footerBoxTextHeader}
                >
                  From:
                </Text>
                <Text style={{ fontSize: 7 }}>{data?.createdBy}</Text>
              </View>
              <View style={styles.footerFrom}>
                <Text
                  style={styles.footerBoxTextHeader}
                >
                  Delivered by:
                </Text>
                <Text style={{ fontSize: 7 }}>{data?.createdBy}</Text>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <View style={styles.footerFrom}>
                <Text
                  style={styles.footerBoxTextHeader}
                >
                  To:
                </Text>
                <Text style={{ fontSize: 7 }}>{data?.transferTo}</Text>
              </View>
              <View style={styles.footerFrom}>
                <Text
                  style={styles.footerBoxTextHeader}
                >
                  Prepared By:
                </Text>
                <Text style={{ fontSize: 7 }}>{data?.createdBy}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TransferOutSlip;
