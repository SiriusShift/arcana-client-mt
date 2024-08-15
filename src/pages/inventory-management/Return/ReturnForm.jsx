import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { returnSchema } from "../../../schema/schema";
import { Box } from "@mui/material";
import ReturnFormHeader from "../../../components/page-components/inventory-management/return/ReturnFormHeader";
import ReturnFormDetails from "../../../components/page-components/inventory-management/return/ReturnFormDetails";
import ReturnItems from "../../../components/page-components/inventory-management/return/ReturnItems";
import ReturnFormActions from "../../../components/page-components/inventory-management/return/ReturnFormActions";
import { useState } from "react";
import ReplaceItems from "../../../components/page-components/inventory-management/return/ReplaceItems";

const ReturnForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

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

  return (
    <Box className="commonPageLayout">
      <ReturnFormHeader StepProps={{ currentStep, steps }} />

      <FormProvider {...methods}>
        <ReturnFormDetails />

        {steps[currentStep].label === "Return" && <ReturnItems />}
        {steps[currentStep].label === "Replace" && <ReplaceItems />}

        <ReturnFormActions
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
