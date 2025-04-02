import { Box } from "@mui/material";
import TransferOutFormHeader from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormHeader";
import TransferOutFormDetails from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormDetails";
import TransferOutItems from "../../../components/page-components/inventory-management/transfer-out/TransferOutItems";
import TransferOutFormActions from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormActions";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferOutSchema } from "../../../schema/schema";
import OutrightReturnFormHeader from "../../../components/page-components/inventory-management/outright-return/OutrightReturnFormHeader";
import OutrightReturnFormDetails from "../../../components/page-components/inventory-management/outright-return/OutrightReturnFormDetails";
import OutrightItems from "../../../components/page-components/inventory-management/outright-return/OutrightItems";
import OutrightFormActions from "../../../components/page-components/inventory-management/outright-return/OutrightFormActions";

const OutrightForm = () => {
  const methods = useForm({
    resolver: yupResolver(transferOutSchema.schema),
    defaultValues: transferOutSchema.defaultValues,
  });

  const { watch } = methods;

  console.log(watch());

  return (
    <Box className="commonPageLayout">
      <OutrightReturnFormHeader />

      <FormProvider {...methods}>
        <OutrightReturnFormDetails />

        <OutrightItems />

        <OutrightFormActions />
      </FormProvider>
    </Box>
  );
};

export default OutrightForm;
