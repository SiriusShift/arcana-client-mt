import { Box } from "@mui/material";
import TransferOutFormHeader from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormHeader";
import TransferOutFormDetails from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormDetails";
import TransferOutItems from "../../../components/page-components/inventory-management/transfer-out/TransferOutItems";
import TransferOutFormActions from "../../../components/page-components/inventory-management/transfer-out/TransferOutFormActions";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferOutSchema } from "../../../schema/schema";

const TransferOutForm = () => {
  const methods = useForm({
    resolver: yupResolver(transferOutSchema.schema),
    defaultValues: transferOutSchema.defaultValues,
  });

  return (
    <Box className="commonPageLayout">
      <TransferOutFormHeader />

      <FormProvider {...methods}>
        <TransferOutFormDetails />

        <TransferOutItems />

        <TransferOutFormActions />
      </FormProvider>
    </Box>
  );
};

export default TransferOutForm;
