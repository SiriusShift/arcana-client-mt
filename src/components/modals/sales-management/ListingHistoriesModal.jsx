import { useSelector } from "react-redux";
import CommonModal from "../../CommonModal";
import { useEffect } from "react";
import { useLazyGetListingFeeHistoryByClientIdQuery } from "../../../features/listing-fee/api/listingFeeApi";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import noData from "../../../assets/images/noRecordsFound.svg";
import moment from "moment";
import { formatPesoAmount } from "../../../utils/CustomFunctions";

const ListingHistoriesModal = ({ ...otherProps }) => {
  const { open } = otherProps;

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [triggerHistories, { data, isFetching }] =
    useLazyGetListingFeeHistoryByClientIdQuery();

  console;

  useEffect(() => {
    if (open) {
      triggerHistories(
        {
          clientId: selectedRowData?.clientId,
        },
        { preferCacheValue: true }
      );
    }
  }, [open, triggerHistories, selectedRowData]);

  return (
    <>
      <CommonModal {...otherProps} closeTopRight height="70dvh">
        <Box className="listingHistoriesModal">
          <Typography className="listingHistoriesModal__title">
            Listing Fee History
          </Typography>
          {data?.listingHistory?.length != 0 ? (
            <Box className="listingHistoriesModal__body">
              <Stepper
                orientation="vertical"
                sx={{
                  "& .MuiStepConnector-root": {
                    flex: "none",
                    WebkitFlex: "none",
                  },
                }}
              >
                {data?.listingHistory?.map((item, index) => (
                  <Step key={index} active expanded>
                    <StepLabel
                      sx={{
                        "& .MuiStepIcon-root": {
                          color: item?.paymentType === "Add Balance" ? "green" : "", // Change color based on step index
                        },
                      }}
                      StepIconProps={{ icon: "" }}
                    >
                      <span style={{ fontWeight: "600", marginRight: "5px" }}>
                        {moment(item.createdDate).format("MMMM D, YYYY")}
                      </span>

                      <span>{moment(item.createdDate).format("hh:mm a")}</span>
                    </StepLabel>
                    <StepContent>
                      <Box className="listingHistoriesModal__body__stepContent">
                        <Box className="listingHistoriesModal__body__stepContent__total">
                          <Typography className="listingHistoriesModal__body__stepContent__total__label">
                            Payment Type:
                          </Typography>

                          <Typography className="listingHistoriesModal__body__stepContent__total__value">
                            {formatPesoAmount(item.paymentType)}
                          </Typography>
                        </Box>
                        <Box className="listingHistoriesModal__body__stepContent__total">
                          <Typography className="listingHistoriesModal__body__stepContent__total__label">
                            Amount:
                          </Typography>

                          <Typography className="listingHistoriesModal__body__stepContent__total__value">
                            {formatPesoAmount(item.amount)}
                          </Typography>
                        </Box>
                        <Box className="listingHistoriesModal__body__stepContent__total">
                          <Typography className="listingHistoriesModal__body__stepContent__total__label">
                            Transacted by:
                          </Typography>

                          <Typography className="listingHistoriesModal__body__stepContent__total__value">
                            {formatPesoAmount(item.transactedBy)}
                          </Typography>
                        </Box>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          ) : (
            <Box className="paymentHistoriesBySalesInvoiceModal__noData">
              <img
                src={noData}
                alt="No Data Found"
                className="paymentHistoriesBySalesInvoiceModal__noData__image"
              />
            </Box>
          )}
        </Box>
      </CommonModal>
    </>
  );
};

export default ListingHistoriesModal;
