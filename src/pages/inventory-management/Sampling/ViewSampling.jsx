import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import SamplingFormHeader from "../../../components/page-components/inventory-management/sampling/SamplingFormHeader";
import SamplingFormDetails from "../../../components/page-components/inventory-management/sampling/SamplingFormDetails";
import SamplingFormItems from "../../../components/page-components/inventory-management/sampling/SamplingFormItems";
import { yupResolver } from "@hookform/resolvers/yup";
import { samplingSchema } from "../../../schema/schema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetAllSamplingsQuery, useGetSamplingByIdQuery } from "../../../features/inventory-management/api/samplingApi";

const ViewSampling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
  
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

  const methods = useForm({
    resolver: yupResolver(samplingSchema.schema),
    defaultValues: samplingSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetAllSamplingsQuery({
    DateFrom: dateFrom,
    DateTo: dateTo,
    FreebieId: id,
    TransactionType: "Sampling",
  });

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/sampling", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <SamplingFormHeader />

      <FormProvider {...methods}>
        <SamplingFormDetails details={data?.to[0]} isFetching={isFetching} />

        <SamplingFormItems items={data?.to[0]?.freebieOrderItem} isFetching={isFetching} />
      </FormProvider>
    </Box>
  );
};

export default ViewSampling;
