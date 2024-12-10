import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ReceivingFormHeader from "../../../components/page-components/inventory-management/receiving/ReceivingFormHeader";
import ReceivingItems from "../../../components/page-components/inventory-management/receiving/ReceivingItems";
import WrongDeliver from "../../../components/page-components/inventory-management/receiving/WrongDeliver";
import { useEffect } from "react";
import { useLazyGetReceivedOrderByIdQuery } from "../../../features/inventory-management/api/receivingApi";

const ViewReceivingSkeleton = () => {
  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader isFetching />
      <ReceivingItems isFetching />
      <WrongDeliver isFetching />
    </Box>
  );
};

function ViewReceiving() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [triggerData, { data, isFetching, isUninitialized }] =
    useLazyGetReceivedOrderByIdQuery();

  useEffect(() => {
    const fetch = async () => {
      try {
        await triggerData({MoveOrderId: id}).unwrap();
      } catch (error) {
        navigate("/inventory-management/receiving", { replace: true });
      }
    };
    fetch();
  }, [id, navigate, triggerData]);

  if (!data || isFetching || isUninitialized) {
    return <ViewReceivingSkeleton />;
  }

  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader data={data.mo[0]} isFetching={isFetching} />

      <ReceivingItems items={data?.mo[0]?.moveItems} isFetching={isFetching} />

      <WrongDeliver wrongItems={data.wrongDeliver} isFetching={isFetching} />
    </Box>
  );
}

export default ViewReceiving;
