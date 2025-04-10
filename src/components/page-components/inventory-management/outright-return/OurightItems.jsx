import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const OuriteItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm withBbd isTransferOut items={items} isFetching={isFetching} />;
};

export default OuriteItems;
