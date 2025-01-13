// useItemsWithBbd.js
import { useState, useEffect } from "react";
import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import { useGetAllItemsWithBbdQuery } from "../../features/inventory-management/api/inventoryApi";
import useConfirm from "../../hooks/useConfirm";
import moment from "moment";

const useItemsWithBbd = ({
  items = [],
  appendFields = {
    item: null,
    itemDescription: "",
    uom: "",
    quantity: null,
    bbd: null,
  },
  itemsFieldName = "items",
  persistGlobally = false,
}) => {
  const [bbdCache, setBbdCache] = useState(new Map());

  const confirm = useConfirm();

  const {
    control,
    setValue,
    formState: { dirtyFields, isValid },
    getFieldState,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: itemsFieldName,
  });

  const watchItems = useWatch({
    control,
    name: itemsFieldName,
  });

  const itemsFieldState = getFieldState(itemsFieldName);

  const { data: productData, isFetching: isItemsWithBBDFetching } =
    useGetAllItemsWithBbdQuery({
      PageSize: 2000,
      Page: 1,
    });

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
      if(itemsFieldName === "replaceItems" || itemsFieldName === "returnItems"){
        const newItems = items?.map((item) => {
          const momentBBD = item.bbd ? moment(item.bbd, "YYYY-MM-DD", true) : null;
          console.log(momentBBD);
      
          return {
            item: productData?.items?.find(
              (product) => product.itemCode === item.itemCode
            ),
            itemDescription: item.itemDescription,
            price: item.price,
            netPrice: item.net,
            uom: item.uom,
            quantity: item.quantity,
            bbd: momentBBD,
          };
        });
        setValue(itemsFieldName, newItems);
      }else{
        const newItems = items?.map((item) => ({
          item: productData?.items?.find(
            (product) => product.itemCode === item.itemCode
          ),
          itemDescription: item.itemDescription,
          uom: item.uom,
          quantity: item.quantity,
          bbd: { bbd: item.bbd },
        }));
        setValue("items", newItems); 
      }
    }
  }, [items, productData, setValue]);

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
  };
};

export default useItemsWithBbd;
