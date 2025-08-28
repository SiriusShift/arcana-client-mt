import { Box } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReceivingFormHeader from "../../../components/page-components/inventory-management/receiving/ReceivingFormHeader";
import ReceivingItems from "../../../components/page-components/inventory-management/receiving/ReceivingItems";
import WrongDeliver from "../../../components/page-components/inventory-management/receiving/WrongDeliver";
import { useEffect, useMemo, useState } from "react";
import { useLazyGetReceivedOrderByIdQuery } from "../../../features/inventory-management/api/receivingApi";
import { filter, set } from "lodash";

const ViewReceivingSkeleton = () => {
  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader isFetching />
      <ReceivingItems isFetching />
    </Box>
  );
};

function ViewReceiving() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const navigate = useNavigate();

  const [triggerData, { data, isFetching, isUninitialized }] =
    useLazyGetReceivedOrderByIdQuery();

  const [formData, setFormData] = useState({
    moveOrderId: Number(id),
    items: [],
    // wrong: [],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        await triggerData({
          MoveOrderId: id,
          DateFrom: dateFrom,
          DateTo: dateTo,
        }).unwrap();
      } catch (error) {
        navigate("/inventory-management/receiving", { replace: true });
      }
    };

    fetch();
  }, [id, dateFrom, dateTo, navigate, triggerData]); // ✅ Ensure correct dependencies

  // ✅ Use `useMemo` to safely filter items without modifying state
  const { filteredItems,
    //  wrongDelivers

   } = useMemo(() => {
    const filteredItems = [];
    // const wrongDelivers = [];

    data?.mo?.[0]?.moveItems?.forEach((item) => {
      if (
        item?.quantity > 0 &&
        item?.actualQuantity === null &&
        item?.reason !== null
      ) {
        // setFormData((prev) => ({
        //   ...prev,
        //   wrong: [...prev.wrong, item],
        // }));
        // wrongDelivers.push(item);
      } else {
        setFormData((prev) => ({
          ...prev,
          items: [...prev.items, item],
        }))
        filteredItems.push(item);
      }
    });

    return { filteredItems, 
      // wrongDelivers 
    };
  }, [data]);

  // ✅ Prevent flickering with `isFetching && !data`
  if (isFetching && !data) {
    return <ViewReceivingSkeleton />;
  }

  return (
    <Box className="commonPageLayout">
      <ReceivingFormHeader data={data?.mo[0]} isFetching={isFetching} />

      <ReceivingItems items={formData.items} isFetching={isFetching} />
{/* 
      <WrongDeliver
        viewing={true}
        wrongItems={wrongDelivers}
        isFetching={isFetching}
        formData={formData}
      /> */}
    </Box>
  );
}

export default ViewReceiving;
