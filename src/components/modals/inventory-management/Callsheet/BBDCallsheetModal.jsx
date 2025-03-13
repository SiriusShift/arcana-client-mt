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
  const [totalRemainingBbd, setTotalRemainingBbd] = useState(0);
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [groupedSum, setGroupedSum] = useState(0);

  const validDataKey = index !== undefined && index !== null ? index : "";
  const dataInformation = data?.callSheetDtos?.[validDataKey] || {};

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
    setValue,
    watch,
  } = useFormContext();
  console.log(totalQuantity);

  console.log(watch());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bbdList",
  });

  console.log(fields);

  const [triggerDelete, { isLoading }] = useDeleteCallsheetBBDMutation();

  // // FUNCTIONS
  const onSubmit = (data) => {
    console.log(data);
    const transformData = data?.bbdList?.map((item) => ({
      itemCode: item.itemCode,
      itemBbds: {
        quantity: item?.quantity,
        remainingInv: item?.remainingInv,
        bbd: moment(item?.bbd).format("YYYY-MM-DD"),
        bbdId: item?.bbdId,
      },
    }));

    const groupedData = transformData.reduce((acc, item) => {
      let group = acc.find((g) => g.itemCode === item.itemCode);
      if (!group) {
        group = {
          itemCode: item.itemCode,
          itemBbds: [],
        };
        acc.push(group);
      }
      group.itemBbds.push(item.itemBbds);
      return acc;
    }, []);

    console.log(groupedData);

    dispatch(upsertItem(groupedData));
    handleClose();
  };

  // const onDelete = (item, index) => {
  //   // console.log("Item to delete:", index); // Debug here
  //   const find = dataInformation?.bbdDtos?.find(
  //     (bbd) => bbd.bbdId === item.bbdId
  //   );
  //   if (find) {
  //     confirm({
  //       children: "Are you sure you want to delete bbd item?",
  //       question: true,
  //       callback: () => {
  //         triggerDelete({ id: item.bbdId, body: { accessBy: 0 } }).unwrap();
  //         snackbar({
  //           message: "BBD deleted successfully",
  //           variant: "success",
  //         });
  //         handleClose();
  //       },
  //     });
  //   } else {
  //     remove(index);
  //   }
  // };

  // console.log(watch());

  const handleClose = () => {
    // console.log("close!");
    reset();
    setTotalQuantity(0);
    onClose();
  };

  const handleAdd = () => {
    append({
      itemCode: dataInformation.itemCode || "",
      itemDescription: dataInformation.itemDescription || "",
      salesIn: dataInformation.salesIn || "",
      remainingInv: totalRemainingBbd ? dataInformation.remainingInv - totalRemainingBbd : dataInformation.remainingInv  || null,
      quantity: null,
      bbd: "",
    });
  };

  useEffect(() => {
    if (dataInformation && open) {
      const bbdDtos = dataInformation?.bbdDtos || [];
      const callsheetItems = callsheetItem || [];

      const totalRemaining = bbdDtos.reduce(
        (acc, item) => acc + (item.remainingQuantity || 0),
        0
      );
      setTotalRemainingBbd(totalRemaining);
      const mergedBbdList = [
        // Include callsheetItems first
        ...callsheetItems.flatMap((callsheet) =>
          callsheet.itemCode === dataInformation?.itemCode
            ? callsheet.itemBbds.map((bbd) => ({
                itemCode: callsheet?.itemCode || "",
                salesIn: dataInformation?.salesIn ?? 0,
                itemDescription: dataInformation?.itemDescription || "",
                remainingInv: bbd?.remainingInv || 0,
                quantity: bbd?.quantity ?? 0,
                bbd: moment(bbd?.bbd).format("YYYY-MM-DD") || "",
                bbdId: bbd?.bbdId ?? null,
              }))
            : []
        ),

        // Only process bbdDtos if callsheetItems is empty
        ...(callsheetItems.some(
          (item) => item.itemCode === dataInformation?.itemCode
        )
          ? []
          : bbdDtos.flatMap((item) => {
              const itemBbdDate = item?.bbdDate
                ? moment(item.bbdDate).format("YYYY-MM-DD")
                : "";

              return [
                {
                  itemCode: dataInformation?.itemCode || "",
                  itemDescription: dataInformation?.itemDescription || "",
                  salesIn: dataInformation?.salesIn || 0,
                  remainingInv: item?.remainingQuantity ?? 0,
                  quantity: item?.quantity ?? null,
                  bbd: itemBbdDate,
                  bbdId: item?.bbdId ?? null,
                },
              ];
            })),
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

  // useEffect(() => {
  //   if (dataInformation && open) {
  //     console.log("Data Information:", dataInformation);

  //     reset({
  //       bbdList:
  //         dataInformation?.bbdDtos?.map((item) => ({
  //           itemCode: dataInformation.itemCode || "",
  //           itemDescription: dataInformation.itemDescription || "",
  //           salesIn: dataInformation.salesIn || 0,
  //           remainingInv: dataInformation.remainingInv || 0,
  //           quantity: item.quantity || null,
  //           bbd: item.bbd || "",
  //         })) || [],
  //     });

  //     const total = dataInformation?.bbdDtos?.reduce(
  //       (acc, item) => acc + (item.quantity || 0),
  //       0
  //     );
  //     setTotalQuantity(total);
  //   } else if (!open) {
  //     reset({ bbdList: [] });
  //     setTotalQuantity(0);
  //   }
  // }, [
  //   open,
  //   reset,
  //   JSON.stringify(dataInformation),
  //   JSON.stringify(callsheetItem),
  // ]);

  const bbdList = useWatch({
    control,
    name: "bbdList", // Watches the whole bbdList array
  });

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
              <Typography>
                Item Name: {dataInformation?.itemDescription}
              </Typography>
            </Box>
            <Box className="callsheetModal__callsheetHeader__left">
              <Typography>
                Remaining Inventory: {dataInformation?.remainingInv}
              </Typography>
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
                      {/* <Controller
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
                      /> */}
                      {/* <Controller
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
                      /> */}

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
                            placeholder="Quantity"
                            allowNegative={false} // Prevents negative values
                            decimalScale={0} // Only whole numbers
                            thousandSeparator // Adds thousand separators for better readability
                            isAllowed={(values) => {
                              const { floatValue } = values; // Extract numerical value\
                              const totalQuantity = watch("bbdList").filter(
                                (item, i) => i !== index
                              );
                              const total =
                                totalQuantity.reduce(
                                  (acc, item) =>
                                    parseFloat(acc) +
                                    (parseFloat(item.quantity) || 0),
                                  0
                                ) + (parseFloat(floatValue) || 0);
                              if (total > dataInformation.remainingInv) {
                                snackbar({
                                  message: "Quantity exceeds Sales In",
                                  variant: "error",
                                });
                                return false;
                              }
                              return true;
                            }}
                            onValueChange={(values) => {
                              const { floatValue } = values; // Extract numerical value
                              if (
                                dataInformation.sales &&
                                (floatValue ||
                                  0 > watch("bbdList")[index].remainingInv)
                              ) {
                                snackbar({
                                  message: "Quantity exceeds Sales In",
                                  variant: "error",
                                });
                                return;
                              } else {
                                field.onChange(floatValue || 0); // Ensures it's a number
                                setTotalQuantity(
                                  watch("bbdList").reduce(
                                    (acc, item) =>
                                      Number(acc) +
                                      (Number(item.quantity) || 0),
                                    0
                                  )
                                );
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
                              value={value ? moment(value) : null}
                              disabled={watch("bbdList")[index].bbdId}
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
                          console.log(index);
                          remove(index);
                        }}
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Stack>
                  ))}

                  {!disableFields &&
                    dataInformation?.remainingInv > 0 &&
                    totalQuantity < dataInformation.remainingInv &&
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
