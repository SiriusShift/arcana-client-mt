import { TextField } from "@mui/material";
import CommonModalForm from "../../CommonModalForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { generateMoveOrderSchema } from "../../../schema/schema";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../../hooks/useSnackbar";
import { useLazyGenerateMoveOrderQuery } from "../../../features/inventory-management/api/receivingApi";
import { useDispatch } from "react-redux";
import { setData } from "../../../features/inventory-management/reducers/generateReceivingSlice";

function GenerateMoveOrderModal({ open, onClose }) {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generateMoveOrderSchema.schema),
    defaultValues: {
      moveOrderSlipNo: "",
    },
  });

  // RTK Query
  const [generate, { isFetching }] = useLazyGenerateMoveOrderQuery();

  const onSubmit = async (data) => {
    try {
      await generate(data.moveOrderSlipNo).unwrap();

      dispatch(setData({ moveOrderSlipNo: data.moveOrderSlipNo }));
      onClose();
      navigate(`receiving-form`);
    } catch (error) {
      snackbar({ variant: "error", message: error.message });
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current.focus();
        inputRef.current.select();
      }, 0);
    } else {
      reset();
    }
  }, [open, reset]);

  return (
    <CommonModalForm
      open={open}
      onClose={onClose}
      title="Move Order"
      submitText="Generate"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isFetching}
      disableSubmit={isFetching}
    >
      <TextField
        size="small"
        label="Move Order Slip Number"
        {...register("moveOrderSlipNo")}
        type="number"
        fullWidth
        inputRef={inputRef}
        error={!!errors.moveOrderSlipNo}
        helperText={errors.moveOrderSlipNo?.message}
      />
    </CommonModalForm>
  );
}

export default GenerateMoveOrderModal;
