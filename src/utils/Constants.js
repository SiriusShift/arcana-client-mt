export const coverageMapping = {
  F1: 1,
  F2: 2,
  F3: 3,
  F4: 4,
};

export const clusterOptions = [
  {
    label: "Cluster 1",
    value: 1,
    uppercase: "CLUSTER 1",
  },
  {
    label: "Cluster 2",
    value: 2,
    uppercase: "CLUSTER 2",
  },
  {
    label: "Cluster 3",
    value: 3,
    uppercase: "CLUSTER 3",
  },
  {
    label: "Cluster 4",
    value: 4,
    uppercase: "CLUSTER 4",
  },
];

export const marketingCluster = [
  {
    label: "Marketing - GT",
    value: 1,
    uppercase: "MARKETING - GT",
  },
  {
    label: "Marketing - MT",
    value: 2,
    uppercase: "MARKETING - MT",
  },
];

export const reportNames = [
  {
    name: "TDO Reports",
    index: 0,
    value: "TDO-reports",
  },
  {
    name: "Sales Analyst Reports",
    index: 1,
    value: "sales-journal-reports",
  },
  {
    name: "AS Report",
    index: 2,
    value: "AS-reports",
  },
  // {
  // 	name: "GAS Report",
  // 	index: 3,
  // 	value: "GAS",
  // },
  {
    name: "Check In Reports",
    index: 3,
    value: "check-ins-reports",
  },
  {
    name: "Statement of Account Reports",
    index: 4,
    value: "SOA-reports",
  },
  {
    name: "Listing Fee Reports",
    index: 5,
    value: "listing-fee-reports",
  },
  {
    name: "Check In, First in - Last out Reports",
    index: 6,
    value: "check-in-filo-reports",
  },
  {
    name: "Void Transactions Report",
    index: 7,
    value: "void-transaction-reports",
  },
  {
    name: "Payment Reports",
    index: 8,
    value: "payment-reports",
  },
  {
    name: "MRP Rollback",
    index: 9,
    value: "MRPRollbackExport",
  },
  {
    name: "Inventory Movement",
    index: 10,
    value: "InventoryMovementExport",
  },
  {
    name: "Inventory History",
    index: 11,
    value: "TransactionHistoricalExport",
  },
  {
    name: "Receiving Reports",
    index: 12,
    value: "arcana-mo-reports",
  },
  {
    name: "Transfer Reports",
    index: 13,
    value: "GetTransferReportExport",
  },
  {
    name: "Freebie Reports",
    index: 14,
    value: "arcana-freebie-report",
  },
  {
    name: "Sampling Reports",
    index: 15,
    value: "arcana-sampling-report",
  },
  {
    name: "Return Reports",
    index: 16,
    value: "arcana-return-report",
  },
  {
    name: "Replace Reports",
    index: 17,
    value: "arcana-replace-report",
  },
  {
    name: "Return Sampling Reports",
    index: 18,
    value: "GetReturnSamplingExport"
  },
  {
    name: "Inventory Adjustment Reports",
    index: 19,
    value: "GetInventoryAdjustmentExport"
  },
  {
    name: "Miscellaneous Receipt Reports",
    index: 20,
    value: "GetReceiptExport"
  },
  {
    name: "Miscellaneous Issue Reports",
    index: 21,
    value: "GetIssueExport"
  },
  {
    name: "Consolidated Reports",
    index: 22,
    value: "ConsolidatedReport/Export"
  },
  {
    name: "Gizmo Sales Reports",
    index: 23,
    value: "gizmo-sales-reports"
  },
  {
    name: "Depot Sales Reports",
    index: 24,
    value: "depot-sales-reports"
  },
  {
    name: "GL Cash Receipt",
    index: 25,
    value: "arcana-gl-cash-receipt",
  },
  {
    name: "GL Inventoriables",
    index: 26,
    value: "arcana-gl",
  },
  {
    name: "GL Sales GT",
    index: 27,
    value: "arcana-gt",
  },
];

export const returnToDepot = [
  {
    id: 1,
    name: "Outright Return",
    value: "Outright",
  },
  {
    id: 2,
    name: "Pull Out",
    value: "Pullout",
  },
];

export const transferTypes = [
  {
    id: 1,
    name: "Outright Return",
    value: "Outright",
  },
  {
    id: 2,
    name: "Pull Out",
    value: "Pullout",
  },
  {
    id: 3,
    name: "Transfer In",
    value: "In",
  },
  {
    id: 4,
    name: "Transfer Out",
    value: "Out",
  },
];

export const regions = [
  {
    label: "REGION I",
    value: "010000000",
    name: "Ilocos Region",
  },
  {
    label: "REGION II",
    value: "020000000",
    name: "Cagayan Valley Region",
  },
  {
    label: "REGION III",
    value: "030000000",
    name: "Central Luzon Region",
  },
  {
    label: "REGION IV-A",
    value: "040000000",
    name: "CALABARZON Region",
  },
  {
    label: "Mimaropa",
    value: "170000000",
    name: "MIMAROPA Region",
  },
  {
    label: "REGION V",
    value: "050000000",
    name: "Bicol Region",
  },
  {
    label: "CAR",
    value: "140000000",
    name: "CAR Region",
  },
  {
    label: "NCR",
    value: "130000000",
    name: "NCR Region",
  },
];

export const paymentTypes = [
  {
    label: "Cheque",
    value: "Cheque",
    uppercase: "CHEQUE",
    icon: "ReceiptLong",
  },
  {
    label: "Cash",
    value: "Cash",
    uppercase: "CASH",
    icon: "AttachMoney",
  },
  {
    label: "Online",
    value: "Online",
    uppercase: "ONLINE",
    icon: "CreditCard",
  },
  {
    label: "Listing Fee",
    value: "Listing Fee",
    uppercase: "LISTING FEE",
    icon: "Assignment",
  },
  // {
  //   label: "Offset",
  //   value: "Offset",
  //   uppercase: "OFFSET",
  //   icon: "Undo",
  // },
  {
    label: "Advance Payment",
    value: "Advance Payment",
    uppercase: "ADVANCE PAYMENT",
    icon: "FastForward",
  },
  {
    label: "Withholding",
    value: "Withholding",
    uppercase: "WITHHOLDING",
    icon: "AccountBalance",
  },
  // {
  //   label: "Sales Return",
  //   value: "Sales Return",
  //   uppercase: "SALES RETURN",
  //   icon: "AccountBalance",
  // },
  {
    label: "Other Expenses",
    value: "Others",
    uppercase: "OTHER EXPENSES",
    icon: "ReceiptLong",
  },
  // {
  //   label: "Others",
  //   value: "Others With Remarks",
  //   uppercase: "OTHERS",
  //   icon: "MoreHoriz",
  // },
  {
    label: "Rebate",
    value: "Rebate",
    uppercase: "REBATE",
    icon: "KeyboardReturn",
  },
];

export const paymentTypesAdvPayment = [
  {
    label: "Cheque",
    value: "Cheque",
  },
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Online",
    value: "Online",
  },
];

export const transferOutTypes = [
  {
    label: "Transfer",
    value: "Transfer",
  },
  {
    label: "Pull Out",
    value: "Pull Out",
  },
];


export const creditType = [
  {
    label: "Regular",
    value: 1,
  },
  {
    label: "Credit - Days",
    value: 2,
  },
  {
    label: "Credit - Amount",
    value: 3,
  },
];

export const invoiceTypes = [
  {
    label: "Sales",
    value: "SI",
  },
  {
    label: "Charge",
    value: "CI",
  },
];

export const userTypes = ["TDO", "Marketing"];
