import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscReceiptItems = ({ items = [], isFetching }) => {
  return (
    <ItemsWithBBDForm
      withBbd
      isTransferOut
      misc
      items={items}
      isFetching={isFetching}
    />
  );
};

export default MiscReceiptItems;
