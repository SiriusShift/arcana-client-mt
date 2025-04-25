import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscInSchema, outrightReturnSchema, transferOutSchema } from "../../../schema/schema";
import MiscReceiptFormHeader from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptFormHeader";
import MiscReceiptFormDetails from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptFormDetails";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OutrightFormActions";
import MiscReceiptFormActions from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptFormActions";
import MiscReceiptItems from "../../../components/page-components/inventory-management/misc-receipt/MiscReceiptItems";


const MiscInForm = () => {
  const methods = useForm({
    resolver: yupResolver(miscInSchema.schema),
    defaultValues: miscInSchema.defaultValues,
  });

  const { watch, formState : { errors} } = methods;

  console.log(watch(), errors);

  return (
    <Box className="commonPageLayout">
      <MiscReceiptFormHeader />

      <FormProvider {...methods}>
        <MiscReceiptFormDetails />
        <MiscReceiptItems />

        <MiscReceiptFormActions />
      </FormProvider>
    </Box>
  );
};

export default MiscInForm;
