import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const TransferOutItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm isTransferOut items={items} isFetching={isFetching} />;
};

export default TransferOutItems;
