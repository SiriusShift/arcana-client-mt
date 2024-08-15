const salesSteps = {
  "/sales-management/sales-transaction": [
    {
      selector: ".commonPageLayout",
      content:
        "This is the Sales Transaction page. Here you can create sales orders.",
    },
    {
      selector: "[data-tour='select-client']",
      content: "Select the client for which you want to create the order.",
    },
    {
      selector: "[data-tour='search']",
      content:
        "You can search for a item code or item description using this search bar.",
    },
    {
      selector: "[data-tour='sales-options']",
      content:
        "Here you can enable quick add mode (which allows you to add 1 item quickly to the order) and select filters",
    },
    {
      selector: "[data-tour='select-item']",
      content:
        "If you have a client selected, you can select the item you want to add to the order.",
    },
    {
      selector: "[data-tour='orders']",
      content: "You can view the order details here.",
    },
    {
      selector: "[data-tour='order-item']",
      content:
        "Each item can have their quantity added or subtracted. You can also click the quantity to edit it. You can also swipe the item to the left to delete it from the order.",
    },
    {
      selector: "[data-tour='order-total']",
      content: "This is the total amount of the order.",
    },
    {
      selector: "[data-tour='clear-order']",
      content: "You can clear the order using this button.",
    },
    {
      selector: "[data-tour='complete-order']",
      content:
        "Once you are done, you can complete the order using this button.",
    },
    {
      selector: "[data-tour='transactions-list']",
      content:
        "Once an order is sucessful, it will be added to the transactions list. You can click this button to view the transactions list.",
    },
  ],
};

const inventorySteps = {
  "/inventory-management/inventory-mrp": [
    {
      selector: ".commonPageLayout",
      content:
        "This is the Inventory MRP page. Here you can view the inventory MRP details.",
    },
    {
      selector: "[data-tour='search']",
      content: "You can search for a specific product using this search bar.",
    },
  ],
  "/inventory-management/transfer-in": [
    {
      selector: ".commonPageLayout",
      content:
        "This is the Transfer In page. Here you can view the pending and received transfer in transactions.",
    },
    {
      selector: '[data-tour="page-header-tabs"]',
      content:
        "These are the tabs that you can use to navigate between pending and received transfer in.",
    },
    {
      selector: '[data-tour="actions"]',
      content:
        "These are the actions that you can perform on the transfer in transactions.",
    },
  ],
};

const tourSteps = {
  ...salesSteps,
  ...inventorySteps,
};

export default tourSteps;
