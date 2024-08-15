import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const TransferOutItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm items={items} isFetching={isFetching} />;
};

export default TransferOutItems;
