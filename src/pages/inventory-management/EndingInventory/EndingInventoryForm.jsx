import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { endingInventorySchema, freebiesSchema } from "../../../schema/schema";
import { Box } from "@mui/material";
import FreebiesFormHeader from "../../../components/page-components/inventory-management/freebies/FreebiesFormHeader";
import FreebiesFormDetails from "../../../components/page-components/inventory-management/freebies/FreebiesFormDetails";
import FreebiesFormItems from "../../../components/page-components/inventory-management/freebies/FreebiesFormItems";
import FreebiesFormActions from "../../../components/page-components/inventory-management/freebies/FreebiesFormActions";
import EndingInventoryFormHeader from "../../../components/page-components/inventory-management/ending-inventory/EndingInventoryFormHeader";
import EndingInventoryFormItems from "../../../components/page-components/inventory-management/ending-inventory/EndingInventoryFormItems";
import EndingInventoryFormSubmit from "../../../components/page-components/inventory-management/ending-inventory/EndingInventoryFormSubmit";
import { useGetInventoryForAdjustmentsQuery } from "../../../features/inventory-management/api/endingInventoryApi";

const EndingInventoryForm = () => {

  const methods = useForm({
    resolver: yupResolver(endingInventorySchema.schema),
    mode: "onChange",
    defaultValues: endingInventorySchema.defaultValues,
  });

  const {data, isFetching} = useGetInventoryForAdjustmentsQuery({
    PageSize: 10000,
    PageNumber: 1
  })

  const { watch, formState: {errors} } = methods;
  console.log(errors)

  return (
    <Box className="commonPageLayout">
      <EndingInventoryFormHeader  />

      <FormProvider {...methods}>
        {/* <FreebiesFormDetails /> */}

        <EndingInventoryFormItems items={data?.mo} isFetching={isFetching}/>

        <EndingInventoryFormSubmit />
      </FormProvider>
    </Box>
  );
};

export default EndingInventoryForm;
