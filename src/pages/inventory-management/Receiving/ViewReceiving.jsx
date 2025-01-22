import { Box } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReceivingFormHeader from "../../../components/page-components/inventory-management/receiving/ReceivingFormHeader";
import ReceivingItems from "../../../components/page-components/inventory-management/receiving/ReceivingItems";
import WrongDeliver from "../../../components/page-components/inventory-management/receiving/WrongDeliver";
import { useEffect } from "react";
import { useLazyGetReceivedOrderByIdQuery, useLazyGetWrongItemsQuery } from "../../../features/inventory-management/api/receivingApi";

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const items = [];
  const wrongDelivers = [];
  const navigate = useNavigate();

  const [triggerData, { data, isFetching, isUninitialized }] =
    useLazyGetReceivedOrderByIdQuery();
  
  const [triggerWrong, { data: wrongData, isFetching: wrongFetching}] = useLazyGetWrongItemsQuery();

  console.log("data", data);

  useEffect(() => {
    const fetch = async () => {
      try {
        await triggerData({ MoveOrderId: id, DateFrom: dateFrom, DateTo: dateTo }).unwrap();
      } catch (error) {
        navigate("/inventory-management/receiving", { replace: true });
      }
    };
    fetch();
  }, [id, navigate, triggerData]);

  data?.mo[0]?.moveItems?.map((item, index) => {
    console.log("items", item, "index:", index);
  
    // If quantity > 0, actualQuantity is null, and reason is not null
    if (item?.quantity > 0 && item?.actualQuantity === null && item?.reason !== null) {
      wrongDelivers.push(item);
    } else {
      items.push(item);
    }
  });
  
  console.log("Items:", items);
  console.log("Wrong Delivers:", wrongDelivers);
  

  if (!data || isFetching || isUninitialized) {
    return <ViewReceivingSkeleton />;
  }

  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader data={data.mo[0]} isFetching={isFetching} />

      <ReceivingItems items={items} isFetching={isFetching} />

      <WrongDeliver
        viewing={true}
        wrongItems={wrongDelivers}
        isFetching={isFetching}
      />
    </Box>
  );
}

export default ViewReceiving;
