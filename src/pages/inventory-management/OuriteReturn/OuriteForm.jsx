import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { outrightReturnSchema, transferOutSchema } from "../../../schema/schema";
import OutrightReturnFormHeader from "../../../components/page-components/inventory-management/outright-return/OuriteReturnFormHeader";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OurightItems";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OuriteFormActions";
import OuriteFormDetails from "../../../components/page-components/inventory-management/outright-return/OuriteFormDetails";


const OuriteForm = () => {
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
        {/* <OuriteFormDetails /> */}
        <OutrightItems />

        <OutrightFormActions />
      </FormProvider>
    </Box>
  );
};

export default OuriteForm;
