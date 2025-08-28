import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { endingInventorySchema, freebiesSchema } from "../../../schema/schema";
import { Box } from "@mui/material";
import EndingInventoryFormHeader from "../../../components/page-components/inventory-management/ending-inventory/EndingInventoryFormHeader";
import EndingInventoryFormItems from "../../../components/page-components/inventory-management/ending-inventory/EndingInventoryFormItems";
import EndingInventoryFormSubmit from "../../../components/page-components/inventory-management/ending-inventory/EndingInventoryFormSubmit";
import { useGetEndingInventoryHistoryQuery, useGetInventoryForAdjustmentsQuery } from "../../../features/inventory-management/api/endingInventoryApi";
import { useParams } from "react-router-dom";

const ViewEndingInventoryForm = () => {
  const {id} = useParams()
  const methods = useForm({
    resolver: yupResolver(endingInventorySchema.schema),
    mode: "onChange",
    defaultValues: endingInventorySchema.defaultValues,
  });

  const { data, isFetching } = useGetEndingInventoryHistoryQuery({
    AdjustmentId: id,
    PageSize: 1000,
    PageNumber: 1,
  });

  console.log(data)

  console.log(data)
  const {
    watch,
    formState: { errors },
  } = methods;
  console.log(errors);

  return (
    <Box className="commonPageLayout">
      <EndingInventoryFormHeader />

      <FormProvider {...methods}>
        {/* <FreebiesFormDetails /> */}

        <EndingInventoryFormItems items={data?.mo?.[0]?.miscItems} isFetching={isFetching} viewing />
      </FormProvider>
    </Box>
  );
};

export default ViewEndingInventoryForm;
