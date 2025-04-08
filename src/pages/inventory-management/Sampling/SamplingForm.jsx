import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { samplingSchema } from "../../../schema/schema";
import { Box } from "@mui/material";
import SamplingFormHeader from "../../../components/page-components/inventory-management/sampling/SamplingFormHeader";
import SamplingFormDetails from "../../../components/page-components/inventory-management/sampling/SamplingFormDetails";
import SamplingFormItems from "../../../components/page-components/inventory-management/sampling/SamplingFormItems";
import SamplingFormActions from "../../../components/page-components/inventory-management/sampling/SamplingFormActions";

const SamplingForm = () => {
  const methods = useForm({
    resolver: yupResolver(samplingSchema.schema),
    defaultValues: samplingSchema.defaultValues,
  });

  return (
    <Box className="commonPageLayout">
      <SamplingFormHeader />

      <FormProvider {...methods}>
        <SamplingFormDetails />

        <SamplingFormItems />

        <SamplingFormActions />
      </FormProvider>
    </Box>
  );
};

export default SamplingForm;
