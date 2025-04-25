import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferOutSchema } from "../../../schema/schema";
import { useGetAllTransferOutsQuery, useGetTransferOutByIdQuery } from "../../../features/inventory-management/api/transferOutApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import OutrightReturnFormHeader from "../../../components/page-components/inventory-management/outright-return/OutrightReturnFormHeader";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OutrightItems";
import MiscReceiptFormHeader from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptFormHeader";
import MiscReceiptItems from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptItems";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import moment from "moment";

const ViewMiscReceipt = () => {
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

  const { data, isFetching, isError } = useGetAllReceivedOrdersQuery({
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    MiscInId: id,
    IsMiscellaneousIn: true
  });

  console.log(data)
  
  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/miscellaneous-in", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <MiscReceiptFormHeader />

      <FormProvider {...methods}>
        <MiscReceiptItems items={data?.value?.mo[0]?.moveItems || []} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewMiscReceipt;
