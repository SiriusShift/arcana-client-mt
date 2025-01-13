import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { wrongDeliverSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { Add, RemoveCircleOutline } from "@mui/icons-material";
import SecondaryButton from "../../../SecondaryButton";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import useSnackbar from "../../../../hooks/useSnackbar";

const WrongDeliverSkeleton = () => {
  return (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "calc(100dvh - 30dvh - 360px)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Wrong Deliver</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <Stack spacing={1}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Stack direction="row" spacing={1.5} key={index}>
                      <Skeleton variant="rectangular" width={140} height={32} />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={32}
                      />
                      <Skeleton variant="rectangular" width={120} height={32} />
                      <Skeleton variant="rectangular" width={120} height={32} />
                      <Skeleton variant="rectangular" width={120} height={32} />
                    </Stack>
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

function WrongDeliver({
  wrongItems = [],
  formData = [],
  items = [],
  handleFormValid,
  handleFormData,
  isFetching,
  viewing
}) {
  const snackbar = useSnackbar();
  const {
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(wrongDeliverSchema.schema),
    defaultValues: wrongDeliverSchema.defaultValues,
  });

  console.log(watch());

  const { fields, append, remove } = useFieldArray({
    control,
    name: "wrong",
  });

  const wrong = useWatch({
    control,
    name: "wrong",
    defaultValue: [],
  });

  // console.log(wrongDeliver);

  const disableFields = wrongItems.length > 0;

  const handleAdd = () => {
    append({
      item: {
        itemCode: "",
        itemDescription: "",
        uom: "",
      },
      itemDescription: "",
      uom: "",
      quantity: null,
      reason: "",
    });
  };

  useEffect(() => {
    if (wrongItems.length > 0) {
      const transfomedItems = wrongItems.map((item) => ({
        item: { itemCode: item.itemCode },
        ...item,
      }));
      setValue("wrong", transfomedItems);
    }
  }, [wrongItems, setValue]);

  useEffect(() => {
    if (handleFormValid && handleFormData) {
      handleFormValid((prev) => ({ ...prev, isWrongDeliverValid: isValid }));
      handleFormData((prev) => ({
        ...prev,
        wrong: wrong.map((item) => ({
          itemCode: item?.item?.itemCode || "",
          quantity: Number(item.quantity),
          reason: item.reason,
        })),
      }));
    }
  }, [wrong, isValid, handleFormValid, handleFormData, disableFields]);

  return isFetching ? (
    <WrongDeliverSkeleton />
  ) : (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{
          minHeight: "calc(100dvh - 36dvh - 360px)",
          maxHeight: disableFields
            ? "calc(100dvh - 32dvh - 360px)"
            : "calc(100dvh - 32dvh - 400px)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Wrong Deliver</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <Stack spacing={1}>
                  {fields.map((item, index) => (
                    <Stack direction="row" spacing={1.5} key={item.id}>
                      <ControlledAutocomplete
                        control={control}
                        name={`wrong[${index}].item`}
                        options={items || []}
                        getOptionDisabled={(option) =>
                          fields.some(
                            (field) => field.item?.itemCode && field.item?.itemCode === option?.itemCode
                          )
                        }
                        
                        getOptionLabel={(option) => option?.itemCode}
                        isOptionEqualToValue={() => true}
                        disabled={disableFields}
                        onChange={(_, value) => {
                          setValue(
                            `wrong[${index}].itemDescription`,
                            value?.itemDescription
                          );
                          setValue(`wrong[${index}].uom`, value?.uom);
                          return value;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Item Code"
                            helperText={errors?.item?.message}
                            error={!!errors?.item}
                            sx={{ width: "140px" }}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`wrong[${index}].itemDescription`}
                        render={({ field }) => (
                          <TextField
                            label="Item Description"
                            size="small"
                            autoComplete="off"
                            {...field}
                            value={field.value || ""}
                            inputRef={field.ref}
                            disabled
                            sx={{ flex: 1 }}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`wrong[${index}].uom`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="UOM"
                            size="small"
                            autoComplete="off"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value || ""}
                            inputRef={ref}
                            sx={{ maxWidth: "120px" }}
                            disabled
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`wrong[${index}].quantity`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Quantity"
                            size="small"
                            autoComplete="off"
                            onChange={(e) => {
                              watch("wrong").map((item) => {
                                formData.items.map((data) => {
                                  if(item.item.itemCode === data.itemCode) {
                                    if(e.target.value > data?.actualQuantity){
                                      console.log(item?.item?.quantity, data?.actualQuantity)
                                      return snackbar({ message: "Quantity exceeds actual quantity", variant: "error" })
                                    }else if(e.target.value < 0){
                                      return snackbar({message: "Quantity received must not be negative value", variant: "error"})
                                    }
                                    else{
                                      onChange(e)
                                    }
                                  }
                                })
                              })
                            }}
                            onBlur={onBlur}
                            value={value || ""}
                            inputRef={ref}
                            sx={{ maxWidth: "120px" }}
                            disabled={disableFields}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`wrong[${index}].reason`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Reason"
                            size="small"
                            autoComplete="off"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value || ""}
                            inputRef={ref}
                            disabled={disableFields}
                          />
                        )}
                      />

                      {!disableFields && (
                        <IconButton color="error" onClick={() => remove(index)}>
                          <RemoveCircleOutline />
                        </IconButton>
                      )}
                    </Stack>
                  ))}

                  {!disableFields && (
                    <SecondaryButton
                      endIcon={<Add />}
                      sx={{ width: "fit-content", alignSelf: "end" }}
                      onClick={handleAdd}
                      disabled={!isValid || viewing}
                    >
                      Add Wrong Deliver
                    </SecondaryButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default WrongDeliver;
