import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const SamplingFormItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm items={items} isFetching={isFetching} />;
};

export default SamplingFormItems;
