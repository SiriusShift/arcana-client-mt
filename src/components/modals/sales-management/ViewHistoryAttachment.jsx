import { useEffect, useMemo, useRef, useState } from "react";
import CommonModal from "../../CommonModal";
import { Box, Divider, Input, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import NoData from "../../../assets/images/no-data.jpg";
// import useSnackbar from "../../../hooks/useSnackbar";
// import { handleCatchErrorMessage } from "../../../utils/CustomFunctions";
// import moment from "moment/moment";
// import useConfirm from "../../../hooks/useConfirm";

function ViewHistoriesAttachment({ image, title, ...props }) {
	const { onClose, open } = props;

	const [currentAttachment, setCurrentAttachment] = useState(null);


	// UseEffect
	useEffect(() => {
		if (!open) {
			setCurrentAttachment(null);
		} else if (open) {
			setCurrentAttachment(image);
		}
	}, [open]);

	return (
		<CommonModal width="666px" closeTopRight {...props}>
			<Box className="viewHistoryAttachments">
				<Box className="viewHistoryAttachments__title">
					<Typography fontWeight="700" fontSize="1.2rem">
						{title}
					</Typography>
				</Box>

				<Divider />

			
				<Tooltip
					followCursor
				>
					<span>
						<Box
							className="viewHistoryAttachments__canvas"
						>
							
							{currentAttachment && (
								<img
									src={
										currentAttachment
									}
									alt="attachment-preview"
									style={{
										borderRadius: "5px",
										maxWidth: "100%",
										maxHeight: "100%",
									}}
								/>
							) 
							// : (
							// 	<>
                            //         <img src={NoData} alt="no-data" style={{maxWidth: "50%", maxHeight: "100%"}}/>
							// 		<Typography fontWeight="500" color="#333333A8" fontSize="1.1rem">
							// 			No receipt found
							// 		</Typography>
							// 	</>
							// )
							}
						</Box>
					</span>
				</Tooltip>
			</Box>
		</CommonModal>
	);
}

export default ViewHistoriesAttachment;
