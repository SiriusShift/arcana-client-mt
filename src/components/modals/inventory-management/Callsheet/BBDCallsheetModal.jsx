import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModalForm from "../../../CommonModalForm";
import CommonModal from "../../../CommonModal";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { useField } from "@mui/x-date-pickers/internals";
import { useDispatch, useSelector } from "react-redux";
import { Add, RemoveCircle } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import useSnackbar from "../../../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import {
  callsheetApi,
  useDeleteCallsheetBBDMutation,
  useGetTransactionItemCallsheetQuery,
  useUpdateItemsWithBBDMutation,
} from "../../../../features/inventory-management/api/callsheetApi";
import useConfirm from "../../../../hooks/useConfirm";
import { bbdCallsheet } from "../../../../schema/schema";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { initial } from "lodash";
import {
  selectItem,
  upsertItem,
  updateBbd,
} from "../../../../features/inventory-management/reducers/callsheetSlice";

function BBDCallsheetModal({ width, onClose, data, open, index, ...props }) {
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const callsheetItem = useSelector((state) => state.callsheet.items);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [groupedSum, setGroupedSum] = useState(0);

  const validDataKey = index !== undefined && index !== null ? index : "";
  const dataInformation = data?.callSheetDtos?.[validDataKey] || {};

  console.log(callsheetItem);

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
    setValue,
    watch,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bbdList",
  });

  // console.log(isValid);
  //RTK QUERY

  const [triggerBBD] = useUpdateItemsWithBBDMutation();
  const [triggerDelete, { isLoading }] = useDeleteCallsheetBBDMutation();
  // const {data: callsheetData} = useGetTransactionItemCallsheetQuery()
  // console.log(callsheetData);

  // // FUNCTIONS
  const onSubmit = (data) => {
    const transformData = data?.bbdList?.map((item) => ({
      transactionId: item.transactionId.transactionId,
      itemCode: item.itemCode,
      itemBbds: {
        quantity: item?.quantity,
        bbd: moment(item?.bbd).format("YYYY-MM-DD"),
        bbdId: item?.bbdId,
      },
    }));
    console.log(transformData);
    const groupedData = transformData.reduce((acc, item) => {
      let group = acc.find((g) => g.transactionId === item.transactionId);
      if (!group) {
        group = {
          transactionId: item.transactionId,
          itemCode: item.itemCode,
          itemBbds: [],
        };
        acc.push(group);
      }
      group.itemBbds.push(item.itemBbds);
      return acc;
    }, []);

    // console.log("onSUbmit", groupedData);
    dispatch(upsertItem(groupedData));
    handleClose();
    // try {
    //   confirm({
    //     children: "Are you sure you want to update the remaining inventory?",
    //     question: true,
    //     callback: () => {
    //       triggerBBD({ items: groupedData }).unwrap();
    //       snackbar({
    //         message: "Inventory updated successfully",
    //         variant: "success",
    //       });
    //       handleClose();
    //     },
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const onDelete = (item, index) => {
    // console.log("Item to delete:", index); // Debug here
    const find = dataInformation?.bbdDtos?.find(
      (bbd) => bbd.bbdId === item.bbdId
    );
    // console.log("Matching BBD:", find); // See if it finds anything
    if (find) {
      confirm({
        children: "Are you sure you want to delete bbd item?",
        question: true,
        callback: () => {
          triggerDelete({ id: item.bbdId, body: { accessBy: 0 } }).unwrap();
          snackbar({
            message: "BBD deleted successfully",
            variant: "success",
          });
          handleClose();
        },
      });
    } else {
      remove(index);
    }
  };

  // console.log(watch());

  const handleClose = () => {
    // console.log("close!");
    reset();
    setTotalQuantity(0);
    onClose();
  };

  const handleAdd = () => {
    append({
      transactionId: null,
      itemCode: dataInformation.itemCode || "",
      itemDescription: dataInformation.itemDescription || "",
      salesIn: dataInformation.salesIn || "",
      remainingInv: dataInformation.remainingInv || "",
      quantity: null,
      initial: null,
      bbd: "",
    });
  };

  useEffect(() => {
    if (dataInformation && open) {
      const bbdDtos = dataInformation?.bbdDtos || [];
      const transactionItemIds = dataInformation?.transactionItemIds || [];
      const callsheetItems = callsheetItem || [];
      console.log(bbdDtos);

      const mergedBbdList = [
        ...bbdDtos.flatMap((item) => {
          const matchingCallsheet = callsheetItems.find(
            (callsheet) =>
              callsheet.transactionId === item.transactionId &&
              callsheet.itemBbds.some(
                (bbd) => bbd.bbd === moment(item.bbdDate).format("YYYY-MM-DD")
              )
          );

          if (matchingCallsheet) {
            const matchedBbds = matchingCallsheet.itemBbds.filter(
              (bbd) =>
                bbd.bbdId === item.bbdId &&
                moment(bbd.bbd).format("YYYY-MM-DD") ===
                  moment(item.bbdDate).format("YYYY-MM-DD")
            );

            return matchedBbds.map((bbd) => ({
              itemCode: dataInformation?.itemCode || "",
              itemDescription: dataInformation?.itemDescription || "",
              salesIn: dataInformation?.salesIn || "",
              initial: item?.quantity ?? null,
              remainingInv: item?.remainingQuantity ?? null,
              transactionId: transactionItemIds.find(
                (transaction) =>
                  transaction?.transactionId ===
                  matchingCallsheet?.transactionId
              ),
              quantity: bbd?.quantity ?? null,
              bbd: bbd?.bbd || "",
              bbdId: bbd?.bbdId || null,
            }));
          } else {
            return [
              {
                itemCode: dataInformation?.itemCode || "",
                itemDescription: dataInformation?.itemDescription || "",
                salesIn: dataInformation?.salesIn || "",
                initial: item?.quantity ?? null,
                remainingInv: item?.remainingQuantity ?? null,
                transactionId: transactionItemIds.find(
                  (transaction) =>
                    transaction?.transactionId === item?.transactionId
                ),
                quantity: null,
                bbd: moment(item.bbdDate).format("YYYY-MM-DD") || "",
                bbdId: item?.bbdId || null,
              },
            ];
          }
        }),

        ...callsheetItems.flatMap((callsheet) =>
          !bbdDtos.some(
            (transaction) =>
              transaction?.transactionId === callsheet?.transactionId
          ) && callsheet?.itemCode === dataInformation?.itemCode
            ? callsheet.itemBbds.map((bbd) => ({
                itemCode: callsheet?.itemCode || "",
                itemDescription: dataInformation?.itemDescription || "",
                salesIn: dataInformation?.salesIn || "",
                initial: null,
                remainingInv: transactionItemIds.find(
                  (transactions) =>
                    transactions.transactionId === callsheet?.transactionId
                ).remainingQuantity,
                transactionId:
                  transactionItemIds.find(
                    (transactions) =>
                      transactions.transactionId === callsheet?.transactionId
                  ) || null,
                quantity: bbd?.quantity || null,
                bbd: bbd?.bbd || "",
                bbdId: bbd?.bbdId || null,
              }))
            : []
        ),
      ];

      reset({ bbdList: mergedBbdList });
    } else if (!open) {
      reset({ bbdList: [] });
      setTotalQuantity(0);
    }
  }, [
    open,
    reset,
    JSON.stringify(dataInformation),
    JSON.stringify(callsheetItem),
  ]);

  const bbdList = useWatch({
    control,
    name: "bbdList", // Watches the whole bbdList array
  });

  useEffect(() => {
    if (open) {
      console.log("bbdList changed", bbdList);

      const groupedSums = bbdList.reduce((acc, item) => {
        if (!item.initial && item.transactionId?.transactionId) {
          const transactionId = item.transactionId.transactionId;
          acc[transactionId] =
            (acc[transactionId] || 0) + (Number(item.quantity) || 0);
        }
        return acc;
      }, {});

      const isValid = bbdList.every((item) => {
        if (!item.initial && item.transactionId?.transactionId) {
          const transactionId = item.transactionId.transactionId;
          return groupedSums[transactionId] === item.remainingInv;
        }
        return true;
      });

      setGroupedSum(groupedSums);
      setIsQuantityValid(isValid);
    }
  }, [open, bbdList]);

  const disableFields = fields.some((item) => item.actualQuantity);

  return (
    <>
      <CommonModalForm
        title={"BBD Monitoring"}
        disableSubmit={!isValid || !isQuantityValid}
        submitText="Update"
        open={open}
        date={data?.modifiedDate}
        onSubmit={handleSubmit(onSubmit)}
        onClose={handleClose}
        width={width}
        {...props}
      >
        {" "}
        <Box className="callsheetModal">
          <Box className="callsheetModal__callsheetHeader">
            <Box className="callsheetModal__callsheetHeader__left">
              <Typography>Customer Name: {data?.customerName}</Typography>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              overflow: "auto",
              maxHeight: "calc(100dvh - 25dvh - 360px)",
            }}
          >
            <Table>
              <TableHead sx={{ position: "sticky", top: 0, zIndex: 10 }}>
                <TableRow>
                  <TableCell>BBD List</TableCell>
                </TableRow>
              </TableHead>
              <TableCell>
                <Stack spacing={1}>
                  {fields.map((item, index) => (
                    <Stack direction="row" spacing={1.5} key={index}>
                      <ControlledAutocomplete
                        name={`bbdList[${index}].transactionId`}
                        control={control}
                        options={dataInformation?.transactionItemIds?.filter(
                          (item) =>
                            !dataInformation?.bbdDtos?.some(
                              (bbd) =>
                                bbd?.transactionId === item?.transactionId
                            )
                        )}
                        disabled={watch("bbdList")?.[index]?.initial}
                        getOptionLabel={(option) => option?.transactionId || ""}
                        isOptionEqualToValue={(option, val) =>
                          option.transactionId === val
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Transaction Item"
                            helperText={
                              errors?.bbdList?.[index]?.transactionId?.message
                            }
                            error={!!errors?.bbdList?.[index]?.transactionId}
                            sx={{ width: "180px" }}
                          />
                        )}
                        onChange={(_, selectedValue) => {
                          // console.log(selectedValue);
                          // Set remainingInv when transaction ID changes
                          setValue(
                            `bbdList[${index}].remainingInv`,
                            selectedValue?.remainingQuantity || ""
                          );
                          return selectedValue; // Return the full selected value
                        }}
                      />

                      <Controller
                        name={`bbdList[${index}].itemCode`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Item Code"
                            variant="outlined"
                            size="small"
                            placeholder="Item Code"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList[${index}].itemDescription`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Item Description"
                            variant="outlined"
                            size="small"
                            placeholder="Item Description"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList[${index}].salesIn`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Sales In"
                            variant="outlined"
                            size="small"
                            placeholder="Sales In"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList[${index}].initial`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Initial"
                            variant="outlined"
                            size="small"
                            placeholder="BBD"
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name={`bbdList[${index}].remainingInv`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Remaining"
                            variant="outlined"
                            size="small"
                            placeholder="Sales In"
                            disabled
                          />
                        )}
                      />

                      <Controller
                        name={`bbdList[${index}].quantity`}
                        control={control}
                        render={({ field }) => (
                          <NumericFormat
                            {...field}
                            customInput={TextField} // Use TextField as input
                            size="small"
                            label="Quantity*"
                            type="number"
                            variant="outlined"
                            // disabled={
                            //   watch("bbdList")[index].remainingInv === 0
                            // }
                            placeholder="Quantity"
                            allowNegative={false} // Prevents negative values
                            decimalScale={0} // Only whole numbers
                            thousandSeparator // Adds thousand separators for better readability
                            isAllowed={(values) => {
                              const { floatValue } = values;
                              const currentTransactionId =
                                watch("bbdList")[index]?.transactionId
                                  ?.transactionId;

                              // Check if there is any matching transactionId in bbdDtos
                              const hasMatchingTransaction =
                                dataInformation.bbdDtos.some(
                                  (dto) =>
                                    dto.transactionId === currentTransactionId
                                );

                              if (hasMatchingTransaction) {
                                if (
                                  floatValue >
                                  watch("bbdList")[index].remainingInv
                                ) {
                                  snackbar({
                                    message:
                                      "Quantity exceeds remaining inventory",
                                    variant: "error",
                                  });
                                  return false;
                                }
                                return true;
                              } else if (!hasMatchingTransaction) {
                                // If no matching transactionId in bbdDtos
                                const totalQuantity = watch("bbdList").filter(
                                  (item, i) =>
                                    i !== index &&
                                    item?.transactionId?.transactionId ===
                                      currentTransactionId
                                );

                                const total =
                                  totalQuantity.reduce(
                                    (acc, item) =>
                                      parseFloat(acc) +
                                      (parseFloat(item.quantity) || 0),
                                    0
                                  ) + (parseFloat(floatValue) || 0);

                                if (
                                  total > watch("bbdList")[index].remainingInv
                                ) {
                                  snackbar({
                                    message:
                                      "Quantity exceeds remaining inventory",
                                    variant: "error",
                                  });
                                  return false;
                                }
                                return true;
                              }
                            }}
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              const currentTransactionId =
                                watch("bbdList")[index]?.transactionId
                                  ?.transactionId;

                              // Check if there is any matching transactionId in bbdDtos
                              const hasMatchingTransaction =
                                dataInformation.bbdDtos.some(
                                  (dto) =>
                                    dto.transactionId === currentTransactionId
                                );

                              if (hasMatchingTransaction) {
                                if (
                                  floatValue >
                                  watch("bbdList")[index].remainingInv
                                ) {
                                  snackbar({
                                    message:
                                      "Quantity exceeds remaining inventory",
                                    variant: "error",
                                  });
                                  return false;
                                }
                              } else if (!hasMatchingTransaction) {
                                // If no matching transactionId in bbdDtos
                                const totalQuantity = watch("bbdList").filter(
                                  (item, i) =>
                                    i !== index &&
                                    item?.transactionId?.transactionId ===
                                      currentTransactionId
                                );

                                const total =
                                  totalQuantity.reduce(
                                    (acc, item) =>
                                      parseFloat(acc) +
                                      (parseFloat(item.quantity) || 0),
                                    0
                                  ) + (parseFloat(floatValue) || 0);

                                // console.log(total);

                                if (
                                  total > watch("bbdList")[index].remainingInv
                                ) {
                                  snackbar({
                                    message:
                                      "Quantity exceeds remaining inventory",
                                    variant: "error",
                                  });
                                  return false;
                                }
                                field.onChange(floatValue);
                                // setTotalQuantity(total)
                              }
                            }}
                          />
                        )}
                      />

                      <Controller
                        name={`bbdList[${index}].bbd`}
                        control={control}
                        render={({ field: { onChange, value, ref } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              slotProps={{
                                textField: {
                                  size: "small",
                                },
                              }}
                              label="BBD*"
                              size="small"
                              disabled={
                                !(
                                  watch("bbdList")[index].initial ===
                                    undefined ||
                                  watch("bbdList")[index].initial === null
                                )
                              }
                              value={value ? moment(value) : null}
                              onChange={(newValue) =>
                                onChange(newValue?.toDate())
                              } // ✅ Convert Moment to JS Date
                              inputRef={ref}
                              sx={{ width: "200px" }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <IconButton
                        color="error"
                        onClick={() => {
                          onDelete(item, index);
                        }}
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Stack>
                  ))}

                  {!disableFields &&
                    dataInformation?.remainingInv > 0 &&
                    // && totalQuantity < dataInformation.remainingInv
                    totalQuantity < dataInformation.salesIn && (
                      <SecondaryButton
                        endIcon={<Add />}
                        sx={{ width: "fit-content", alignSelf: "end" }}
                        onClick={handleAdd}
                        disabled={!isValid}
                      >
                        Add Item
                      </SecondaryButton>
                    )}
                </Stack>
              </TableCell>
            </Table>
          </TableContainer>
        </Box>
      </CommonModalForm>
    </>
  );
}

export default BBDCallsheetModal;
