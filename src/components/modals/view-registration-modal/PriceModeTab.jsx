import { Box, Chip, Divider, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetAllProductsQuery } from "../../../features/setup/api/productsApi";

const formatPrice = (price) =>
  price != null
    ? `₱ ${Number(price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

// Same diff logic as the editable PriceMode tab, reused here for the read-only view.
const formatPriceDiff = (price, srp) => {
  const numericPrice = price != null ? Number(price) : null;
  const numericSrp = srp != null ? Number(srp) : null;

  const hasValues =
    numericPrice != null &&
    !Number.isNaN(numericPrice) &&
    numericSrp != null &&
    !Number.isNaN(numericSrp) &&
    numericSrp !== 0;

  if (!hasValues) return { text: "—", color: "text.secondary" };

  const diff = numericPrice - numericSrp;
  const diffPercent = (diff / numericSrp) * 100;
  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
  const color = diff > 0 ? "success.main" : diff < 0 ? "error.main" : "text.secondary";

  return {
    text: `${sign}₱${Math.abs(diff).toFixed(2)} (${sign}${Math.abs(diffPercent).toFixed(1)}%)`,
    color,
  };
};

const ProductTable = ({ items, columns }) => {
  const gridTemplate = `1fr 2fr ${columns.slice(2).map(() => "1fr").join(" ")}`;

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden", mt: 1 }}>
      {/* Header */}
      <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, px: 2, py: 1, backgroundColor: "action.hover", borderBottom: "1px solid", borderColor: "divider" }}>
        {columns.map((header) => (
          <Typography key={header} sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {header}
          </Typography>
        ))}
      </Box>

      {/* Rows */}
      {items.map((item, index) => (
        <Box
          key={item.itemCode ?? index}
          sx={{ display: "grid", gridTemplateColumns: gridTemplate, px: 2, py: 1.25, borderBottom: index < items.length - 1 ? "1px solid" : "none", borderColor: "divider", "&:hover": { backgroundColor: "action.hover" }, transition: "background-color 0.15s" }}
        >
          <Typography sx={{ fontSize: 13, fontFamily: "monospace" }}>{item.itemCode ?? "—"}</Typography>
          <Typography sx={{ fontSize: 13 }}>{item.itemDescription || "—"}</Typography>
          {columns.slice(2).map((col) => {
            if (col === "Price Diff") {
              // Compare against Price To for the "changed" table, otherwise Price
              const priceKey = item.priceTo != null ? "priceTo" : "price";
              const { text, color } = formatPriceDiff(item[priceKey], item.srp);

              return (
                <Typography key={col} sx={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", color }}>
                  {text}
                </Typography>
              );
            }

            const key =
              col === "Price From" ? "priceFrom"
                : col === "Price To" ? "priceTo"
                  : col === "SRP" ? "srp"
                    : "price";

            return (
              <Typography key={col} sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                {formatPrice(item[key])}
              </Typography>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

const COLS = {
  standard: ["Item Code", "Description", "SRP", "Price", "Price Diff"],
  changed: ["Item Code", "Description", "SRP", "Price From", "Price To", "Price Diff"],
  removed: ["Item Code", "Description", "Price From"],
};

const EmptyState = ({ message }) => (
  <Typography sx={{ color: "text.secondary", fontSize: 14, textAlign: "center", py: 3 }}>
    {message}
  </Typography>
);

function PriceModeTab() {
  const location = useLocation()
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userDetails = useSelector((state) => state.login.userDetails);

  const role = userDetails?.roleName;
  const isTDO = role === "TDO";
  const isManager = role === "Manager";
  const isHead = role === "Head";
  const isAdmin = role === "Admin";
  const priceMode = selectedRowData?.priceModeId;
  const priceModeDescription = selectedRowData?.priceModeName;
  const variableDiscount = selectedRowData?.variableDiscount;
  const discountPercentage = selectedRowData?.fixedDiscount?.discountPercentage || selectedRowData?.discount;
  const discountPercent = selectedRowData?.discount;
  const isRetail = priceMode === 1;

  const { data: products } = useGetAllProductsQuery({
    PageSize: 1000,
    Status: true,
  });

  const isRegistration = location.pathname === "/approval/registration-approval" || location.pathname === "/customer-registration/registration"

  // Attaches SRP from the products catalog whenever an item doesn't already carry one
  const withSrp = (list = []) =>
    list.map((item) => ({
      ...item,
      srp: item.srp ?? products?.items?.find((product) => product?.itemCode === item.itemCode)?.latestSRP,
    }));

  const items = withSrp(
    (isHead || isAdmin || isTDO) && !isRegistration
      ? selectedRowData?.addItems
      : selectedRowData?.clientItems
  );
  const changedItems = withSrp(selectedRowData?.changeItemPrices);
  const removedItems = selectedRowData?.removeItems ?? [];

  return (
    <Box className="viewRegistrationModal__priceMode">

      {/* PRICE MODE INFO — hidden for Manager and Head */}
      {!(isManager) && (
        <Box className="viewRegistrationModal__priceMode__content">
          <Typography className="viewRegistrationModal__priceMode__content__title">
            Price Mode Information
          </Typography>

          <Box className="viewRegistrationModal__priceMode__content__fields">
            <Box className="viewRegistrationModal__priceMode__content__fields__item">
              <Typography className="viewRegistrationModal__priceMode__content__fields__item__label">Price Mode:</Typography>
              <Typography className="viewRegistrationModal__priceMode__content__fields__item__value">{priceModeDescription ?? "N/A"}</Typography>
            </Box>

            {isRetail && (
              <>
                <Box className="viewRegistrationModal__priceMode__content__fields__item">
                  <Typography className="viewRegistrationModal__priceMode__content__fields__item__label">Discount Type:</Typography>
                  <Chip label={variableDiscount ? "Variable" : "Fixed"} size="small" color={variableDiscount ? "secondary" : "primary"} variant="outlined" />
                </Box>

                {/* <Box className="viewRegistrationModal__priceMode__content__fields__item">
                  <Typography className="viewRegistrationModal__priceMode__content__fields__item__label">Discount Rate:</Typography>
                  <Typography className="viewRegistrationModal__priceMode__content__fields__item__value">
                    {discountPercentage != null ? `${Number(discountPercentage).toFixed(2)}%` : "N/A"}
                  </Typography>
                </Box> */}
              </>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {isManager && <Box className="viewRegistrationModal__priceMode__content">
        <Typography className="viewRegistrationModal__priceMode__content__title">
          Discount
        </Typography>

        <Box className="viewRegistrationModal__priceMode__content__fields">
          <Box className="viewRegistrationModal__priceMode__content__fields__item">
            <Typography className="viewRegistrationModal__priceMode__content__fields__item__label">Discount:</Typography>
            <Typography className="viewRegistrationModal__priceMode__content__fields__item__value">{discountPercent != null ? `${Number(discountPercent)}%` : "N/A"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>}

      {/* PRODUCTS SECTION */}
      <Box className="viewRegistrationModal__priceMode__content">
        {isManager ? (
          <>
            <Typography className="viewRegistrationModal__priceMode__content__title">
              Changed Item Prices ({changedItems.length})
            </Typography>
            {changedItems.length === 0
              ? <EmptyState message="No changed items." />
              : <ProductTable items={changedItems} columns={COLS.changed} />}

            <Divider sx={{ my: 2 }} />

            <Typography className="viewRegistrationModal__priceMode__content__title">
              Removed Items ({removedItems.length})
            </Typography>
            {removedItems.length === 0
              ? <EmptyState message="No removed items." />
              : <ProductTable items={removedItems} columns={COLS.removed} />}
          </>
        ) : (
          <>
            <Typography className="viewRegistrationModal__priceMode__content__title">
              {isHead ? "Additional " : ""}Products ({items.length})
            </Typography>
            {items.length === 0
              ? <EmptyState message="No products added." />
              : <ProductTable items={items} columns={COLS.standard} />}
          </>
        )}
      </Box>

    </Box>
  );
}

export default PriceModeTab;