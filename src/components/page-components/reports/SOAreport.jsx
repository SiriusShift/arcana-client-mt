import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Header from "../../../assets/images/RDF_Header.png";
import Footer from "../../../assets/images/RDF_Footer.png";
import moment from "moment";

const date = new Date();

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    lineHeight: 1.4,
    paddingBottom: 50,
    minHeight: "100%", // Ensure the page height is at least full
    position: "relative", // Allow absolute positioning of footer
  },
  body: {
    paddingHorizontal: 40,
    paddingBottom: 50, // Adjust the bottom padding to make room for the footer
    flex: 1, // Allow the body to take up remaining space
  },
  footerBackground: {
    position: "absolute",
    bottom: 0, // Keep the footer anchored to the bottom of the page
    left: 0,
    right: 0,
    zIndex: -1, // Ensure the footer stays behind the content
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, // Adds some space between rows if needed
  },
  column: {
    width: "48%", // Each column takes up 50% of the width (with some margin for spacing)
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
  },
  tableGrandTotal: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    fontSize: 7,
  },
  // Adjusted column widths
  tableCellDeliveryDate: {
    width: "13%", // Wider Delivery Date column
  },
  tableCellInvoiceNo: {
    width: "13%", // Wider Invoice No. column
  },
  tableCellAging: {
    width: "9%",
  },
  tableCellCharges: {
    width: "13%", // Wider Charges column
  },
  tableCellTax: {
    width: "11%",
  },
  tableCellPayment: {
    width: "13%", // Wider Payment column
  },
  tableCellRemainingBalance: {
    width: "15%", // Wider Remaining Balance column
  },
  tableCellRemarks: {
    width: "13%", // Wider Remarks column
  },
  // No border for the last cell in each row
  tableCellLast: {
    borderRight: "none", // Remove right border for the last cell
  },
  text: {
    fontSize: 8,
  },
  textBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
});

const MyDocument = ({client, dateTo}) => {
  return (
    <Document>
      <Page size="LETTER" wrap style={styles.page}>
        {/* Fixed Header */}
        <View
        fixed
          // style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}
        >
          <Image src={Header} />
        </View>
        {/* Main content */}\
        <View style={styles.body}>
          <Text style={[{ textAlign: "right" }, styles.text]}>
            #FIN-AS-REC-24-
          </Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={[styles.textBold]}>Accounting Department</Text>
            </View>
            <View style={styles.column}>
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "normal",
                  textAlign: "right",
                }}
              >
                {moment(date).format("MMMM DD, YYYY") }
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={[{ textAlign: "right" }, styles.textBold]}>
                RE: Advise to Settle Your Account
              </Text>
              <Text style={[{ textAlign: "right" }, styles.textBold]}>
                Total Outstanding Balance – P
              </Text>
            </View>
            <View
              style={{
                width: "48%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <Text style={[styles.textBold]}>
                {client?.grandTotalRemainingBalance }
              </Text>
            </View>
          </View>
          <Text style={{ textAlign: "left", fontWeight: "bold", fontSize: 8 }}>
            Dear Sir/Ma'am,
          </Text>
          <Text
            style={{
              textAlign: "left",
              fontWeight: "bold",
              fontSize: 8,
              marginTop: 10,
            }}
          >
            {`This is a reminder regarding your unpaid invoices as of ${moment(
              dateTo
            ).format("MMMM DD, YYYY") }. The details of which are as follows:`}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellDeliveryDate,
                ]}
              >
                Delivery Date
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellInvoiceNo,
                ]}
              >
                Invoice No.
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellAging,
                ]}
              >
                Aging
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellCharges,
                ]}
              >
                Charges
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellTax,
                ]}
              >
                Tax Withheld
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellPayment,
                ]}
              >
                Payment
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellRemainingBalance,
                ]}
              >
                Remaining Balance
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellRemarks,
                ]}
              >
                Remarks
              </Text>
            </View>

            {/* Iterate through the invoices */}
            {client?.pendingSoa?.map((invoice, index) => (
              <View key={index} style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellDeliveryDate,
                  ]}
                >
                  {moment(invoice?.deliveryDate).format("MM/DD/YYYY") }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellInvoiceNo,
                  ]}
                >
                  {invoice?.invoiceNo }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellAging,
                  ]}
                >
                  {invoice?.aging }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellCharges,
                  ]}
                >
                  {invoice?.charges }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellTax,
                  ]}
                >
                  {invoice?.taxWithheld }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellPayment,
                  ]}
                >
                  {invoice?.payment }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellRemainingBalance,
                  ]}
                >
                  {invoice?.remainingBalance }
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableHeader,
                    styles.tableCellRemarks,
                  ]}
                >
                  {invoice?.remarks }
                </Text>
              </View>
            ))}

            {/* Grand Total Row */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellDeliveryDate,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                Grand Total
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellInvoiceNo,
                ]}
              ></Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellAging,
                ]}
              ></Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellCharges,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                {client?.grandTotalCharges }
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellTax,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                {client?.grandTotalTaxWithheld }
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellPayment,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                {client?.grandTotalPayment }
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellRemainingBalance,
                  { fontFamily: "Helvetica-Bold" },
                ]}
              >
                {client?.grandTotalRemainingBalance }
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableHeader,
                  styles.tableCellRemarks,
                ]}
              ></Text>
            </View>
          </View>

          <Text
            style={[
              styles.textBold,
              {
                marginTop: 10,
              },
            ]}
          >
            Kindly send your payment within 5 days upon receipt hereof, Should
            you issue paycheck payments they must be made payable
          </Text>
          <Text style={[styles.textBold]}>
            to RDF FEED, LIVESTOCK & FOODS, INC. If payment has been made,
            please disregard this letter.
          </Text>
          <Text
            style={[
              styles.text,
              {
                marginTop: 10,
              },
            ]}
          >
            Always secure your acknowledgement receipts upon payment from our
            authorized representatives. Should you have any questions regarding
          </Text>
          <Text style={[styles.text]}>
            this matter, please feel free to contact us at Mobile. No.
            0998-988-8905.
          </Text>
          <Text
            style={[
              styles.text,
              {
                marginTop: 10,
              },
            ]}
          >
            Thank you for your recent business and attention to this matter. We
            look forward to a continued business relationship.
          </Text>
          <Text
            style={[
              styles.text,
              {
                marginTop: 10,
              },
            ]}
          >
            Sincerely,
          </Text>
          <View style={{ pageBreakBefore: "always", paddingTop: 10 }}>
            <Text style={[styles.text, { marginTop: 10 }]}>Prepared By:</Text>
            <Text
              style={[
                styles.text,
                {
                  marginTop: 10,
                },
              ]}
            >
              Roger Sunga
            </Text>
            <Text style={[styles.text]}>Accounting Associate</Text>
          </View>
          <View style={{ pageBreakBefore: "always", paddingTop: 10 }}>
            <Text style={[styles.text, { marginTop: 10 }]}>Noted By:</Text>
            <View
              style={{
                width: "100%",
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <View style={{ width: "48%", textAlign: "left" }}>
                <Text style={styles.text}>Reden Cunanan</Text>
                <Text style={styles.text}>Accounting Services Supervisor</Text>
              </View>
              <View style={{ width: "48%", textAlign: "left" }}>
                <Text style={styles.text}>Marlon Aguas</Text>
                <Text style={styles.text}>Financial Accounting Manager</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Footer */}
        <View fixed style={styles.footerBackground}>
          <Image src={Footer} />
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
