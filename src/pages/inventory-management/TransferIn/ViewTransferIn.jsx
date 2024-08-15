import { useNavigate, useParams } from "react-router-dom";
import { useGetTransferInByIdQuery } from "../../../features/inventory-management/api/transferInApi";
import { useEffect } from "react";
import { Box } from "@mui/material";
import TransferInFormHeader from "../../../components/page-components/inventory-management/transfer-in/TransferInFormHeader";
import TransferInItems from "../../../components/page-components/inventory-management/transfer-in/TransferInItems";

const ViewTransferInSkeleton = () => {
  return (
    <Box className="commonPageLayout">
      <TransferInFormHeader isFetching />
      <TransferInItems isFetching forViewing />
    </Box>
  );
};

const ViewTransferIn = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isFetching, isUninitialized, isError } =
    useGetTransferInByIdQuery(id);

  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/transfer-in", { replace: true });
    }
  }, [isError, navigate]);

  if (!data || isFetching || isUninitialized) {
    return <ViewTransferInSkeleton />;
  }

  return (
    <Box className="commonPageLayout">
      <TransferInFormHeader data={data} />

      <TransferInItems items={data.items} forViewing />
    </Box>
  );
};

export default ViewTransferIn;
