import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { freebiesSchema } from "../../../schema/schema";
import { Box } from "@mui/material";
import FreebiesFormHeader from "../../../components/page-components/inventory-management/freebies/FreebiesFormHeader";
import FreebiesFormDetails from "../../../components/page-components/inventory-management/freebies/FreebiesFormDetails";
import FreebiesFormItems from "../../../components/page-components/inventory-management/freebies/FreebiesFormItems";
import FreebiesFormActions from "../../../components/page-components/inventory-management/freebies/FreebiesFormActions";

const FreebiesForm = () => {
  const methods = useForm({
    resolver: yupResolver(freebiesSchema.schema),
    defaultValues: freebiesSchema.defaultValues,
  });

  return (
    <Box className="commonPageLayout">
      <FreebiesFormHeader />

      <FormProvider {...methods}>
        <FreebiesFormDetails />

        <FreebiesFormItems />

        <FreebiesFormActions />
      </FormProvider>
    </Box>
  );
};

export default FreebiesForm;
