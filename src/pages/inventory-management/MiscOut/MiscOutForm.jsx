import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscInSchema, miscOutSchema } from "../../../schema/schema";
import MiscOutFormHeader from "../../../components/page-components/inventory-management/misc-out/MiscOutFormHeader";
import MiscOutFormDetails from "../../../components/page-components/inventory-management/misc-out/MiscOutFormDetails";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OutrightItems";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OutrightFormActions";
import MiscInFormActions from "../../../components/page-components/inventory-management/misc-in/MiscInFormActions";

const MiscOutForm = () => {
  const methods = useForm({
    resolver: yupResolver(miscOutSchema.schema),
    defaultValues: miscOutSchema.defaultValues,
  });

  const { watch } = methods;

  console.log(watch());

  return (
    <Box className="commonPageLayout">
      <MiscOutFormHeader />

      <FormProvider {...methods}>
        <MiscOutFormDetails />
        <OutrightItems />

        <MiscInFormActions />
      </FormProvider>
    </Box>
  );
};

export default MiscOutForm;
