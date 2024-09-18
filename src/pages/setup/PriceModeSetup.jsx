import { Box, TextField, Typography } from "@mui/material";
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
import { Settings, Watch } from "@mui/icons-material";
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

function PriceModeSetup() {
  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isViewProductsByPriceModeModalOpen,
    onOpen: onViewProductsByPriceModeModalOpen,
    onClose: onViewProductsByPriceModeModalClose,
  } = useDisclosure();

  // Constants
  const tableHeads = [
    "Price Mode Code",
    "Price Mode Description",
    "Tagged Products",
  ];

  const customOrderKeys = ["priceModeCode", "priceModeDescription"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
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
    name: "freebies",
  });

  //RTK Query
  const [postPriceMode, { isLoading: isAddLoading }] =
    usePostPriceModeMutation();

  const { data: priceModeItems, isLoading: isProductDataLoading } =
    useGetAllItemsByPriceModeIdQuery({
      PriceModeId: 1,
      PageSize: 1000,
    });

  console.log(priceModeItems);

  const { data, isFetching, error } = useGetAllPriceModeQuery(
    {
      Search: search,
      Status: status,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [putPriceMode, { isLoading: isUpdateLoading }] =
    usePutPriceModeMutation();
  const [patchPrideModeStatus] = usePatchPriceModeStatusMutation();

  //useEffect
  useEffect(() => {
    const productsArray = priceModeItems?.priceModeItems?.map((product) => ({
      itemId: product.priceModeItemId,
      desc: product.itemDescription,
      uom: product.uom,
      price: product.currentPrice,
    }));
    setValue("products", productsArray);
  }, [priceModeItems]);

  console.log(watch("products"));

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postPriceMode(data).unwrap();
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

      onDrawerClose();
      reset();
    } catch (error) {
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

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.priceModeCode}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchPrideModeStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Price Mode ${status ? "archived" : "restored"} successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    setDrawerMode("edit");
    onDrawerOpen();

    setValue("priceMode", editData.priceModeCode);
    setValue("priceModeDescription", editData.priceModeDescription);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
  };

  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  return (
    <>
      {error && <SessionExpired />}
      <Box className="commonPageLayout">
        <PageHeaderAdd
          pageTitle={
            <>
              Price Mode Setup <Settings />
            </>
          }
          onOpen={handleAddOpen}
          setSearch={setSearch}
          setStatus={setStatus}
        />

        {isFetching ? (
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            evenLesserCompact
            mapData={data?.priceMode}
            onEdit={handleEditOpen}
            onArchive={onArchive}
            onViewMoreConstant={onViewProductsByPriceModeModalOpen}
            onViewMoreConstantDisabled={!status}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            count={count}
            status={status}
          />
        )}

        <CommonDrawer
          width={"1000px"}
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Price Mode"}
          onSubmit={handleSubmit(onDrawerSubmit)}
          disableSubmit={!isValid}
          isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
        >
          <Box className="priceModeSetup">
            <Box className="priceModeSetup__row">
              <TextField
                className="priceModeSetup__row__code"
                label="Price Mode Code"
                size="small"
                autoComplete="off"
                {...register("priceMode")}
                helperText={errors?.priceMode?.message}
                error={errors?.priceMode}
                disabled={drawerMode === "edit"}
              />
              <TextField
                className="priceModeSetup__row__description"
                label="Price Mode Description"
                size="small"
                autoComplete="off"
                {...register("priceModeDescription")}
                helperText={errors?.priceModeDescription?.message}
                error={errors?.priceModeDescription}
              />
            </Box>
            <Typography className="priceModeSetup__title">Products</Typography>
            {priceModeItems?.priceModeItems?.map((item, index) => (
              <Box
                key={item?.priceModeItemId}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <ControlledAutocomplete
                  name={`products[${index}].itemId`}
                  control={control}
                  options={priceModeItems?.priceModeItems || []}
                  getOptionLabel={(option) => option.itemCode || ""}
                  getOptionDisabled={(option) => {
                    const products = watch("products");
                    return products.some(
                      (item) => item?.itemId?.itemCode === option.itemCode
                    );
                  }}
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
                    setValue(
                      `freebies[${index}].itemDescription`,
                      value?.itemDescription
                    );
                    setValue(`freebies[${index}].uom`, value?.uom);
                    return value;
                  }}
                />

                <Controller
                  control={control}
                  name={`products[${index}].desc`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
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
                  name={`products[${index}].uom`}
                  render={({ field: { onChange, onBlur, value, ref } }) => {
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
                  name={`products[${index}].price`}
                  render={({ field: { onChange, onBlur, value, ref } }) => {
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
              </Box>
            ))}
          </Box>
        </CommonDrawer>

        <ViewProductsByPriceModeModal
          open={isViewProductsByPriceModeModalOpen}
          onClose={onViewProductsByPriceModeModalClose}
        />
      </Box>
    </>
  );
}

export default PriceModeSetup;
