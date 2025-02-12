import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { returnSchema } from "../../../schema/schema";
import { Box } from "@mui/material";
import ReturnFormHeader from "../../../components/page-components/inventory-management/return/ReturnFormHeader";
import ReturnFormDetails from "../../../components/page-components/inventory-management/return/ReturnFormDetails";
import ReturnItems from "../../../components/page-components/inventory-management/return/ReturnItems";
import ReturnFormActions from "../../../components/page-components/inventory-management/return/ReturnFormActions";
import { useState } from "react";
import ReplaceItems from "../../../components/page-components/inventory-management/return/ReplaceItems";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ReturnForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);  
  const replace = Boolean(searchParams.get('replace'));

  const steps = [
    {
      value: 0,
      label: "Return",
    },
    {
      value: 1,
      label: "Replace",
    },
  ];

  const methods = useForm({
    resolver: yupResolver(returnSchema.schema),
    defaultValues: returnSchema.defaultValues,
  });
  console.log(currentStep);

  return (
    <Box className="commonPageLayout">
      <ReturnFormHeader replace={replace} StepProps={{ currentStep, steps }} />

      <FormProvider {...methods}>
        <ReturnFormDetails currentStep={currentStep} details={replace && selectedRowData} />

        {steps[currentStep].label === "Return" && (
          <ReturnItems
            items={(replace && selectedRowData?.returnItems) || []}
          />
        )}
        {steps[currentStep].label === "Replace" && <ReplaceItems />}

        <ReturnFormActions
          replace={replace}
          StepProps={{
            currentStep,
            setCurrentStep,
            steps,
          }}
        />
      </FormProvider>
    </Box>
  );
};

export default ReturnForm;
