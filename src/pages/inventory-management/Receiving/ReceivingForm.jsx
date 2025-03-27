import { Box } from "@mui/material";
import ReceivingFormHeader from "../../../components/page-components/inventory-management/receiving/ReceivingFormHeader";
import ReceivingItems from "../../../components/page-components/inventory-management/receiving/ReceivingItems";
// import AdditionalDeliver from "../../../components/page-components/inventory-management/receiving/AdditionalDeliver";
import { useSelector } from "react-redux";
import ReceivingFormSubmit from "../../../components/page-components/inventory-management/receiving/ReceivingFormSubmit";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGenerateMoveOrderQuery } from "../../../features/inventory-management/api/receivingApi";
import WrongDeliver from "../../../components/page-components/inventory-management/receiving/WrongDeliver";

function ReceivingForm() {
  const navigate = useNavigate();

  const moveOrderSlipNo = useSelector(
    (state) => state.generateReceiving.data?.moveOrderSlipNo
  );

  const [formData, setFormData] = useState({
    moveOrderId: Number(moveOrderSlipNo),
    items: [],
    // wrong: [],
  });

  console.log(formData);
  
  const [isFormValid, setIsFormValid] = useState({
    isItemsValid: false,
    // isWrongDeliverValid: false,
  });
  console.log(isFormValid);

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
    <Box className="commonPageLayout" sx={{ gap: "10px" }}>
      <ReceivingFormHeader data={receivingData} />

      <ReceivingItems
        items={receivingData?.moItems}
        handleFormValid={setIsFormValid}
        handleFormData={setFormData}
      />

      {/* <WrongDeliver
        formData={formData}
        items={receivingData?.moItems}
        handleFormValid={setIsFormValid}
        handleFormData={setFormData}
      /> */}

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
