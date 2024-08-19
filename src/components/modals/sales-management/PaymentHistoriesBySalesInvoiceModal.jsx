import {
	Box,
	Chip,
	Collapse,
	IconButton,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import moment from "moment";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { paymentTypes } from "../../../utils/Constants";
import { getIconElement } from "../../GetIconElement";
import { formatPesoAmount } from "../../../utils/CustomFunctions";
import { useLazyGetAllPaymentHistoriesQuery } from "../../../features/sales-management/api/paymentTransactionApi";
import { useSelector } from "react-redux";

function PaymentHistoriesBySalesInvoiceModal({ ...props }) {
	const { open } = props;

	const selectedRowData = useSelector((state) => state.selectedRow.value);

	const [expandedPaymentType, setExpandedPaymentType] = useState({});

	const [
		triggerHistories,
		{ data: paymentHistoriesData, isFetching: isPaymentHistoriesFetching },
	] = useLazyGetAllPaymentHistoriesQuery();

	//Functions
	const getPaymentTypeIcon = (paymentType) => {
		return getIconElement(
			paymentTypes.find((type) => type.value === paymentType)?.icon,
			"gray",
			"1.3rem"
		);
	};

	const handlePaymentDropdown = (itemId, newState) => {
		setExpandedPaymentType((prevStates) => {
			// Create a new object to hold the updated states
			const updatedStates = {};

			// Loop through previous states to set all to false except the clicked one
			Object.keys(prevStates).forEach((key) => {
				updatedStates[key] = key == itemId ? newState : false;
			});

			return updatedStates;
		});
	};

	//UseEffect
	useEffect(() => {
		if (open) {
			const initialStates = {};
			paymentHistoriesData?.transactions?.forEach((item) => {
				// Assuming item.id is unique for each item
				initialStates[item.paymentRecordId] = false; // Assuming initially all dropdowns are closed
			});
			setExpandedPaymentType(initialStates);
		} else {
			setExpandedPaymentType({});
		}
	}, [paymentHistoriesData, open]);

	console.log(expandedPaymentType);

	useEffect(() => {
		if (open) {
			triggerHistories(
				{
					Status: true,
					PageSize: 1000,
					PageNumber: 1,
					TransactionId: selectedRowData?.transactionNo,
				},
				{ preferCacheValue: true }
			);
		}
	}, [open, triggerHistories, selectedRowData]);

	console.log(paymentHistoriesData);

	return (
		<CommonModal {...props} closeTopRight height="70dvh">
			<Box className="paymentHistoriesBySalesInvoiceModal">
				<Typography className="paymentHistoriesBySalesInvoiceModal__title">
					Payment Histories
				</Typography>

				<Box className="paymentHistoriesBySalesInvoiceModal__body">
					<Stepper
						orientation="vertical"
						sx={{
							"& .MuiStepConnector-root": {
								flex: "none",
								WebkitFlex: "none",
							},
						}}
					>
						{paymentHistoriesData?.transactions?.map((paymentRecord) => (
							<Step key={paymentRecord.paymentRecordId} active expanded>
								<StepLabel StepIconProps={{ icon: "" }}>
									<span style={{ fontWeight: "600", marginRight: "5px" }}>
										{moment(paymentRecord.createdAt).format("MMMM D, YYYY")}
									</span>

									<span>{moment(paymentRecord.createdAt).format("hh:mm a")}</span>
								</StepLabel>

								<StepContent>
									<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent">
										<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__total">
											<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__total__label">
												Total:
											</Typography>

											<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__total__value">
												{formatPesoAmount(paymentRecord.totalPayment)}
											</Typography>
										</Box>

										<Box
											className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentTypes"
											onClick={() =>
												handlePaymentDropdown(
													paymentRecord.paymentRecordId,
													!expandedPaymentType[paymentRecord.paymentRecordId]
												)
											}
										>
											<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentTypes__label">
												Payment Type(s):
											</Typography>

											<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentTypes__chips">
												{paymentRecord.paymentTransactions.map(
													(paymentTransaction, index) => (
														<Chip
															key={index}
															label={paymentTransaction.paymentMethod}
															variant="outlined"
															color="primary"
															icon={getPaymentTypeIcon(paymentTransaction.paymentMethod)}
														/>
													)
												)}
											</Box>

											<IconButton>
												{expandedPaymentType[paymentRecord.paymentRecordId] ? (
													<KeyboardArrowUp color="secondary" />
												) : (
													<KeyboardArrowDown color="secondary" />
												)}
											</IconButton>
										</Box>

										<Collapse in={expandedPaymentType[paymentRecord.paymentRecordId]}>
											<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed">
												{paymentRecord.paymentTransactions.map(
													(paymentTransaction, index) => (
														<Box
															key={index}
															className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item"
														>
															<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__title">
																<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__title__number">
																	{index + 1}.
																</Typography>

																<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__title__label">
																	{paymentTransaction.paymentMethod}
																</Typography>

																{getPaymentTypeIcon(paymentTransaction.paymentMethod)}
															</Box>

															<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content">
																<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																	<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																		Amount:
																	</Typography>

																	<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																		{formatPesoAmount(paymentTransaction.paymentAmount)}
																	</Typography>
																</Box>

																{/* Cheque Fields */}
																{paymentTransaction.paymentMethod === "Cheque" && (
																	<>
																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Payee:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.payee}
																			</Typography>
																		</Box>

																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Cheque Date:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{moment(paymentTransaction.chequeDate).format(
																					"MMM D, YYYY"
																				)}
																			</Typography>
																		</Box>

																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Bank:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.bankName}
																			</Typography>
																		</Box>

																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Cheque Number:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.chequeNo}
																			</Typography>
																		</Box>

																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Date Received:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{moment(paymentTransaction.dateReceived).format(
																					"MMM D, YYYY"
																				)}
																			</Typography>
																		</Box>
																	</>
																)}

																{/* Online Fields */}
																{paymentTransaction.paymentMethod === "Online" && (
																	<>
																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Account Name:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.accountName}
																			</Typography>
																		</Box>

																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Account Number:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.accountNo}
																			</Typography>
																		</Box>

																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Reference Number:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.transactionId}
																			</Typography>
																		</Box>
																	</>
																)}

																{/* Offset Fields */}
																{paymentTransaction.paymentMethod === "Offset" && (
																	<>
																		<Box className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row">
																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__label">
																				Remarks:
																			</Typography>

																			<Typography className="paymentHistoriesBySalesInvoiceModal__body__stepContent__paymentsDetailed__item__content__row__value">
																				{paymentTransaction.remarks}
																			</Typography>
																		</Box>
																	</>
																)}
															</Box>
														</Box>
													)
												)}
											</Box>
										</Collapse>
									</Box>
								</StepContent>
							</Step>
						))}
					</Stepper>
				</Box>
			</Box>
		</CommonModal>
	);
}

export default PaymentHistoriesBySalesInvoiceModal;
