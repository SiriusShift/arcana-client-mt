import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscInSchema, outrightReturnSchema, transferOutSchema } from "../../../schema/schema";
import MiscInFormHeader from "../../../components/page-components/inventory-management/misc-in/MiscInFormHeader";
import MiscInReturnFormDetails from "../../../components/page-components/inventory-management/misc-in/MiscInFormDetails";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OurightItems";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OuriteFormActions";
import MiscInFormActions from "../../../components/page-components/inventory-management/misc-in/MiscInFormActions";

const MiscInForm = () => {
  const methods = useForm({
    resolver: yupResolver(miscInSchema.schema),
    defaultValues: miscInSchema.defaultValues,
  });

  const { watch } = methods;

  console.log(watch());

  return (
    <Box className="commonPageLayout">
      <MiscInFormHeader />

      <FormProvider {...methods}>
        <MiscInReturnFormDetails />
        <OutrightItems />

        <MiscInFormActions />
      </FormProvider>
    </Box>
  );
};

export default MiscInForm;
