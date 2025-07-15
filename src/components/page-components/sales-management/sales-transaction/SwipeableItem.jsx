import { Add, Check, Close, Remove } from "@mui/icons-material";
import { Box, IconButton, Popover, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import useDisclosure from "../../../../hooks/useDisclosure";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../../../hooks/useSnackbar";
import { filter } from "lodash";

function SwipeableItem({
  remove,
  setValue,
  orderItem,
  onMinus,
  onPlus,
  onSwipeLeft,
  totalAmount,
  watch,
  creditBalance
}) {
  console.log(watch.items);
  const [isSwiped, setIsSwiped] = useState(false);
  const [quantity, setQuantity] = useState(orderItem.quantity);

  const anchorRef = useRef();
  const quantityRef = useRef();
  const snackbar = useSnackbar();

  //Disclosures
  const {
    isOpen: isQuantityOpen,
    onOpen: onQuantityOpen,
    onClose: onQuantityClose,
  } = useDisclosure();

  //React Swipeable
  const swipeable = useSwipeable({
    onSwipedLeft: () => {
      if (isQuantityOpen) {
        return;
      } else {
        setIsSwiped(true);
        setTimeout(async () => {
          try {
            await onSwipeLeft();
          } finally {
            setIsSwiped(false);
          }
        }, [500]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  //Functions
  const handleQuantitySubmit = (e) => {
    e.preventDefault();
    quantity === 0 ? remove() : setValue(quantity);
    handleQuantiyClose();
  };

  const handleQuantiyClose = () => {
    setQuantity(orderItem.quantity);
    onQuantityClose();
  };

  useEffect(() => {
    if (isQuantityOpen) {
      setTimeout(() => {
        quantityRef.current.select();
      }, 0);
    }
  }, [isQuantityOpen]);

  return (
    <Box
      {...swipeable}
      className={`salesTransaction__body__orderDetails__itemsList__item ${
        isSwiped ? "swiped" : ""
      }`}
      data-tour="order-item"
    >
      <Box>
        {/* <Tooltip
          title={orderItem.itemId?.itemDescription}
          sx={{ cursor: "pointer" }}
        > */}
        <Box className="salesTransaction__body__orderDetails__itemsList__item__labels">
          <Typography fontSize="1rem" color="gray">
            {orderItem.itemId?.itemDescription}
          </Typography>

          {/* <Typography fontSize="1rem" color="gray">
              {orderItem.itemId?.itemDescription}
            </Typography> */}

          {/* <Info fontSize="" sx={{ color: "gray" }} /> */}
        </Box>
        {/* </Tooltip> */}

        <Typography
          fontSize="1rem"
          fontWeight="600"
          whiteSpace="nowrap"
          sx={{ cursor: "default" }}
        >
          ₱
          {(orderItem.itemId?.currentPrice * orderItem.quantity).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </Typography>
      </Box>

      <Box className="salesTransaction__body__orderDetails__itemsList__item__right">
        <IconButton color="warning" onClick={onMinus}>
          <Remove />
        </IconButton>

        <Typography
          sx={{ cursor: "pointer" }}
          onClick={() => {
            onQuantityOpen();
          }}
          ref={anchorRef}
        >
          {orderItem.quantity.toLocaleString()}
        </Typography>

        <Popover
          open={isQuantityOpen}
          anchorEl={anchorRef.current}
          onClose={handleQuantiyClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          elevation={3}
        >
          <Box
            className="swipeableItemQuantity"
            component="form"
            onSubmit={handleQuantitySubmit}
          >
            <NumericFormat
              label="Quantity"
              size="small"
              type="text"
              sx={{ width: "200px" }}
              customInput={TextField}
              onValueChange={(e) => {
                e.value !== "" && setQuantity(Number(e.value));
              }}
              isAllowed={({ floatValue }) => {
                // console.log(watch, orderItem);
                const findIndex = watch?.items?.findIndex(
                  (item) => 
                    item.itemId.itemId === orderItem.itemId.itemId &&
                    item.itemId.currentPrice === orderItem.itemId.currentPrice
                );
                const filteredItems = watch?.items?.filter((item, index) => findIndex !== index).reduce(
                  (acc, item) => acc + item.quantity * item.itemId.currentPrice,
                  0
                );
                console.log(filteredItems);
                if (floatValue > orderItem?.itemId?.availQuantity) {
                  snackbar({
                    message: "Quantity exceeds available quantity",
                    variant: "error",
                  });
                  return false;
                } 
                else if (
                  filteredItems + orderItem.itemId?.currentPrice * floatValue >
                  creditBalance && watch?.clientId?.termType === "Credit Type"
                ) {
                  snackbar({
                    message: "Insufficient credit balance",
                    variant: "error",
                  });
                  return false;
                }
                return true;
              }}
              value={quantity}
              thousandSeparator=","
              autoComplete="off"
              inputRef={quantityRef}
              autoFocus
              allowNegative={false}
              allowLeadingZeros={false}
            />

            <IconButton color="success" type="submit">
              <Check />
            </IconButton>

            <IconButton color="error" onClick={handleQuantiyClose}>
              <Close />
            </IconButton>
          </Box>
        </Popover>

        <IconButton color="secondary" onClick={onPlus}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
}

export default SwipeableItem;
