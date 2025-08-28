import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  outrightReturnSchema,
  returnSamplingSchema,
  transferOutSchema,
} from "../../../schema/schema";
import ReturnToDepotFormHeader from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormHeader";
import ReturnToDepotItems from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotItems";
import ReturnToDepotFormActions from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormActions";
import ReturnToDepotFormDetails from "../../../components/page-components/inventory-management/return-to-depot/ReturnToDepotFormDetails";
import { useGetAllReceivedOrdersQuery } from "../../../features/inventory-management/api/receivingApi";
import { useState } from "react";
import ReturnSamplingFormHeader from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormHeader";
import ReturnSamplingFormDetails from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormDetails";
import ReturnSamplingFormItems from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormItems";
import ReturnSamplingFormActions from "../../../components/page-components/inventory-management/return-from-sampling/ReturnSamplingFormActions";

const ReturnSamplingForm = () => {

  const methods = useForm({
    resolver: yupResolver(returnSamplingSchema.schema),
    mode: "onChange",
    defaultValues: returnSamplingSchema.defaultValues,
  });

  const { formState: {isValid, errors} } = methods;

  console.log(errors);


  return (
    <Box className="commonPageLayout">
      <ReturnSamplingFormHeader />

      <FormProvider {...methods}>
        <ReturnSamplingFormDetails/>
        <ReturnSamplingFormItems/>

        <ReturnSamplingFormActions />
      </FormProvider>
    </Box>
  );
};

export default ReturnSamplingForm;