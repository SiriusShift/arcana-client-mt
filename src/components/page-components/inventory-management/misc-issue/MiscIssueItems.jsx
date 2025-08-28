import ItemsWithBBDForm from "../common/ItemsWithBBDForm";

const MiscIssueItems = ({ items = [], isFetching }) => {

  return (
    <ItemsWithBBDForm
      withBbd
      isTransferOut
      miscIssue
      items={items}
      isFetching={isFetching}
    />
  );
};

export default MiscIssueItems;
