import { createBrowserRouter } from "react-router-dom";
import { TourProvider } from "../context/TourContext";
import Approval from "../pages/approval";
import ListingFeeApproval from "../pages/approval/ListingFeeApproval";
import OtherExpensesApproval from "../pages/approval/OtherExpensesApproval";
import RegistrationApproval from "../pages/approval/RegistrationApproval";
import SpecialDiscountApproval from "../pages/approval/SpecialDiscountApproval";
import CustomerManagement from "../pages/customer-management";
import BusinessType from "../pages/customer-management/BusinessType";
import ExpensesSetup from "../pages/customer-management/ExpensesSetup";
import OnlinePaymentPlatforms from "../pages/customer-management/OnlinePaymentPlatforms";
import TermDays from "../pages/customer-management/TermDays";
import VariableDiscount from "../pages/customer-management/VariableDiscount";
import CustomerRegistration from "../pages/customer-registration";
import ListingFee from "../pages/customer-registration/ListingFee";
import OtherExpenses from "../pages/customer-registration/OtherExpenses";
import Prospect from "../pages/customer-registration/prospecting";
import Registration from "../pages/customer-registration/Registration";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import PageNotFound from "../pages/PageNotFound";
import SalesManagement from "../pages/sales-management";
import AdvancePayment from "../pages/sales-management/AdvancePayment";
import Clearing from "../pages/sales-management/Clearing";
import PaymentTransaction from "../pages/sales-management/PaymentTransaction";
import SpecialDiscount from "../pages/sales-management/SpecialDiscount";
import Setup from "../pages/setup";
import MeatType from "../pages/setup/MeatType";
import PriceModeManagement from "../pages/setup/PriceModeManagement";
import PriceModeSetup from "../pages/setup/PriceModeSetup";
import ProductCategory from "../pages/setup/ProductCategory";
import Products from "../pages/setup/Products";
import ProductSubCategory from "../pages/setup/ProductSubCategory";
import UnitOfMeasurements from "../pages/setup/UnitOfMeasurements";
import UserManagement from "../pages/user-management";
import ApproverSettings from "../pages/user-management/ApproverSettings";
import DistributionType from "../pages/user-management/DistributionType";
import UserAccount from "../pages/user-management/UserAccount";
import UserRole from "../pages/user-management/UserRole";
import ProtectedRoutes from "./ProtectedRoutes";
// import Approver from "../pages/user-management/ApproverSettings";
import AddItemApproval from "../pages/approval/AddItemApproval";
import EditItemApproval from "../pages/approval/EditClientApproval";
import FreebieApproval from "../pages/approval/FreebieApproval";
import SamplingApproval from "../pages/approval/SamplingApproval";
import Attendance from "../pages/check-in";
import Cheque from "../pages/cheque";
import InventoryManagement from "../pages/inventory-management";
import Callsheet from "../pages/inventory-management/Callsheet";
import EndingInventoryForm from "../pages/inventory-management/EndingInventory/EndingInventoryForm";
import EndingInventory from "../pages/inventory-management/EndingInventory/index";
import ViewEndingInventoryForm from "../pages/inventory-management/EndingInventory/ViewEndingInventoryForm";
import Freebies from "../pages/inventory-management/Freebies";
import FreebiesForm from "../pages/inventory-management/Freebies/FreebiesForm";
import ViewFreebies from "../pages/inventory-management/Freebies/ViewFreebies";
import InventoryMRP from "../pages/inventory-management/InventoryMRP";
import MiscIssue from "../pages/inventory-management/MiscIssue/index";
import MiscIssueForm from "../pages/inventory-management/MiscIssue/MiscIssueForm";
import ViewMiscIssue from "../pages/inventory-management/MiscIssue/ViewMiscIssue";
import MiscReceipt from "../pages/inventory-management/MiscReceipt/index";
import MiscReceiptForm from "../pages/inventory-management/MiscReceipt/MiscReceiptForm";
import ViewMiscReceipt from "../pages/inventory-management/MiscReceipt/ViewMiscReceipt";
import ReasonSetup from "../pages/inventory-management/ReasonSetup/index";
import Receiving from "../pages/inventory-management/Receiving";
import ReceivingForm from "../pages/inventory-management/Receiving/ReceivingForm";
import ViewReceiving from "../pages/inventory-management/Receiving/ViewReceiving";
import Return from "../pages/inventory-management/Return";
import ReturnForm from "../pages/inventory-management/Return/ReturnForm";
import ViewReturn from "../pages/inventory-management/Return/ViewReturn";
import ReturnFromSampling from "../pages/inventory-management/ReturnFromSampling";
import ReturnSamplingForm from "../pages/inventory-management/ReturnFromSampling/ReturnSamplingForm";
import ViewReturnSamplingForm from "../pages/inventory-management/ReturnFromSampling/ViewReturnSamplingForm";
import Outright from "../pages/inventory-management/ReturnToDepot";
import ReturnToDepotForm from "../pages/inventory-management/ReturnToDepot/ReturnToDepotForm";
import ViewReturnToDepot from "../pages/inventory-management/ReturnToDepot/ViewReturnToDepot";
import Sampling from "../pages/inventory-management/Sampling";
import SamplingForm from "../pages/inventory-management/Sampling/SamplingForm";
import ViewSampling from "../pages/inventory-management/Sampling/ViewSampling";
import TransferIn from "../pages/inventory-management/TransferIn";
import TransferInForm from "../pages/inventory-management/TransferIn/TransferInForm";
import ViewTransferIn from "../pages/inventory-management/TransferIn/ViewTransferIn";
import TransferOut from "../pages/inventory-management/TransferOut";
import TransferOutForm from "../pages/inventory-management/TransferOut/TransferOutForm";
import ViewTransferOut from "../pages/inventory-management/TransferOut/ViewTransferOut";
import Redirect from "../pages/Redirect";
import Reports from "../pages/Reports";
import TransactionForm from "../pages/sales-management/sales-transaction/TransactionForm";
import TransactionsList from "../pages/sales-management/sales-transaction/TransactionsList";
import ViewTransaction from "../pages/sales-management/sales-transaction/ViewTransaction";
import ProductType from "../pages/setup/ProductType";
import Teritory from "../pages/user-management/Teritory";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/redirect", element: <Redirect /> },

  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/",
    element: (
      <TourProvider>
        <ProtectedRoutes />
      </TourProvider>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "check-in",
        element: <Attendance />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
        children: [
          {
            path: "user-account",
            element: <UserAccount />,
          },
          {
            path: "user-role",
            element: <UserRole />,
          },
          // {
          //   path: "approver",
          //   element: <Approver />,
          // },
          {
            path: "approver-settings",
            element: <ApproverSettings />,
          },


          // {
          //   path: "company",
          //   element: <Company />,
          // },
          // {
          //   path: "department",
          //   element: <Department />,
          // },
          // {
          //   path: "location",
          //   element: <Location />,
          // },
        ],
      },
      {
        path: "product-setup",
        element: <Setup />,
        children: [
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "product-category",
            element: <ProductCategory />,
          },
          {
            path: "product-sub-category",
            element: <ProductSubCategory />,
          },
          {
            path: "meat-type",
            element: <MeatType />,
          },
          {
            path: "product-type",
            element: <ProductType />,
          },
          {
            path: "uom",
            element: <UnitOfMeasurements />,
          },
          {
            path: "price-mode-setup",
            element: <PriceModeSetup />,
          },
          {
            path: "price-mode-management",
            element: <PriceModeManagement />,
          },
        ],
      },
      {
        path: "customer-management",
        element: <CustomerManagement />,
        children: [
          {
            path: "business-type",
            element: <BusinessType />,
          },
          {
            path: "distribution-type",
            element: <DistributionType />,
          },
          {
            path: "variable-discount",
            element: <VariableDiscount />,
          },
          {
            path: "term-days",
            element: <TermDays />,
          },
          {
            path: "expenses-setup",
            element: <ExpensesSetup />,
          },
          {
            path: "online-payment-platforms",
            element: <OnlinePaymentPlatforms />,
          },
          {
            path: "teritory",
            element: <Teritory />,
          },
        ],
      },
      {
        path: "customer-registration",
        element: (
          // <ThemeProvider theme={customerRegistrationTheme}>
          <CustomerRegistration />
          // </ThemeProvider>
        ),
        children: [
          {
            path: "prospect",
            element: <Prospect />,
          },
          {
            path: "registration",
            element: <Registration />,
          },
          {
            path: "listing-fee",
            element: <ListingFee />,
          },

          {
            path: "other-expenses",
            element: <OtherExpenses />,
          },
        ],
      },
      {
        path: "sales-management",
        element: <SalesManagement />,
        children: [
          {
            path: "sales-transaction",
            element: <TransactionsList />,
            children: [
              {
                path: ":id",
                element: <TransactionForm />
              },
              {
                path: "view/:id",
                element: <ViewTransaction />
              }
            ]
          },
          {
            path: "payment-transaction",
            element: <PaymentTransaction />,
          },
          {
            path: "special-discount",
            element: <SpecialDiscount />,
          },
          {
            path: "advance-payment",
            element: <AdvancePayment />,
          },
          {
            path: "remittance",
            element: <Clearing />,
          },
          {
            path: "freebies",
            element: <Freebies />,
            children: [
              {
                path: "freebies-form",
                element: <FreebiesForm />,
              },
              {
                path: ":id",
                element: <ViewFreebies />,
              },
            ],
          },
          {
            path: "sampling",
            element: <Sampling />,
            children: [
              {
                path: "sampling-form",
                element: <SamplingForm />,
              },
              {
                path: ":id",
                element: <ViewSampling />,
              },
            ],
          },
          {
            path: "return-sampling",
            element: <ReturnFromSampling />,
            children: [
              {
                path: "return-form",
                element: <ReturnSamplingForm />
              },
              {
                path: ":id",
                element: <ViewReturnSamplingForm />
              }
            ]
          },
        ],
      },
      {
        path: "inventory-management",
        element: <InventoryManagement />,
        children: [
          {
            path: "inventory-mrp",
            element: <InventoryMRP />,
          },
          {
            path: "ending-inventory",
            element: <EndingInventory />,
            children: [
              {
                path: "ending-inventory-form/:id",
                element: <EndingInventoryForm />,
              },
              {
                path: ":id",
                element: <ViewEndingInventoryForm />,
              }
            ]
          },
          {
            path: "receiving",
            element: <Receiving />,
            children: [
              {
                path: "receiving-form",
                element: <ReceivingForm />,
              },
              {
                path: ":id",
                element: <ViewReceiving />,
              },
            ],
          },
          {
            path: "return-to-depot",
            element: <Outright />,
            children: [
              {
                path: "return-form",
                element: <ReturnToDepotForm />,
              },
              {
                path: ":id",
                element: <ViewReturnToDepot />,
              },
            ],
          },
          {
            path: "miscellaneous-receipt",
            element: <MiscReceipt />,
            children: [
              {
                path: "miscellaneous-receipt-form",
                element: <MiscReceiptForm />,
              },
              {
                path: ":id",
                element: <ViewMiscReceipt />
              }
            ]
          },
          {
            path: "miscellaneous-issue",
            element: <MiscIssue />,
            children: [
              {
                path: "miscellaneous-issue-form",
                element: <MiscIssueForm />,
              },
              {
                path: ":id",
                element: <ViewMiscIssue />
              }
            ]
          },
          {
            path: "reason-setup",
            element: <ReasonSetup />
          },
          {
            path: "transfer-in",
            element: <TransferIn />,
            children: [
              {
                path: "transfer-in-form/:id",
                element: <TransferInForm />,
              },
              {
                path: ":id",
                element: <ViewTransferIn />,
              },
            ],
          },
          {
            path: "transfer-out",
            element: <TransferOut />,
            children: [
              {
                path: "transfer-out-form",
                element: <TransferOutForm />,
              },
              {
                path: ":id",
                element: <ViewTransferOut />,
              },
            ],
          },
          // {
          //   path: "pull-out",
          //   element: <PullOut />,
          // },

          {
            path: "return",
            element: <Return />,
            children: [
              {
                path: "return-form",
                element: <ReturnForm />,
              },
              {
                path: ":id",
                element: <ViewReturn />,
              },
            ],
          },
          {
            path: "callsheet",
            element: <Callsheet />,
          },
        ],
      },
      {
        path: "approval",
        element: <Approval />,
        children: [
          {
            path: "registration-approval",
            element: <RegistrationApproval />,
          },
          {
            path: "sp-discount-approval",
            element: <SpecialDiscountApproval />,
          },
          {
            path: "listing-fee-approval",
            element: <ListingFeeApproval />,
          },
          {
            path: "other-expenses-approval",
            element: <OtherExpensesApproval />,
          },
          {
            path: "freebie-approval",
            element: <FreebieApproval />
          },
          {
            path: "sampling-approval",
            element: <SamplingApproval />
          },
          {
            path: "item-approval",
            element: <AddItemApproval />
          },
          {
            path: "edit-client-approval",
            element: <EditItemApproval />
          }
        ],
      },
      {
        path: "reports",
        element: <Reports />
      },
      {
        path: "cheque",
        element: <Cheque />
      }
    ],
  },
]);
