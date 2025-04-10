import { createBrowserRouter } from "react-router-dom";
import { TourProvider } from "../context/TourContext";
import LoginPage from "../pages/LoginPage";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/user-management";
import Setup from "../pages/setup";
import CustomerManagement from "../pages/customer-management";
import CustomerRegistration from "../pages/customer-registration";
import Approval from "../pages/approval";
import UserAccount from "../pages/user-management/UserAccount";
import UserRole from "../pages/user-management/UserRole";
import Products from "../pages/setup/Products";
import ProductCategory from "../pages/setup/ProductCategory";
import ProductSubCategory from "../pages/setup/ProductSubCategory";
import MeatType from "../pages/setup/MeatType";
import UnitOfMeasurements from "../pages/setup/UnitOfMeasurements";
import TermDays from "../pages/customer-management/TermDays";
import Prospect from "../pages/customer-registration/prospecting";
import Registration from "../pages/customer-registration/Registration";
import ListingFee from "../pages/customer-registration/ListingFee";
import RegistrationApproval from "../pages/approval/RegistrationApproval";
import SpecialDiscountApproval from "../pages/approval/SpecialDiscountApproval";
import ListingFeeApproval from "../pages/approval/ListingFeeApproval";
import VariableDiscount from "../pages/customer-management/VariableDiscount";
import BusinessType from "../pages/customer-management/BusinessType";
import SalesManagement from "../pages/sales-management";
import SalesTransaction from "../pages/sales-management/SalesTransaction";
import PaymentTransaction from "../pages/sales-management/PaymentTransaction";
import SpecialDiscount from "../pages/sales-management/SpecialDiscount";
import AdvancePayment from "../pages/sales-management/AdvancePayment";
import Cluster from "../pages/user-management/Cluster";
import ExpensesSetup from "../pages/customer-management/ExpensesSetup";
import OtherExpenses from "../pages/customer-registration/OtherExpenses";
import OtherExpensesApproval from "../pages/approval/OtherExpensesApproval";
import PriceModeSetup from "../pages/setup/PriceModeSetup";
import PriceModeManagement from "../pages/setup/PriceModeManagement";
import PageNotFound from "../pages/PageNotFound";
import Clearing from "../pages/sales-management/Clearing";
import OnlinePaymentPlatforms from "../pages/customer-management/OnlinePaymentPlatforms";
import ApproverSettings from "../pages/user-management/ApproverSettings";
import InventoryManagement from "../pages/inventory-management";
import InventoryMRP from "../pages/inventory-management/InventoryMRP";
import Receiving from "../pages/inventory-management/Receiving";
import ReceivingForm from "../pages/inventory-management/Receiving/ReceivingForm";
import ViewReceiving from "../pages/inventory-management/Receiving/ViewReceiving";
import TransferIn from "../pages/inventory-management/TransferIn";
import TransferOut from "../pages/inventory-management/TransferOut";
import PullOut from "../pages/inventory-management/PullOut";
import Freebies from "../pages/inventory-management/Freebies";
import Sampling from "../pages/inventory-management/Sampling";
import Return from "../pages/inventory-management/Return";
import Callsheet from "../pages/inventory-management/Callsheet";
import TransferInForm from "../pages/inventory-management/TransferIn/TransferInForm";
import ViewTransferIn from "../pages/inventory-management/TransferIn/ViewTransferIn";
import TransferOutForm from "../pages/inventory-management/TransferOut/TransferOutForm";
import ViewTransferOut from "../pages/inventory-management/TransferOut/ViewTransferOut";
import FreebiesForm from "../pages/inventory-management/Freebies/FreebiesForm";
import ViewFreebies from "../pages/inventory-management/Freebies/ViewFreebies";
import SamplingForm from "../pages/inventory-management/Sampling/SamplingForm";
import ViewSampling from "../pages/inventory-management/Sampling/ViewSampling";
import ReturnForm from "../pages/inventory-management/Return/ReturnForm";
import ViewReturn from "../pages/inventory-management/Return/ViewReturn";
import Reports from "../pages/Reports";
import Cheque from "../pages/cheque";
import Attendance from "../pages/check-in";
import Outrite from "../pages/inventory-management/OuriteReturn";
import OuriteForm from "../pages/inventory-management/OuriteReturn/OuriteForm";
import ViewOutright from "../pages/inventory-management/OuriteReturn/ViewOutrightReturn";
import MiscIn from "../pages/inventory-management/MiscIn/index"
import MiscOut from "../pages/inventory-management/MiscOut/index"
import MiscInForm from "../pages/inventory-management/MiscIn/MiscInForm";
import MiscOutForm from "../pages/inventory-management/MiscOut/MiscOutForm";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
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
          {
            path: "cluster",
            element: <Cluster />,
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
            element: <SalesTransaction />,
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
            path: "ourite-return",
            element: <Outrite />,
            children: [
              {
                path: "ourite-return-form",
                element: <OuriteForm />,
              },
              {
                path: ":id",
                element: <ViewOutright />,
              },
            ],
          },
          {
            path: "miscellaneous-in",
            element: <MiscIn />,
            children: [
              {
                path: "miscellaneous-in-form",
                element: <MiscInForm />,
              }
            ]
          },
          {
            path: "miscellaneous-out",
            element: <MiscOut />,
            children: [
              {
                path: "miscellaneous-out-form",
                element: <MiscOutForm />,
              }
            ]
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
