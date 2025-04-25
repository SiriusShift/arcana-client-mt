import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscIssueItems = ({ items = [], isFetching }) => {

  return (
    <ItemsWithBBDForm
      // withBbd
      misc
      items={items}
      isFetching={isFetching}
    />
  );
};

export default MiscIssueItems;
