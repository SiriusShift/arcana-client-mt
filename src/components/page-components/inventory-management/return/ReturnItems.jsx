import ItemsWithBBDPriceForm from "../common/ItemsWithBBDPriceForm";

const ReturnItems = () => {
  const itemsFieldName = "returnItems";
  const itemsFormTitle = "Return Items Form";

  return (
    <ItemsWithBBDPriceForm
      itemsFieldName={itemsFieldName}
      itemsFormTitle={itemsFormTitle}
    />
  );
};

export default ReturnItems;
