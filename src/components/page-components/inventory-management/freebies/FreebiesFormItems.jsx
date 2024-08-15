import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const FreebiesFormItems = ({ items = [], isFetching }) => {
  return <ItemsWithBBDForm items={items} isFetching={isFetching} />;
};

export default FreebiesFormItems;
