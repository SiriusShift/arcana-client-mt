import { Box, Typography } from "@mui/material";
import moment from "moment";
import { useSelector } from "react-redux";
import { formatPhoneNumber } from "../../../utils/CustomFunctions";

function PersonalInfoTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const isRepresentativeRequirements = selectedRowData?.attachments?.length > 4;

  return (
    <Box className="viewRegistrationModal__personalInfo">
      <Box className="viewRegistrationModal__personalInfo__header">
        <Typography className="viewRegistrationModal__personalInfo__header__label">
          Requested by:{" "}
        </Typography>
        <Typography>{selectedRowData?.requestor}</Typography>
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
              {selectedRowData?.id}
            </Typography>
          </Box>
          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Business Name:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.businessName}
            </Typography>
          </Box>

          {/* <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Birthday:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {moment(selectedRowData?.dateOfBirth)
                .format("MMMM D, YYYY")
                ?.toUpperCase()}
            </Typography>
          </Box> */}

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Contact Number:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              +63 {formatPhoneNumber(selectedRowData?.phoneNumber)}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Email Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.emailAddress || "N/A"}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Tin Number:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.tinNumber || "N/A"}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Business Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {`${
                selectedRowData?.businessAddress?.houseNumber
                  ? `#${selectedRowData.businessAddress.houseNumber} `
                  : ""
              }${
                selectedRowData?.businessAddress?.streetName
                  ? `${selectedRowData.businessAddress.streetName} `
                  : ""
              }${
                selectedRowData?.businessAddress?.barangayName
                  ? `${selectedRowData.businessAddress.barangayName}, `
                  : ""
              }${
                selectedRowData?.businessAddress?.city
                  ? `${selectedRowData.businessAddress.city}, `
                  : ""
              }${
                selectedRowData?.businessAddress?.province
                  ? `${selectedRowData.businessAddress.province}`
                  : ""
              }`}
              {/* #{selectedRowData?.businessAddress?.houseNumber}{" "}
              {selectedRowData?.businessAddress?.streetName}{" "}
              {selectedRowData?.businessAddress?.barangayName},{" "}
              {selectedRowData?.businessAddress?.city},{" "}
              {selectedRowData?.businessAddress?.province} */}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Branch Name:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {selectedRowData?.branchName}
            </Typography>
          </Box>

          <Box className="viewRegistrationModal__personalInfo__content__fields__item">
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__label">
              Delivery Address:
            </Typography>
            <Typography className="viewRegistrationModal__personalInfo__content__fields__item__value">
              {`${
                selectedRowData?.deliveryAddress?.houseNumber
                  ? `#${selectedRowData.deliveryAddress.houseNumber} `
                  : ""
              }${
                selectedRowData?.deliveryAddress?.streetName
                  ? `${selectedRowData.deliveryAddress.streetName} `
                  : ""
              }${
                selectedRowData?.deliveryAddress?.barangayName
                  ? `${selectedRowData.deliveryAddress.barangayName}, `
                  : ""
              }${
                selectedRowData?.deliveryAddress?.city
                  ? `${selectedRowData.deliveryAddress.city}, `
                  : ""
              }${
                selectedRowData?.deliveryAddress?.province
                  ? `${selectedRowData.deliveryAddress.province}`
                  : ""
              }`}
              {/* #{selectedRowData?.businessAddress?.houseNumber}{" "}
              {selectedRowData?.businessAddress?.streetName}{" "}
              {selectedRowData?.businessAddress?.barangayName},{" "}
              {selectedRowData?.businessAddress?.city},{" "}
              {selectedRowData?.businessAddress?.province} */}
            </Typography>
          </Box>
         
          {/* {isRepresentativeRequirements && (
            <Box className="viewRegistrationModal__personalInfo__content__fields__itemWrapped">
              <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__label">
                Name of Authorized <br />
                Representative:
              </Typography>
              <Typography className="viewRegistrationModal__personalInfo__content__fields__itemWrapped__value">
                {selectedRowData?.authorizedRepresentative}
              </Typography>
            </Box>
          )} */}
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalInfoTab;
