import ExcelJS from "exceljs";
import moment from "moment";

const ExportExcel = async (dateTo, client) => {
  const date = new Date();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`SOA Report`, {
    pageSetup: {
      paperSize: 1, // A4 paper size
      orientation: "portrait",
    },
  });

  // Set margins correctly
  sheet.pageSetup.margins = {
    left: 0.05,       // Left margin set to 0.1 inches
    right: 0.05,      // Right margin set to 0.1 inches
    top: 0.75,        // Top margin adjusted to 1.9 inches
    bottom: 0.1,     // Bottom margin set to 0.3 inches
    header: 0.3,     // Header space set to 0.8 inches
    footer: 0.3,     // Footer space set to 0.8 inches
  };

  sheet.pageSetup.scale = 79

  sheet.pageSetup.printArea = "A1:J59"; // Set the print area

  // Set columns width
  sheet.columns = [
    { key: 'A', width: 10 },  // Column A width set to 10
    { key: 'B', width: 15 },  // Column B width set to 20
    { key: 'C', width: 15 },  // Column C width set to 15
    { key: 'D', width: 10},
    { key: 'E', width: 15},
    { key: 'F', width: 10},
    { key: 'G', width: 15},
    { key: 'H', width: 15},
    { key: 'I', width: 15},
    { key: 'J', width: 10},
  ];

  // Add data to worksheet
  sheet.getCell("I3").value = "#FIN-AS-REC-24-";
  sheet.getCell("I3").alignment = { horizontal: "right" };
  sheet.getCell("I3").font = { fontSize: 9 };

  sheet.getCell("B4").value = "Accounting Department";
  sheet.getCell("B4").font = { bold: true, fontSize: 9 };

  sheet.getCell("I4").value = moment(date).format("MMMM DD, YYYY");
  sheet.getCell("I4").alignment = { horizontal: "right" };
  sheet.getCell("I4").font = { fontSize: 9 };

  sheet.getCell("E6").value = "RE: Advise to Settle your Account";
  sheet.getCell("E6").font = { bold: true, fontSize: 9 };
  sheet.getCell("E6").alignment = { horizontal: "right" };

  sheet.getCell("E7").value = "Total Outstanding Balance - P";
  sheet.getCell("E7").font = { bold: true, fontSize: 9 };
  sheet.getCell("E7").alignment = { horizontal: "right" };

  sheet.getCell("F7").value = client?.grandTotalRemainingBalance;
  sheet.getCell("F7").font = { bold: true, fontSize: 9 };
  sheet.getCell("F7").alignment = { horizontal: "right" };

  sheet.getCell("B9").value = "Dear Sir/Ma'am,";
  sheet.getCell("B9").font = {fontSize: 9};

  sheet.getCell("B11").value = `This is a reminder regarding your unpaid invoices as of ${moment(dateTo).format("MM-DD-YYYY")}. The details of which are as follows:`;
  sheet.getCell("B11").font = {fontSize: 9};

  // Write buffer and create a downloadable file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `SOAReport_${client?.businessName}_${client?.fullName}_${moment(date).format("MM-DD-YYYY")}.xlsx`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default ExportExcel;
