import { Box } from "@mui/material";
import ReturnFormHeader from "../../../components/page-components/inventory-management/return/ReturnFormHeader";
import ReturnFormDetails from "../../../components/page-components/inventory-management/return/ReturnFormDetails";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { returnSchema } from "../../../schema/schema";
import { useGetAllReturnsQuery } from "../../../features/inventory-management/api/returnApi";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import ReturnItems from "../../../components/page-components/inventory-management/return/ReturnItems";
import ReplaceItems from "../../../components/page-components/inventory-management/return/ReplaceItems";

const ViewReturn = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const { data } = useGetAllReturnsQuery({
    ReturnId: id,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
  });

  console.log(data);

  const methods = useForm({
    resolver: yupResolver(returnSchema.schema),
    defaultValues: returnSchema.defaultValues,
  });

  return (
    <Box className="commonPageLayout">
      <ReturnFormHeader noStep />
      <FormProvider {...methods}>
        <ReturnFormDetails details={data?.to[0]} />
        <ReturnItems items={data?.to[0]?.returnItems}/>
        <ReplaceItems items={data?.to[0]?.replaceItems}/>
      </FormProvider>
    </Box>
  );
};

export default ViewReturn;
