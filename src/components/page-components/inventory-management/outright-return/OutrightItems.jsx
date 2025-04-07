import ItemsWithBBDPriceForm from "../common/ItemsWithBBDPriceForm";

const OutrightItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDPriceForm items={items} isFetching={isFetching} />;
};

export default OutrightItems;
