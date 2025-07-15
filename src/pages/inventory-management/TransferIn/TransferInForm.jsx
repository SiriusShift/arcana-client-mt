import { Box } from "@mui/material";
import TransferInFormHeader from "../../../components/page-components/inventory-management/transfer-in/TransferInFormHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetTransferInByIdQuery } from "../../../features/inventory-management/api/transferInApi";
import TransferInFormSubmit from "../../../components/page-components/inventory-management/transfer-in/TransferInFormSubmit";
import TransferInItems from "../../../components/page-components/inventory-management/transfer-in/TransferInItems";

const TransferInForm = () => {
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
    console.log(data);
  


  useEffect(() => {
    if (isError) {
      navigate("/inventory-management/transfer-in", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <Box className="commonPageLayout">
      <TransferInFormHeader
        data={data?.to[0]}
        isFetching={isFetching || isUninitialized}
      />

      <TransferInItems items={data?.to[0].transferItems} isFetching={isFetching} />

      <TransferInFormSubmit />
    </Box>
  );
};

export default TransferInForm;
