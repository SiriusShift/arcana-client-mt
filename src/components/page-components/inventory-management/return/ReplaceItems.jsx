import ItemsWithBBDPriceForm from "../common/ItemsWithBBDPriceForm";

const ReplaceItems = () => {
  const itemsFieldName = "replaceItems";
  const itemsFormTitle = "Replacement Items Form";

  return (
    <ItemsWithBBDPriceForm
      itemsFieldName={itemsFieldName}
      itemsFormTitle={itemsFormTitle}
    />
  );
};

export default ReplaceItems;
