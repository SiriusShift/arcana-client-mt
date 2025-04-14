import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscOutItems = ({ items = [], isFetching }) => {

  return (
    <ItemsWithBBDForm
      withBbd
      misc
      items={items}
      isFetching={isFetching}
    />
  );
};

export default MiscOutItems;
