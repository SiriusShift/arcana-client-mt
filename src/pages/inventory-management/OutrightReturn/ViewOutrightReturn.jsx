import { Box } from "@mui/material";
import TransferOutFormHeader from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormHeader";
import { FormProvider, useForm } from "react-hook-form";
import TransferOutFormDetails from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormDetails";
import TransferOutItems from "../../../components/page-components/inventory-management/transfer-out/TransferOutItems";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferOutSchema } from "../../../schema/schema";
import { useGetAllTransferOutsQuery, useGetTransferOutByIdQuery } from "../../../features/inventory-management/api/transferOutApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import OutrightReturnFormHeader from "../../../components/page-components/inventory-management/outright-return/OutrightReturnFormHeader";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OutrightItems";

const ViewOutright = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(transferOutSchema.schema),
    defaultValues: transferOutSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetAllTransferOutsQuery({
    TransferOrderId: id,
    DateFrom: dateFrom,
    DateTo: dateTo,
  });

  console.log(data)
  
  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/transfer-out", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <OutrightReturnFormHeader />

      <FormProvider {...methods}>
        <OutrightItems items={data?.value?.to[0]?.transferItems || []} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewOutright;
