import { Box } from "@mui/material";
import TransferOutFormHeader from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormHeader";
import { FormProvider, useForm } from "react-hook-form";
import TransferOutFormDetails from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormDetails";
import TransferOutItems from "../../../components/page-components/inventory-management/transfer-out/TransferOutItems";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferOutSchema } from "../../../schema/schema";
import { useGetTransferOutByIdQuery } from "../../../features/inventory-management/api/transferOutApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const ViewTransferOut = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(transferOutSchema.schema),
    defaultValues: transferOutSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetTransferOutByIdQuery(id);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/transfer-out", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <TransferOutFormHeader />

      <FormProvider {...methods}>
        <TransferOutFormDetails details={data} isFetching={isFetching} />

        <TransferOutItems items={data?.items} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewTransferOut;
