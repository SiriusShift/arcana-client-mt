import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetTermsByClientIdQuery } from "../../../features/registration/api/registrationApi";
import { useGetAllTermDaysQuery } from "../../../features/setup/api/termDaysApi";
import { creditType } from "../../../utils/Constants";
import TermsAndConditionsTabSkeleton from "../../skeletons/TermsAndConditionsTabSkeleton";
import ComparedField from "./ComparedField";

const TERMS = { 1: "COD", 2: "1 up 1 down", 3: "Credit Limit" };
const MODE_OF_PAYMENTS = { 1: "Cash", 2: "Cheque", 3: "Online" };

const formatModeOfPayments = (ids) =>
  ids?.length
    ? [...ids].sort().map((id) => MODE_OF_PAYMENTS[id] ?? id).join(" & ")
    : null;

const formatCreditLimit = (amount) =>
  amount == null || amount === -1 ? null : `₱${Number(amount).toLocaleString()}`;

// From/To view of the requested terms changes, shown on edit client approval
function TermsComparison({ data }) {
  const { data: termDaysData } = useGetAllTermDaysQuery({ Status: true });

  const getTermDays = (id) => {
    const days = termDaysData?.termDays?.find((item) => item.id === id)?.days;
    return days == null || days === -1 ? null : `${days} Day/s`;
  };
  const getCreditType = (value) =>
    creditType.find((item) => item.value === value)?.label ?? null;

  const fields = [
    ["Mode of Payment", formatModeOfPayments(data?.modeOfPaymentIdsFrom), formatModeOfPayments(data?.modeOfPaymentIdsTo)],
    ["Terms", TERMS[data?.termsIdFrom] ?? null, TERMS[data?.termsIdTo] ?? null],
    ["Term Days", getTermDays(data?.termDaysIdFrom), getTermDays(data?.termDaysIdTo)],
    ["Credit Type", getCreditType(data?.creditTypeFrom), getCreditType(data?.creditTypeTo)],
    ["Credit Limit", formatCreditLimit(data?.creditLimitFrom), formatCreditLimit(data?.creditLimitTo)],
  ];

  return fields.map(([label, from, to]) => (
    <ComparedField
      key={label}
      section="termsAndConditions"
      label={label}
      isCompared
      from={from}
      to={to}
    />
  ));
}

function TermsAndConditionsTab() {
  const location = useLocation();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const isEditClient = location.pathname === "/approval/edit-client-approval";

  //RTK Query
  const { data, isLoading } = useGetTermsByClientIdQuery(
    { id: selectedRowData?.id },
    { skip: isEditClient }
  );

  console.log("data", data);

  return (
    <Box className="viewRegistrationModal__termsAndConditions">
      <Box className="viewRegistrationModal__termsAndConditions__header">
        <Typography className="viewRegistrationModal__termsAndConditions__header__label">
          Requested by:{" "}
        </Typography>
        <Typography>{selectedRowData?.requestor}</Typography>
      </Box>

      {isLoading ? (
        <TermsAndConditionsTabSkeleton />
      ) : (
        <Box className="viewRegistrationModal__termsAndConditions__content">
          <Typography className="viewRegistrationModal__termsAndConditions__content__title">
            Terms and Conditions
          </Typography>
          <Box className="viewRegistrationModal__termsAndConditions__content__fields">
            {isEditClient ? <TermsComparison data={selectedRowData} /> : <>
            {/* <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Freezer:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.freezer ? data.freezer : "N/A"}
              </Typography>
            </Box> */}

            {/* <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Type of Customer:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.typeOfCustomer}
              </Typography>
            </Box> */}

            {/* <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Direct Delivery:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.freezer ? "Yes" : "No"}
              </Typography>
            </Box> */}
            {/* 
            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Booking Coverage:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.bookingCoverage}
              </Typography>
            </Box> */}

            {/* <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Withholding Issuance:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.withholdingIssuance ? data?.withholdingIssuance : "N/A"}
              </Typography>
            </Box> */}

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Mode of Payment:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {/* {data?.modeofPayment} */}
                {data?.modeofPayments?.some((item) => item.id === 1) &&
                  "Cash"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 1) &&
                  data?.modeofPayments?.some((item) => item.id === 2) &&
                  "&"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 2) &&
                  "Cheque"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 2) &&
                  data?.modeofPayments?.some((item) => item.id === 3) &&
                  "&"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 3) &&
                  "Online"}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Terms:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {/* Credit Limit (P50,000) (45 Days) */}
                {data?.term}
                {(data?.termId === 3 && data?.creditLimit !== null && data?.creditLimit !== -1) &&
                  `(₱${data?.creditLimit?.toLocaleString()})`}
                {(data?.termId === 3 && data?.termDays !== -1 && data?.termDays !== null) && `(${data?.termDays} Day/s)`}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Discount:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.fixedDiscount?.discountPercentage
                  ? `Fixed (${(
                    data?.fixedDiscount?.discountPercentage * 100
                  ).toFixed(2)}%)`
                  : data?.variableDiscount
                    ? "Variable"
                    : "N/A"}
              </Typography>
            </Box>
            </>}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TermsAndConditionsTab;
