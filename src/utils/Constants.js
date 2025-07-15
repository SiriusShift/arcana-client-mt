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

export const reportNames = [
  {
    label: "CDO Reports",
    index: 0,
    value: "CDO-reports",
  },
  {
    label: "Sales Analyst Reports",
    index: 1,
    value: "sales-journal-reports",
  },
  {
    label: "AS Report",
    index: 2,
    value: "AS-reports",
  },
  // {
  // 	label: "GAS Report",
  // 	index: 3,
  // 	value: "GAS",
  // },
  {
    label: "Check In Reports",
    index: 3,
    value: "check-ins-reports",
  },
  {
    label: "Statement of Account Reports",
    index: 4,
    value: "SOA-reports",
  },
  {
    label: "Listing Fee Reports",
    index: 5,
    value: "listing-fee-reports",
  },
  {
    label: "Check In, First in - Last out Reports",
    index: 6,
    value: "check-in-filo-reports",
  },
  {
		label: "Void Transactions Report",
		index: 7,
		value: "void-transaction-reports"
	},
  {
    label: "Payment Reports",
    index: 8,
    value: "payment-reports",
  },
  {
    label: "MRP Rollback",
    index: 9,
    value: "MRPRollbackExport",
  },
  {
    label: "Inventory Movement",
    index: 10,
    value: "InventoryMovementExport"
  },
  {
    label: "Inventory History",
    index: 11,
    value: "TransactionHistoricalExport"
  },
  {
    label: "Receiving Reports",
    index: 12,
    value: "arcana-mo-reports",
  },
  {
    label: "Transfer Reports",
    index: 13,
    value: "GetTransferReportExport",
  },
  {
    label: "Freebie Reports",
    index: 14,
    value: "arcana-freebie-report",
  },
  {
    label: "Sampling Reports",
    index: 15,
    value: "arcana-sampling-report",
  },
  {
    label: "Return Reports",
    index: 16,
    value: "arcana-return-report",
  },
  {
    label: "Replace Reports",
    index: 17,
    value: "arcana-replace-report",
  },
    {
    label: "GL Cash Receipt",
    index: 18,
    value: "arcana-gl-cash-receipt"
  },
  {
    label: "GL Inventoriables",
    index: 19,
    value: "arcana-gl"
  },
  {
    label: "GL Sales GT",
    index: 20,
    value: "arcana-gt"
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
  {
    id: 3,
    name: "Return from Sampling",
    value: "ReturnSampling"
  }
]

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
  }
]

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
	{
	  label: "Sales Return",
	  value: "Sales Return",
	  uppercase: "SALES RETURN",
	  icon: "AccountBalance",
	},
	{
	  label: "Other Expenses",
	  value: "Others",
	  uppercase: "OTHER EXPENSES",
	  icon: "ReceiptLong",
	},
	{
	  label: "Others",
	  value: "Others With Remarks",
	  uppercase: "OTHERS",
	  icon: "MoreHoriz",
	},
  {
    label: "Rebate",
    value: "Rebate",
    uppercase: "REBATE",
    icon: "KeyboardReturn",
  }
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

