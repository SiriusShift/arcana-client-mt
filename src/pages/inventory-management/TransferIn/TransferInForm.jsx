import { Box } from "@mui/material";
import TransferInFormHeader from "../../../components/page-components/inventory-management/transfer-in/TransferInFormHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetTransferInByIdQuery } from "../../../features/inventory-management/api/transferInApi";
import TransferInFormSubmit from "../../../components/page-components/inventory-management/transfer-in/TransferInFormSubmit";
import TransferInItems from "../../../components/page-components/inventory-management/transfer-in/TransferInItems";

const TransferInForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isFetching, isUninitialized, isError } =
    useGetTransferInByIdQuery(id);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/transfer-in", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <TransferInFormHeader
        data={data}
        isFetching={isFetching || isUninitialized}
      />

      <TransferInItems items={data?.items} isFetching={isFetching} />

      <TransferInFormSubmit />
    </Box>
  );
};

export default TransferInForm;
