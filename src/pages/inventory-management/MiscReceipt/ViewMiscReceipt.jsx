import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscInSchema, transferOutSchema } from "../../../schema/schema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import MiscReceiptFormHeader from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptFormHeader";
import MiscReceiptItems from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptItems";
import MiscReceiptFormDetails from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptFormDetails";
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
    resolver: yupResolver(miscInSchema.schema),
    defaultValues: miscInSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetAllReceivedOrdersQuery({
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    MiscInId: id,
    IsMiscellaneousIn: true
  });

  console.log(methods.watch())
  
  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/miscellaneous-in", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <MiscReceiptFormHeader />

      <FormProvider {...methods}>
        <MiscReceiptFormDetails details={data?.value?.mo[0]}/>
        <MiscReceiptItems items={data?.value?.mo[0]?.moveItems || []} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewMiscReceipt;
