import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscInSchema, miscOutSchema } from "../../../schema/schema";
import MiscOutFormHeader from "../../../components/page-components/inventory-management/misc-out/MiscOutFormHeader";
import MiscOutFormDetails from "../../../components/page-components/inventory-management/misc-out/MiscOutFormDetails";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OurightItems";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OuriteFormActions";
import MiscInFormActions from "../../../components/page-components/inventory-management/misc-in/MiscInFormActions";
import MiscOutItems from "../../../components/page-components/inventory-management/misc-out/MiscOutItems";
import MiscOutFormActions from "../../../components/page-components/inventory-management/misc-out/MiscOutFormActions";


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
        <MiscOutItems />
        <MiscOutFormActions />
      </FormProvider>
    </Box>
  );
};

export default MiscOutForm;
