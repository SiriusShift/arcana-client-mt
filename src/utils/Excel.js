import ExcelJS from "exceljs";
import moment from "moment";

const ExportExcel = async (data, fileName) => {
  const date = new Date();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(fileName);

  const headers = Object.keys(data[0]);
  console.log(headers);
  sheet.columns = headers.map((col) => ({ key: col, width: 20 }));
  sheet.addRows([headers]);
  sheet.addRows(data);

  const headerRow = sheet.getRow(1);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" }, // Light gray
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

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
    `${fileName}_${moment(date).format("MM-DD-YYYY")}.xlsx`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default ExportExcel;
