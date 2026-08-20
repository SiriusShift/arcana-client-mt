import { Box } from "@mui/material";
// import AdditionalDeliver from "../../../components/page-components/inventory-management/receiving/AdditionalDeliver";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllMoveOrderTransactionQuery } from "../../../features/sales-management/api/salesTransactionApi";
import TransactionFormHeader from "./TransactionFormHeader";
import TransactionFormSubmit from "./TransactionFormSubmit.jsx";
import TransactionItems from "./TransactionItems";

function TransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams()

  const { data: receivingData, isFetching } = useGetAllMoveOrderTransactionQuery({ moveOrderId: id });

  const [formData, setFormData] = useState({
    moveOrderId: Number(id),
    id: null,
    items: [],
    // wrong: [],
  });

  const [isFormValid, setIsFormValid] = useState({
    isItemsValid: false,
    // isWrongDeliverValid: false,
  });

  useEffect(() => {
    if (!receivingData && !isFetching) {
      navigate("/sales-management/sales-transaction");
    }
  }, [JSON.stringify(receivingData), navigate, isFetching]);

  if (!receivingData && !isFetching) {
    return null;
  }
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: receivingData?.mo?.[0]?.misInId,
      isVatable: receivingData?.mo?.[0]?.isVatable ?? false
    }))
  }, [isFetching, receivingData])


  console.log(formData)
  return (
    <>
      <Box className="commonPageLayout" sx={{ gap: "10px" }}>
        <TransactionFormHeader isFetching={isFetching} data={receivingData?.mo?.[0]} />

        <TransactionItems
          client={receivingData?.mo?.[0]}
          handleFormValid={setIsFormValid}
          handleFormData={setFormData}
          isFetching={isFetching}
        />

        {/* <WrongDeliver
        formData={formData}
        items={receivingData?.moItems}
        handleFormValid={setIsFormValid}
        handleFormData={setFormData}
      /> */}

        <TransactionFormSubmit
          formData={formData}
          data={receivingData?.mo?.[0]}
          isFormValid={isFormValid}
          handleFormData={setFormData}
          handleFormValid={setIsFormValid}
          isLoading={isFetching}
        />
      </Box>
    </>
  );
}

export default TransactionForm;
