import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { outrightReturnSchema, transferOutSchema } from "../../../schema/schema";
import OutrightReturnFormHeader from "../../../components/page-components/inventory-management/outright-return/OutrightReturnFormHeader";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OutrightItems";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OutrightFormActions";

const OutrightForm = () => {
  const methods = useForm({
    resolver: yupResolver(outrightReturnSchema.schema),
    defaultValues: outrightReturnSchema.defaultValues,
  });

  const { watch } = methods;

  console.log(watch());

  return (
    <Box className="commonPageLayout">
      <OutrightReturnFormHeader />

      <FormProvider {...methods}>

        <OutrightItems />

        <OutrightFormActions />
      </FormProvider>
    </Box>
  );
};

export default OutrightForm;
