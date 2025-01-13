import { useFormContext } from "react-hook-form";
import ItemsWithBBDPriceForm from "../common/ItemsWithBBDPriceForm";

const ReturnItems = ({items}) => {
  const {
    watch,
  } = useFormContext();

  console.log(watch());
  const itemsFieldName = "returnItems";
  const itemsFormTitle = "Return Items Form";

  return (
    <ItemsWithBBDPriceForm
      items={items}
      itemsFieldName={itemsFieldName}
      itemsFormTitle={itemsFormTitle}
    />
  );
};

export default ReturnItems;
