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

  console.log("total", dataInformation);

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

    if (data.bbdList.length === 0) {
      dispatch(
        upsertItem([
          {
            itemCode: dataInformation.itemCode,
            bbds: [],
          },
        ])
      );
    }
    const transformData = data?.bbdList?.map((item) => ({
      itemCode: item.itemCode,
      bbds: {
        quantity: item?.quantity,
        remainingInv: item?.remainingInv,
        bbdDate: item.bbdDate
          ? moment(item?.bbdDate).format("YYYY-MM-DD")
          : null,
      },
    }));

    const groupedData = transformData.reduce((acc, item) => {
      let group = acc.find((g) => g.itemCode === item.itemCode);
      if (!group) {
        group = {
          itemCode: item.itemCode,
          bbds: [],
        };
        acc.push(group);
      }
      group.bbds.push(item.bbds);
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
      remainingInv: dataInformation.remainingInv || null,
      quantity: null,
      bbdDate: null,
    });
  };

  useEffect(() => {
    if (dataInformation && open) {
      const bbdDtos = dataInformation?.bbdDtos || [];
      const callsheetItems = callsheetItem || [];

      console.log("callsheet items",callsheetItems);

      const totalQuantity =
        callsheetItems?.length > 0
          ? callsheetItems
              .find((item) => item?.itemCode === dataInformation?.itemCode)
              ?.bbds?.reduce((acc, bbd) => acc + (bbd.quantity || 0), 0) || 0
          : 0;

      console.log("total quantity",totalQuantity);

      setTotalQuantity(totalQuantity[0] || totalQuantity);
      const mergedBbdList = [
        // Include callsheetItems first
        ...callsheetItems.flatMap((callsheet) => {
          if (callsheet?.itemCode === dataInformation?.itemCode) {
            return (
              callsheet.bbds?.map((bbd) => ({
                itemCode: callsheet?.itemCode || "",
                salesIn: dataInformation?.salesIn ?? 0,
                itemDescription: dataInformation?.itemDescription || "",
                remainingInv: bbd?.remainingInv ?? 0,
                quantity: bbd?.quantity ?? 0,
                bbdDate: bbd?.bbdDate
                  ? moment(bbd.bbdDate).format("YYYY-MM-DD")
                  : null,
                bbdId: bbd?.bbdId ?? null,
              })) || []
            );
          }
          return [];
        }),

        // Only process bbdDtos if callsheetItems is empty
        // ...(callsheetItems.some(
        //   (item) => item.itemCode === dataInformation?.itemCode
        // )
        //   ? []
        //   : bbdDtos.flatMap((item) => {
        //       const itemBbdDate = item?.bbdDate
        //         ? moment(item.bbdDate).format("YYYY-MM-DD")
        //         : "";

        //       return [
        //         {
        //           itemCode: dataInformation?.itemCode || "",
        //           itemDescription: dataInformation?.itemDescription || "",
        //           salesIn: dataInformation?.salesIn || 0,
        //           remainingInv: item?.remainingQuantity ?? 0,
        //           quantity: item?.quantity ?? null,
        //           bbdDate: itemBbdDate,
        //           bbdId: item?.bbdId ?? null,
        //         },
        //       ];
        //     })),
      ];
      console.log(mergedBbdList);

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
                                  message:
                                    "Quantity exceeds Remaining Inventory",
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
                        name={`bbdList[${index}].bbdDate`}
                        control={control}
                        render={({ field: { onChange, value, ref } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              label="BBD*"
                              slotProps={{ textField: { size: "small" } }}
                              value={value ? moment(value) : null}
                              disabled={watch("bbdList")[index]?.bbdId}
                              onChange={(newValue) =>
                                onChange(newValue?.toDate())
                              }
                              shouldDisableDate={(date) => {
                                const currentDate = date
                                  .startOf("day")
                                  .toISOString();
                                const bbdList = watch("bbdList");
                                return bbdList.some((item, idx) => {
                                  if (!item.bbdDate || idx === index)
                                    return false;
                                  return (
                                    moment(item.bbdDate)
                                      .startOf("day")
                                      .toISOString() === currentDate
                                  );
                                });
                              }}
                              inputRef={ref}
                              sx={{ width: "200px" }}
                            />
                          </LocalizationProvider>
                        )}
                      />

                      <IconButton
                        color="error"
                        disabled={watch("bbdList")[index]?.bbdId}
                        onClick={() => {
                          console.log(index);
                          console.log(item.quantity);
                          setTotalQuantity(
                            watch("bbdList").reduce(
                              (acc, item) =>
                                Number(acc) - (Number(item.quantity) || 0),
                              0
                            )
                          );
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
