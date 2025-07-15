import { useGetAllReceivedOrdersQuery } from "../../../../features/inventory-management/api/receivingApi";
import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const OutrightItems = ({ items = [],  isFetching }) => {

  return (
    <ItemsWithBBDForm
      // outrightData={data}
      withReason
      withBbd
      isTransferOut
      items={items}
      isFetching={isFetching}
    />
  );
};

export default OutrightItems;
