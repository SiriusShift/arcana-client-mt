import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import FreebiesFormHeader from "../../../components/page-components/inventory-management/freebies/FreebiesFormHeader";
import FreebiesFormDetails from "../../../components/page-components/inventory-management/freebies/FreebiesFormDetails";
import FreebiesFormItems from "../../../components/page-components/inventory-management/freebies/FreebiesFormItems";
import { yupResolver } from "@hookform/resolvers/yup";
import { freebiesSchema } from "../../../schema/schema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetAllFreebieRequestsQuery, useGetFreebieRequestByIdQuery } from "../../../features/inventory-management/api/freebiesApi";

const ViewFreebies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const methods = useForm({
    resolver: yupResolver(freebiesSchema.schema),
    defaultValues: freebiesSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetAllFreebieRequestsQuery({
    DateFrom: dateFrom,
    DateTo: dateTo,
    FreebieId: id,
    TransactionType: "Freebie",
  });
  console.log(data);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/freebies", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <FreebiesFormHeader />

      <FormProvider {...methods}>
        <FreebiesFormDetails details={data?.to[0]} isFetching={isFetching} />

        <FreebiesFormItems items={data?.to[0]?.freebieOrderItem} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewFreebies;
