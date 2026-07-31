import { Box } from "@mui/material";
import ReceivingFormHeader from "../../../components/page-components/inventory-management/receiving/ReceivingFormHeader";
import ReceivingItems from "../../../components/page-components/inventory-management/receiving/ReceivingItems";
// import AdditionalDeliver from "../../../components/page-components/inventory-management/receiving/AdditionalDeliver";
import { useSelector } from "react-redux";
import ReceivingFormSubmit from "../../../components/page-components/inventory-management/receiving/ReceivingFormSubmit";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGenerateMoveOrderQuery } from "../../../features/inventory-management/api/receivingApi";
import WrongDeliver from "../../../components/page-components/inventory-management/receiving/WrongDeliver";
import { useGetAllMoveOrderTransactionQuery, useGetAllSalesTransactionQuery } from "../../../features/sales-management/api/salesTransactionApi";
import TransactionFormHeader from "./TransactionFormHeader";
import TransactionItems from "./TransactionItems";
import CashoutModal from "../../../components/modals/sales-management/CashoutModal.jsx";
import useDisclosure from "../../../hooks/useDisclosure";
import TransactionFormSubmit from "./TransactionFormSubmit.jsx";

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
      id: receivingData?.mo?.[0]?.misInId
    }))
  }, [isFetching, receivingData])

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
