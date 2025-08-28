import { Box } from "@mui/material";
import TransferOutFormHeader from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormHeader";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  outrightReturnSchema,
  transferOutSchema,
} from "../../../schema/schema";
import {
  useGetAllTransferOutsQuery,
  useGetTransferOutByIdQuery,
} from "../../../features/inventory-management/api/transferOutApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ReturnToDepotFormHeader from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormHeader";
import ReturnToDepotItems from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotItems";
import ReturnToDepotFormDetails from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormDetails";
import { useGetReturnToDepotQuery } from "../../../features/inventory-management/api/transferOutApi";
import { useGetSamplingReturnsQuery } from "../../../features/inventory-management/api/samplingApi";
import moment from "moment";
import ReturnSamplingFormHeader from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormHeader";
import ReturnSamplingFormDetails from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormDetails";
import ReturnSamplingFormItems from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormItems";

const ViewReturnToDepot = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(outrightReturnSchema.schema),
    defaultValues: outrightReturnSchema.defaultValues,
  });

  const { data, isFetching, isError } = useGetSamplingReturnsQuery({
    ReturnId: id,
    DateFrom: dateFrom ? moment(dateFrom).format("YYYY-MM-DD") : "",
    DateTo: dateTo ? moment(dateTo).format("YYYY-MM-DD") : "",
  });

  console.log(data);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/return-sampling", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <ReturnSamplingFormHeader />
      <FormProvider {...methods}>
        <ReturnSamplingFormDetails isFetching={isFetching} details={data?.data[0]} />
        <ReturnSamplingFormItems
          items={data?.data?.[0]?.items || []}
          isFetching={isFetching}
        />
      </FormProvider>
    </Box>
  );
};

export default ViewReturnToDepot;
