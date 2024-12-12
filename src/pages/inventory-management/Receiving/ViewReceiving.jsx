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
  const items = []
  const wrongDelivers = []
  const navigate = useNavigate();

  const [triggerData, { data, isFetching, isUninitialized }] =
    useLazyGetReceivedOrderByIdQuery();

  console.log("data",data);

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

  data?.mo[0]?.moveItems?.map((item, index) => {
    console.log("items", item, "index:", index);
    if(item?.reason === null){
      items.push(item);
    }
    else{
      wrongDelivers.push(item);
    }
  })
  console.log(items);

  if (!data || isFetching || isUninitialized) {
    return <ViewReceivingSkeleton />;
  }

  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader data={data.mo[0]} isFetching={isFetching} />

      <ReceivingItems items={items} isFetching={isFetching} />

      <WrongDeliver viewing={true} wrongItems={wrongDelivers} isFetching={isFetching} />
    </Box>
  );
}

export default ViewReceiving;
