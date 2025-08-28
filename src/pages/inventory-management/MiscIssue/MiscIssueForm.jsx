import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { miscOutSchema } from "../../../schema/schema";
import MiscIssueFormHeader from "../../../components/page-components/inventory-management/misc-issue/MiscIssueFormHeader";
import MiscIssueFormDetails from "../../../components/page-components/inventory-management/misc-issue/MiscIssueFormDetails";
import MiscIssueItems from "../../../components/page-components/inventory-management/misc-issue/MiscIssueItems";
import MiscIssueFormActions from "../../../components/page-components/inventory-management/misc-issue/MiscIssueFormActions";


const MiscIssueForm = () => {
  const methods = useForm({
    resolver: yupResolver(miscOutSchema.schema),
    defaultValues: miscOutSchema.defaultValues,
  });

  const { watch } = methods;

  console.log(watch());

  return (
    <Box className="commonPageLayout">
      <MiscIssueFormHeader />

      <FormProvider {...methods}>
        <MiscIssueFormDetails />
        <MiscIssueItems />
        <MiscIssueFormActions />
      </FormProvider>
    </Box>
  );
};

export default MiscIssueForm;
