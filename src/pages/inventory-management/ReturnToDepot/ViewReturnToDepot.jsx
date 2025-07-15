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

  const { data, isFetching, isError } = useGetReturnToDepotQuery({
    TransferOrderId: id,
    DateFrom: dateFrom,
    DateTo: dateTo,
  });

  console.log(data);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/return-to-depot", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <ReturnToDepotFormHeader />
      <FormProvider {...methods}>
        <ReturnToDepotFormDetails isFetching={isFetching} details={data?.value?.to[0]} />
        <ReturnToDepotItems
          items={data?.value?.to[0]?.transferItems || []}
          isFetching={isFetching}
        />
      </FormProvider>
    </Box>
  );
};

export default ViewReturnToDepot;
