import { Box } from "@mui/material";
import TransferOutFormHeader from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormHeader";
import { FormProvider, useForm } from "react-hook-form";
import TransferOutFormDetails from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormDetails";
import TransferOutItems from "../../../components/page-components/inventory-management/transfer-out/TransferOutItems";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscOutSchema, transferOutSchema } from "../../../schema/schema";
import { useGetAllTransferOutsQuery, useGetTransferOutByIdQuery } from "../../../features/inventory-management/api/transferOutApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import MiscIssueItems from "../../../components/page-components/inventory-management/misc-issue/MiscIssueItems";
import moment from "moment";
import MiscIssueFormHeader from "../../../components/page-components/inventory-management/misc-issue/MiscIssueFormHeader";
import { useGetMiscIssueQuery } from "../../../features/inventory-management/api/miscApi";
import MiscIssueFormDetails from "../../../components/page-components/inventory-management/misc-issue/MiscIssueFormDetails";

const ViewMiscIssue = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(miscOutSchema.schema),
    defaultValues: miscOutSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetMiscIssueQuery({
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
    MiscOutId: id,
  });

  console.log(data)
  
  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/miscellaneous-issue", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <MiscIssueFormHeader />

      <FormProvider {...methods}>
        <MiscIssueFormDetails details={data?.value?.mo[0]}/>
        <MiscIssueItems items={data?.value?.mo[0]?.misceOutItems || []} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewMiscIssue;
