import ItemsWithBBDPriceForm from "../common/ItemsWithBBDPriceForm";

const ReplaceItems = ({ items }) => {
  const itemsFieldName = "replaceItems";
  const itemsFormTitle = "Replacement Items Form";

  return (
    <ItemsWithBBDPriceForm
      items={items}
      itemsFieldName={itemsFieldName}
      itemsFormTitle={itemsFormTitle}
    />
  );
};

export default ReplaceItems;
