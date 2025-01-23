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
    paddingBottom: 100,
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
    paddingVertical: 10,
  },
  text: {
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid black",
    borderRight: "0px",
    borderBottom: "0px",
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
    height: 20,
  },
  tableCellUnit: {
    width: "10%",
    height: 20,
  },
  tableCellProductCode: {
    width: "20%",
    height: 20,
  },
  tableCellDescription: {
    width: "30%",
    height: 20,
  },
  tableCellUnitPrice: {
    width: "15%",
    height: 20,
  },
  tableCellAmount: {
    width: "15%",
    height: 20,
  },
  textBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  footerBackground: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between", // Adjust alignment
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
  },
  footerBox: {
    width: "84%", // Uncomment and adjust as necessary
    display: "flex",
    gap: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  footerSign: {
    width: "20%", // Adjust width
    gap: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  footerFrom: {
    width: "42%",
    height: 25,
    paddingHorizontal: 5,
    paddingVertical: 3,
    border: "1px solid black",
  },
  footerTotal: {
    width: "150px",
    height: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
    border: "1px solid black",
  },
  footerSignature: {
    borderTop: "1px solid black",
    width: "150px",
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
});

const TransferOutSlip = ({ data }) => {
  return (
    <Document>
      <Page size="A6" orientation="landscape" style={styles.page}>
        <View>
          <View fixed style={styles.header}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text style={[styles.textBold]}>Internal Transfer</Text>
              <Text style={[styles.textBold, { fontWeight: "extrabold" }]}>No. {data?.id}</Text>
            </View>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
              <Text style={[styles.textBold]}>
                Date: {moment(data?.transactionDate).format("MMMM DD, YYYY")}
              </Text>
            </View>
          </View>

          {/* Table with Transfer Items */}
          <View style={styles.table}>
            <View fixed style={styles.tableRow}>
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
              <View
                wrap
                key={index}
                style={[styles.tableRow, { break: "auto" }]}
              >
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
                <Text style={styles.footerBoxTextHeader}>From:</Text>
                <Text style={{ fontSize: 7 }}>{data?.createdBy}</Text>
              </View>
              <View style={styles.footerFrom}>
                <Text style={styles.footerBoxTextHeader}>Delivered by:</Text>
                <Text></Text>
              </View>
              <View style={styles.footerTotal}>
                <Text style={{ fontSize: 9 }}>Total</Text>
                <Text></Text>
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
                {/* <Text style={{ fontSize: 7, textAlign: "center" }}>
                in good condition
              </Text> */}
              </View>
            </View>
          </View>
          {/* <View styles={styles.footerSign}>
            <View style={styles.footerTotal}>
              <Text style={{ fontSize: 9 }}>Total</Text>
              <Text></Text>
            </View>
            <View style={styles.footerSignature}>
              <Text style={{ fontSize: 7, textAlign: "center" }}>
                Received the above items
              </Text>
              <Text style={{ fontSize: 7, textAlign: "center" }}>
                in good condition
              </Text>
            </View>
          </View> */}
        </View>
      </Page>
    </Document>
  );
};

export default TransferOutSlip;
