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
  items = [],
  handleFormValid,
  handleFormData,
  isFetching,
}) {
  const {
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(wrongDeliverSchema.schema),
    defaultValues: wrongDeliverSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "wrongDeliver",
  });

  const wrongDeliver = useWatch({
    control,
    name: "wrongDeliver",
    defaultValue: [],
  });

  console.log(wrongDeliver);

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
      setValue("wrongDeliver", transfomedItems);
    }
  }, [wrongItems, setValue]);

  useEffect(() => {
    if (handleFormValid && handleFormData) {
      handleFormValid((prev) => ({ ...prev, isWrongDeliverValid: isValid }));
      handleFormData((prev) => ({
        ...prev,
        wrongDeliver: wrongDeliver.map((item) => ({
          itemCode: item.item.itemCode,
          quantity: Number(item.quantity),
          reason: item.reason,
        })),
      }));
    }
  }, [wrongDeliver, isValid, handleFormValid, handleFormData, disableFields]);

  return isFetching ? (
    <WrongDeliverSkeleton />
  ) : (
    <Box sx={{ padding: "1px" }}>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: disableFields
            ? "calc(100dvh - 20dvh - 360px)"
            : "calc(100dvh - 20dvh - 400px)",
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
                        name={`wrongDeliver[${index}].item`}
                        options={items}
                        getOptionDisabled={(option) =>
                          fields.some(
                            (field) => field.item?.itemCode === option?.itemCode
                          )
                        }
                        getOptionLabel={(option) => option?.itemCode}
                        isOptionEqualToValue={() => true}
                        disabled={disableFields}
                        onChange={(_, value) => {
                          setValue(
                            `wrongDeliver[${index}].itemDescription`,
                            value?.itemDescription
                          );
                          setValue(`wrongDeliver[${index}].uom`, value?.uom);
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
                        name={`wrongDeliver[${index}].itemDescription`}
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
                        name={`wrongDeliver[${index}].uom`}
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
                        name={`wrongDeliver[${index}].quantity`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Quantity"
                            size="small"
                            autoComplete="off"
                            onChange={onChange}
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
                        name={`wrongDeliver[${index}].reason`}
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
                      disabled={!isValid}
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
