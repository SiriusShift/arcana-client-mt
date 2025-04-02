import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const OutrightItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm isTransferOut items={items} isFetching={isFetching} />;
};

export default OutrightItems;
