import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { formatPhoneNumber } from "../../../utils/CustomFunctions";
import ComparedField from "./ComparedField";

const formatAddress = (address, suffix = "") => {
  if (!address) return "";
  // A null "To" value means unchanged, so fall back to the "From" value.
  const getPart = (key) =>
    suffix === "To"
      ? address[`${key}To`] ?? address[`${key}From`]
      : address[`${key}${suffix}`];

  const houseNumber = getPart("houseNumber");
  const streetName = getPart("streetName");
  const barangay = suffix ? getPart("barangay") : address.barangayName;
  const city = getPart("city");
  const province = getPart("province");

  return `${houseNumber ? `#${houseNumber} ` : ""}${streetName ? `${streetName} ` : ""
    }${barangay ? `${barangay}, ` : ""}${city ? `${city}, ` : ""}${province || ""}`;
};

function PersonalInfoTab() {
  const location = useLocation();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const { clientInformation, ...rowData } = selectedRowData ?? {};
  const data = { ...rowData, ...clientInformation };

  const isEditClient = location.pathname === "/approval/edit-client-approval";

  // On edit client approval, compare the From/To values; elsewhere always show the regular value.
  // The regular value is also shown when the request has no From/To for that field.
  const compareProps = (from, to, regular) =>
    isEditClient ? { from, to, isCompared: true, value: regular } : { value: regular };

  // Edit requests may not carry the current value, so leave it undefined there to fall back to NO CHANGES.
  const orNA = (value) => value || (isEditClient ? undefined : "N/A");
  const formatContactNumber = (value) => (value ? `+63 ${formatPhoneNumber(value)}` : value);

  return (
    <Box className="viewRegistrationModal__personalInfo">
      <Box className="viewRegistrationModal__personalInfo__header">
        <Typography className="viewRegistrationModal__personalInfo__header__label">
          Requested by:{" "}
        </Typography>
        <Typography>{data?.requestor}</Typography>
      </Box>

      <Box className="viewRegistrationModal__personalInfo__content">
        <Typography className="viewRegistrationModal__personalInfo__content__title">
          Customer&apos;s Information
        </Typography>
        <Box className="viewRegistrationModal__personalInfo__content__fields">
          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Customer Code:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {data?.id}
            </Typography>
          </Box>
          <ComparedField
            section="personalInfo"
            label="Business Name"
            {...compareProps(data?.businessNameFrom, data?.businessNameTo, data?.businessName)}
          />

          {/* <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Birthday:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {moment(data?.dateOfBirth)
                .format("MMMM D, YYYY")
                ?.toUpperCase()}
            </Typography>
          </Box> */}

          <ComparedField
            section="personalInfo"
            label="Contact Number"
            {...compareProps(
              formatContactNumber(data?.phoneNumberFrom),
              formatContactNumber(data?.phoneNumberTo),
              isEditClient
                ? formatContactNumber(data?.phoneNumber)
                : `+63 ${formatPhoneNumber(data?.phoneNumber) ?? ""}`
            )}
          />

          <ComparedField
            section="personalInfo"
            label="Email Address"
            {...compareProps(
              data?.emailAddressFrom,
              data?.emailAddressTo,
              orNA(data?.emailAddress)
            )}
          />

          <ComparedField
            section="personalInfo"
            label="Tin Number"
            {...compareProps(data?.tinNumberFrom, data?.tinNumberTo, orNA(data?.tinNumber))}
          />

          <ComparedField
            section="personalInfo"
            label="Business Address"
            {...compareProps(
              formatAddress(data?.businessAddress, "From"),
              formatAddress(data?.businessAddress, "To"),
              // No current address on edit requests, so the comparison falls back to NO CHANGES
              formatAddress(data?.businessAddress) || undefined
            )}
          />
          <ComparedField
            section="personalInfo"
            label="Branch Name"
            {...compareProps(data?.branchNameFrom, data?.branchNameTo, data?.branchName ?? data?.clientName)}
          />
          <ComparedField
            section="personalInfo"
            label="Delivery Address"
            {...compareProps(
              formatAddress(data?.deliveryAddress, "From"),
              formatAddress(data?.deliveryAddress, "To"),
              // No current address on edit requests, so the comparison falls back to NO CHANGES
              formatAddress(data?.deliveryAddress) || undefined
            )}
          />

          {/* {isRepresentativeRequirements && (
            <Box className="viewRegistrationModal__personalInfo__content__fields__itemWrapped">
              <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__label">
                Name of Authorized <br />
                Representative:
              </Typography>
              <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__value">
                {data?.authorizedRepresentative}
              </Typography>
            </Box>
          )} */}
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalInfoTab;
