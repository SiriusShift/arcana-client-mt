import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscReceiptItems = ({ items = [], isFetching }) => {
  return (
    <ItemsWithBBDForm
      misc
      items={items}
      isFetching={isFetching}
    />
  );
};

export default MiscReceiptItems;
