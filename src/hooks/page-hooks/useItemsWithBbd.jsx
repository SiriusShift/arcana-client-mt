// useItemsWithBbd.js
import { useState, useEffect } from "react";
import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import { useGetAllItemsWithBbdQuery } from "../../features/inventory-management/api/inventoryApi";
import useConfirm from "../useConfirm";
import moment from "moment";
import { useGetAllItemsByPriceModeIdQuery } from "../../features/setup/api/priceModeItemsApi";
import { useGetAllItemsInventoryQuery } from "../../features/inventory-management/api/inventoryMrpApi";
import { useGetReasonsQuery } from "../../features/inventory-management/api/reasonApi";
import { useGetAllReceivedOrdersQuery } from "../../features/inventory-management/api/receivingApi";

const useItemsWithBbd = ({
  items = [],
  appendFields = {
    item: null,
    itemDescription: "",
    uom: "",
    quantity: null,
    bbd: null,
    reason: "",
  },
  itemsFieldName = "items",
  persistGlobally = false,
}) => {
  const [bbdCache, setBbdCache] = useState(new Map());

  const confirm = useConfirm();

  const {
    control,
    setValue,
    formState: { dirtyFields, isValid, errors },
    getFieldState,
    watch,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: itemsFieldName,
  });

  const watchItems =
    useWatch({
      control,
      name: itemsFieldName,
    }) || [];

  const itemsFieldState = getFieldState(itemsFieldName);

  const { data: productData, isFetching: isItemsWithBBDFetching } =
    useGetAllItemsInventoryQuery();

  // const { data: mo, isLoading } = useGetAllReceivedOrdersQuery({
  //   PageSize: 1000,
  // }, {
  //   skip: !watch("type")
  // });

  // console.log(mo)

  const {
    data,
    // isFetching: isFetchingReason,
    // error,
  } = useGetReasonsQuery(
    {
      isActive: true,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  let transformedItems = items?.map((item) => {
    console.log("testing123", item);
    // const momentBBD = item.bbd
    //   ? moment(item.bbd, "YYYY-MM-DD", true)
    //   : null;

    return {
      item: productData?.find((product) => product.itemCode === item.itemCode),
      itemDescription: item.itemDescription,
      price: item.price,
      netPrice: item.net,
      uom: item.uom,
      quantity: item.quantity,
      bbd: item.bbd,
      reason: item.reason,
      // remarks: item.remarks
    };
  });

  console.log(items);

  const handleAddItem = () => {
    append(appendFields);
  };

  const handleRemove = (index) => {
    const item = watchItems[index];

    if (item?.item) {
      setBbdCache((prev) => {
        const newCache = new Map(prev);
        const bbdMap = newCache.get(item.item.itemCode) || new Map();

        if (bbdMap.has(item?.bbd?.bbd)) {
          bbdMap.delete(item.bbd.bbd);
        }

        if (bbdMap.size === 0) {
          newCache.delete(item.item.itemCode);
        }

        return newCache;
      });
    }

    remove(index);
  };

  const handleRemoveAll = async () => {
    try {
      await confirm({
        children: "Are you sure you want to clear all items?",
        question: false,
      });

      setBbdCache(new Map());

      remove();
    } catch {
      // No action needed on error
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      if (
        itemsFieldName === "replaceItems" ||
        itemsFieldName === "returnItems"
      ) {
        const isDirty =
          dirtyFields?.[itemsFieldName] &&
          Object.keys(dirtyFields[itemsFieldName]).length > 0;

        if (isDirty) {
          console.log("Skipping update: User has edited returnItems.");
          return;
        }

        const newItems = items.map((item) => ({
          item: productData?.find(
            (product) => product.itemCode === item.itemCode
          ),
          itemDescription: item.itemDescription,
          price: item.price,
          netPrice: item.net,
          uom: item.uom,
          quantity: item.quantity,
          bbd: item.bbd,
          reason: item.reason ?? "",
        }));

        setValue(itemsFieldName, newItems);
      } else if (watch("type")?.value === "Outright") {
        console.log("data outright", data, items);
        const newItems = items.map((item) => ({
          item: item,
          itemDescription: item.itemDescription,
          uom: item.uom,
          // price: item.amount,
          received: watch("moveOrder")?.moveItems.find(
            (moveItem) => moveItem.itemCode === item.itemCode).actualQuantity,
          quantity: item.quantity,
          bbd: item.bbd,
          reason: item.reason,
          remarks: data?.find((reason) => reason.id === item.reasonId),
        }));

        setValue("items", newItems);
      } else if (watch("type") === "Return Sampling") {
        console.log("data outright", data, items);
        const newItems = items.map((item) => ({
          item: item,
          itemDescription: item.itemDescription,
          uom: item.uom,
          // price: item.amount,
          released: watch("freebieOrderId")?.freebieOrderItem.find(
            (moveItem) => moveItem.itemCode === item.itemCode).quantity,
          quantity: item.quantity,
          // bbd: item.bbd,
          reason: item.reason,
          remarks: data?.find((reason) => reason.id === item.reasonId),
        }));

        setValue("items", newItems);
      } else {
        console.log("test!")
        const newItems = items.map((item) => ({
          item: item,
          itemDescription: item.itemDescription,
          uom: item.uom,
          price: item.amount,
          quantity: item.quantity,
          bbd: item.bbd,
          reason: item.reason,
          ...(data && { remarks: data?.find((reason) => reason.id === item.reasonId) }),
        }));

        setValue("items", newItems);
      }
    }
  }, [JSON.stringify(items), productData, setValue, dirtyFields, itemsFieldName]);

  return {
    bbdCache,
    setBbdCache,
    fields,
    handleAddItem,
    handleRemove,
    handleRemoveAll,
    watchItems,
    productData,
    isItemsWithBBDFetching,
    dirtyFields,
    setValue,
    control,
    itemsFieldState,
    isValid,
    errors,
  };
};

export default useItemsWithBbd;
