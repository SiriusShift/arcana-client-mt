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
import OutrightReturnFormHeader from "../../../components/page-components/inventory-management/outright-return/OuriteReturnFormHeader";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OurightItems";
import MiscInFormHeader from "../../../components/page-components/inventory-management/misc-in/MiscInFormHeader";
import MiscInFormDetails from "../../../components/page-components/inventory-management/misc-in/MiscInFormDetails";
import MiscInItems from "../../../components/page-components/inventory-management/misc-in/MiscInItems";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import moment from "moment";

const ViewMiscIn = () => {
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
  });

  console.log(data)
  
  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/miscellaneous-in", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <MiscInFormHeader />

      <FormProvider {...methods}>
        <MiscInFormDetails />
        <MiscInItems items={data?.value?.mo[0]?.moveItems || []} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewMiscIn;
