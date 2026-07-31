import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const { data, isFetching, isUninitialized, isError } =
    useGetTransferInByIdQuery({
      Status: "For Receiving",
            TransferOrderId: id,
      DateFrom: dateFrom,
      DateTo: dateTo,
    });

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
      <TransferInFormHeader
        data={data?.to[0]}
        isFetching={isFetching || isUninitialized}
      />
      <TransferInItems items={data?.to[0]?.transferItems} isFetching={isFetching} />
    </Box>
  );
};

export default ViewTransferIn;
