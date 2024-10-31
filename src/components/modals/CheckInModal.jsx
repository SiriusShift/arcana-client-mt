import { useSelector } from "react-redux";
import CommonModal from "../CommonModal";
import NoImage from "../../assets/images/NoImage.png";
import { Typography } from "@mui/material";

function checkInModal({ ...otherProps }) {
  const { onClose } = otherProps;
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <>
      <CommonModal {...otherProps} closeTopRight>
        <div className="checkInModal">
          <Typography className="checkInModal__title">Check In Image</Typography>
          <Typography>Remarks: {selectedRowData?.remarks}</Typography>
          <hr />
          {selectedRowData?.image ? (
            <img src={selectedRowData?.image} className="checkInModal__image" alt="" />) : NoImage}
        </div>
      </CommonModal>
    </>
  );
}

export default checkInModal;
