import { useGetAllReceivedOrdersQuery } from "../../../../features/inventory-management/api/receivingApi";
import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const ReturnSamplingFormItems = ({ items = [],  isFetching }) => {

  return (
    <ItemsWithBBDForm
      // outrightData={data}
      withReason
    //   withBbd
      items={items}
      isFetching={isFetching}
    />
  );
};

export default ReturnSamplingFormItems;
