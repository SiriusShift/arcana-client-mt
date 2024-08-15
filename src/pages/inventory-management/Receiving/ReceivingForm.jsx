import { Box } from "@mui/material";
import ReceivingFormHeader from "../../../components/page-components/inventory-management/receiving/ReceivingFormHeader";
import ReceivingItems from "../../../components/page-components/inventory-management/receiving/ReceivingItems";
import WrongDeliver from "../../../components/page-components/inventory-management/receiving/WrongDeliver";
import { useSelector } from "react-redux";
import ReceivingFormSubmit from "../../../components/page-components/inventory-management/receiving/ReceivingFormSubmit";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGenerateMoveOrderQuery } from "../../../features/inventory-management/api/receivingApi";

function ReceivingForm() {
  const navigate = useNavigate();

  const moveOrderSlipNo = useSelector(
    (state) => state.generateReceiving.data?.moveOrderSlipNo
  );

  const [formData, setFormData] = useState({
    moveOrderId: Number(moveOrderSlipNo),
    items: [],
    wrongDeliver: [],
  });
  const [isFormValid, setIsFormValid] = useState({
    isItemsValid: false,
    isWrongDeliverValid: false,
  });

  const { data: receivingData } = useGenerateMoveOrderQuery(moveOrderSlipNo);

  useEffect(() => {
    if (!receivingData) {
      navigate("/inventory-management/receiving");
    }
  }, [receivingData, navigate]);

  if (!receivingData) {
    return null;
  }

  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader data={receivingData} />

      <ReceivingItems
        items={receivingData?.items}
        handleFormValid={setIsFormValid}
        handleFormData={setFormData}
      />

      <WrongDeliver
        items={receivingData?.items}
        handleFormValid={setIsFormValid}
        handleFormData={setFormData}
      />

      <ReceivingFormSubmit
        formData={formData}
        isFormValid={isFormValid}
        handleFormData={setFormData}
        handleFormValid={setIsFormValid}
      />
    </Box>
  );
}

export default ReceivingForm;
