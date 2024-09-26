import { Box, Checkbox, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { priceModeSetupSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import { CheckBox, RemoveCircleOutline, Settings, Watch } from "@mui/icons-material";
import {
  usePutPriceModeMutation,
  useGetAllPriceModeQuery,
  usePostPriceModeMutation,
  usePatchPriceModeStatusMutation,
} from "../../features/setup/api/priceModeSetupApi";
import { useGetAllItemsByPriceModeIdQuery } from "../../features/setup/api/priceModeItemsApi";
import ViewProductsByPriceModeModal from "../../components/modals/ViewProductsByPriceModeModal";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import SessionExpired from "../SessionExpired";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useField } from "@mui/x-date-pickers/internals";
import SecondaryButton from "../../components/SecondaryButton";

function PriceModeSetup({
  onOpen,
  onClose,
  drawerMode,
}) {
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    control,
    watch,
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(priceModeSetupSchema.schema),
    mode: "onChange",
    defaultValues: priceModeSetupSchema.defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  //RTK Query
  const [postPriceMode, { isLoading: isAddLoading }] =
    usePostPriceModeMutation();

  const { data: priceModeItems, error, isLoading: isProductDataLoading } =
    useGetAllItemsByPriceModeIdQuery({
      PriceModeId: 1,
      PageSize: 1000,
    });

  const [putPriceMode, { isLoading: isUpdateLoading }] =
    usePutPriceModeMutation();

  //Variables
  const productsArray = priceModeItems?.priceModeItems;
  console.log(watch());

  const handleFreebieError = () => {
    if (fields.length === 1) {
      snackbar({ message: "Must have at least 1 freebie", variant: "error" });
    } else if (fields.length === 5) {
      snackbar({ message: "Maximum of 5 freebies only", variant: "error" });
    }
  };

  //useEffect
  // useEffect(() => {
  //   const productArray = productsArray?.map((product) => ({
  //     itemId: product.itemCode,
  //     desc: product.itemDescription,
  //     uom: product.uom,
  //     price: product.currentPrice,
  //   }));
  //   setValue("products", productArray);
  // }, [priceModeItems]);

  //Drawer Functions

  const handleDrawerClose = () => {
    reset();
    onClose();
  };

  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postPriceMode({
          priceModeCode: data.priceModeCode,
          priceModeDescription: data.priceModeDescription,
          items: data.items.map((items) => ({
            itemId: items.itemId.itemId,
            price: items.price,
            isClearPack: items.isClearPack,
          }))
        }).unwrap();
        snackbar({
          message: "Price Mode added successfully",
          variant: "success",
        });
      } else if (drawerMode === "edit") {
        await putPriceMode({ id: selectedRowData?.id, ...data }).unwrap();
        snackbar({
          message: "Price Mode updated successfully",
          variant: "success",
        });
      }

      onClose();
      reset();
    } catch (error) {
      console.log("error",error);
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({
          message: `Error ${
            drawerMode === "add" ? "adding" : "updating"
          } Price Mode`,
          variant: "error",
        });
      }
    }
  };

  return (
    <>
      {error && <SessionExpired />}
        <CommonDrawer
          width={drawerMode === "add" ? "1000px" : ""}
          open={onOpen}
          onClose={handleDrawerClose}
          drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Price Mode"}
          onSubmit={handleSubmit(onDrawerSubmit)}
          disableSubmit={!isValid}
          enableAutoAnimate
          isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
        >
          <Box className="priceModeSetup">
            <Box
              className={
                drawerMode !== "edit"
                  ? "priceModeSetup__row"
                  : "priceModeSetup__column"
              }
            >
              <TextField
                sx={{ width: drawerMode !== "edit" ? "30%" : "100%" }}
                label="Price Mode Code"
                size="small"
                autoComplete="off"
                {...register("priceModeCode")}
                helperText={errors?.priceModeCode?.message}
                error={errors?.priceModeCode}
                disabled={drawerMode === "edit"}
              />
              <TextField
                sx={{ width: drawerMode !== "edit" ? "30%" : "100%" }}
                label="Price Mode Description"
                size="small"
                autoComplete="off"
                {...register("priceModeDescription")}
                helperText={errors?.priceModeDescription?.message}
                error={errors?.priceModeDescription}
              />
            </Box>
            {drawerMode !== "edit" && (
              <>
                <Typography className="priceModeSetup__title">
                  Products
                </Typography>
                {fields?.map((item, index) => {
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <ControlledAutocomplete
                        name={`items[${index}].itemId`}
                        control={control}
                        options={productsArray || []}
                        getOptionLabel={(option) => option.itemCode || ""}
                        // getOptionDisabled={(option) => {
                        //   const products = watch("products");
                        //   return products.some(
                        //     (item) => item?.itemId?.itemCode === option?.itemCode
                        //   );
                        // }}
                        loading={isProductDataLoading}
                        disableClearable
                        isOptionEqualToValue={() => true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Product Code"
                            // required
                            helperText={errors?.itemId?.message}
                            error={errors?.itemId}
                            sx={{ width: "200px" }}
                            data-testid={`product-${index}`}
                          />
                        )}
                        onChange={(_, value) => {
                          console.log("value", value);
                          setValue(
                            `items[${index}].desc`,
                            value?.itemDescription
                          );
                          setValue(`items[${index}].uom`, value?.uom);
                          setValue(
                            `items[${index}].price`,
                            value?.currentPrice
                          );
                          return value;
                        }}
                      />

                      <Controller
                        control={control}
                        name={`items[${index}].desc`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Item Description"
                            size="small"
                            autoComplete="off"
                            disabled
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value?.toUpperCase() || ""}
                            ref={ref}
                            sx={{ width: "500px" }}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`items[${index}].uom`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => {
                          return (
                            <TextField
                              label="UOM"
                              size="small"
                              autoComplete="off"
                              disabled
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value || ""}
                              ref={ref}
                              sx={{ width: "200px" }}
                            />
                          );
                        }}
                      />
                      <Controller
                        control={control}
                        name={`items[${index}].price`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => {
                          return (
                            <TextField
                              label="Price"
                              size="small"
                              autoComplete="off"
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value || ""}
                              ref={ref}
                              sx={{ width: "200px" }}
                            />
                          );
                        }}
                      />
                      <Controller
                        control={control}
                        name={`items[${index}].isClearPack`}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <>
                          <Checkbox
                            label="Remarks"
                            size="small"
                            autoComplete="off"
                            onChange={(e) => {
                              setValue(`items[${index}].isClearPack`, e.target.checked);
                            }}
                            onBlur={onBlur}
                            value={value || ""}
                            ref={ref}
                            checked={value}
                          />
                          <Typography>
                            Clearpack
                          </Typography>
                          </>
                        )}
                      >

                      </Controller>
                      <IconButton
                        sx={{ color: "error.main" }}
                        onClick={() => {
                          fields.length <= 1
                            ? handleFreebieError()
                            : // : remove(fields[index]);
                              remove(index);
                        }}
                      >
                        <RemoveCircleOutline sx={{ fontSize: "30px" }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {drawerMode !== "edit" 
            // && fields.length < productsArray?.length 
            && (
              <SecondaryButton
                sx={{ width: "150px" }}
                onClick={() => {
                  // fields.length < productsArray?.length ? 
                  append({ itemId: null, desc: "", price: 0, isClearPack: false })
                    // : handleFreebieError();
                }}
                disabled={
                  !watch("items")[watch("items")?.length - 1]?.itemId
                }
              >
                Add Freebie
              </SecondaryButton>
            )}
          </Box>
        </CommonDrawer>
    </>
  );
}

export default PriceModeSetup;
