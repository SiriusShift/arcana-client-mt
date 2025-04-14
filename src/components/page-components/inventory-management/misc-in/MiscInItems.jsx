import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscInItems = ({ items = [], isFetching }) => {
  return (
    <ItemsWithBBDForm
      withBbd
      misc
      items={items}
      isFetching={isFetching}
    />
  );
};

export default MiscInItems;
