import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscInItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm withBbd isTransferOut items={items} isFetching={isFetching} />;
};

export default MiscInItems;