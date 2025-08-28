import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  outrightReturnSchema,
  transferOutSchema,
} from "../../../schema/schema";
import ReturnToDepotFormHeader from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormHeader";
import ReturnToDepotItems from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotItems";
import ReturnToDepotFormActions from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormActions";
import ReturnToDepotFormDetails from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormDetails";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import { useState } from "react";

const ReturnToDepotForm = () => {

  const methods = useForm({
    resolver: yupResolver(outrightReturnSchema.schema),
    mode: "onChange",
    defaultValues: outrightReturnSchema.defaultValues,
  });

  const { formState: {isValid, errors} } = methods;

  console.log(errors);


  return (
    <Box className="commonPageLayout">
      <ReturnToDepotFormHeader />

      <FormProvider {...methods}>
        <ReturnToDepotFormDetails/>
        <ReturnToDepotItems/>

        <ReturnToDepotFormActions />
      </FormProvider>
    </Box>
  );
};

export default ReturnToDepotForm;
