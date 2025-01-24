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
    paddingHorizontal: 20,
    paddingBottom: 25,
    minHeight: "100%",
    position: "relative",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid black",
    paddingVertical: 10,
  },
  text: {
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "100%",
  },
  tableRow: {
    width: "100%",
    display: "table-row",
    flexDirection: "row",
    pageBreakInside: "avoid", // Ensures row won't split across pages
  },
  tableCell: {
    display: "table-cell",
    padding: 5,
    fontSize: 7,
    textAlign: "center",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    wordBreak: "break-word", // Allow text to wrap
    overflowWrap: "break-word", // Ensure wrapping within the cell
  },
  tableHeader: {
    fontSize: 7,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCellQty: {
    width: "10%",
    height: 20.5,
  },
  tableCellUnit: {
    width: "10%",
    height: 20.5,
  },
  tableCellProductCode: {
    width: "20%",
    height: 20.5,
  },
  tableCellDescription: {
    width: "30%",
    height: 20.5,
  },
  tableCellUnitPrice: {
    width: "15%",
    height: 20.5,
  },
  tableCellAmount: {
    width: "15%",
    height: 20.5,
  },
  textBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  footerBackground: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20, // Add some spacing from the content
  },
  footerBox: {
    width: "90%",
    display: "flex",
    gap: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  footerSign: {
    width: "10%",
    gap: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  footerFrom: {
    width: "45%",
    height: 25,
    paddingHorizontal: 5,
    paddingVertical: 3,
    border: "1px solid black",
  },
  footerTotal: {
    width: "100px",
    display: "flex",
    flexDirection: "row",
    height: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
    border: "1px solid black",
  },
  footerSignature: {
    borderTop: "1px solid black",
    width: "100px",
    height: 35,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginTop: 15,
    alignContent: "center",
  },
  footerBoxTextHeader: {
    fontSize: 6,
    paddingBottom: 2,
    fontWeight: "bold",
    textAlign: "left",
  },
  footer: {
    position: "absolute",
    bottom: 10, // Position at the very bottom of the page
    right: 20,
    textAlign: "right",
    fontSize: 8,
    color: "gray",
  },
});

const TransferOutSlip = ({ data }) => {
  return (
    <Document>
      <Page size="A6" orientation="landscape" style={styles.page}>
        <View>
          {/* Header */}
          <View fixed style={styles.header}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text style={[styles.textBold]}>Internal Transfer</Text>
              <Text style={[styles.textBold, { fontWeight: "extrabold" }]}>
                No. {data?.id}
              </Text>
            </View>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
              <Text style={[styles.textBold]}>
                Date: {moment(data?.transactionDate).format("MMMM DD, YYYY")}
              </Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View fixed style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellQty,
                  { borderLeft: "1px solid black" },
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

            {data?.transferItems?.map((item, index) => (
              <View key={index} style={styles.tableRow} wrap={false}>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellQty,
                    { borderLeft: "1px solid black" },
                  ]}
                >
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
                  {item?.currentPrice}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellAmount]}>
                  {item?.currentPrice * item?.quantity}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerBackground}>
          <View style={styles.footerBox}>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <View style={styles.footerFrom}>
                <Text style={styles.footerBoxTextHeader}>From:</Text>
                <Text style={{ fontSize: 7 }}>{data?.createdBy}</Text>
              </View>
              <View style={styles.footerFrom}>
                <Text style={styles.footerBoxTextHeader}>Delivered by:</Text>
                <Text></Text>
              </View>
              <View style={styles.footerTotal}>
                <Text style={{ fontSize: 9 }}>Total: </Text>
                <Text style={{ fontSize: 9 }}>
                  {data?.transferItems?.reduce(
                    (total, item) =>
                      total + (item.currentPrice || 0) * (item.quantity || 0),
                    0
                  )}
                </Text>
              </View>
            </View>
            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
              <View style={styles.footerFrom}>
                <Text style={styles.footerBoxTextHeader}>To:</Text>
                <Text style={{ fontSize: 7 }}>{data?.transferTo}</Text>
              </View>
              <View style={styles.footerFrom}>
                <Text style={styles.footerBoxTextHeader}>Prepared By:</Text>
                <Text style={{ fontSize: 7 }}>{data?.createdBy}</Text>
              </View>
              <View style={styles.footerSignature}>
                <Text style={{ fontSize: 7, textAlign: "center" }}>
                  Received the above items in good condition
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          style={styles.footer}
          fixed
        />
      </Page>
    </Document>
  );
};

export default TransferOutSlip;
