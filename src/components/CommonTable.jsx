import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { transformKey } from "../utils/CustomFunctions";
import CommonActions from "./common/CommonActions";
import NoData from "../assets/images/NoRecordsFound.svg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setSelectedRow } from "../features/misc/reducers/selectedRowSlice";
import {
  Attachment,
  Cancel,
  CheckCircle,
  PriorityHigh,
  Visibility,
} from "@mui/icons-material";
import { formatPhoneNumber } from "../utils/CustomFunctions";
import moment from "moment";

function CommonTable({
  actionsHead,
  actions,
  checkIn,
  mt,
  mapData,
  tableHeads,
  customOrderKeys,
  includeActions = true,
  onEdit,
  onArchive,
  onView,
  onFreebie,
  onCheckout,
  onReleaseFreebie,
  onRegularRegister,
  onUpdateFreebies,
  onCancelFreebies,
  onManageApprovers,
  onAddPriceChange,
  onCancel,
  onMap,
  onVoid,
  onHistory,
  onDelete,
  onPrint,
  onPrintTTA,
  onPrintFreebies,
  onTagUserInCluster,
  onViewCluster,
  onResetPassword,
  onAttach,
  onManageProducts,
  onPriceChange,
  onRemove,
  onApprove,
  onReject,
  onReceive,
  onClear,
  onFile,
  onPay,
  onDownload,
  onReplace,
  onNoReplace,
  onPaymentHistories,
  onListingHistories,
  onInspect,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  setRowsPerPageFiltered,
  count = 0,
  clusterData,
  searchData,
  status,
  evenLesserCompact,
  lesserCompact,
  lessCompact,
  lowerCompact,
  compact,
  moreCompact,
  mostCompact,
  expanded,
  percentageArray,
  pesoArray,
  timeArray,
  dateTimeArray,
  dateTimeSplitArray,
  viewMoreKey,
  onViewMoreClick,
  onViewMoreConstant,
  onViewMoreConstantDisabled,
  attachKey,
  highlightSelected,
  disableActions,
  moveNoDataUp,
  checkboxSelection,
  checkedArray = [],
  setCheckedArray,
  warning,
  booleanDisplayOptions = [],
  valueDisplayOptions = [],
  flexNone,
  nestedProperty = {},
  border
}) {
  console.log("map", mapData);

  const dispatch = useDispatch();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  if (!mapData || mapData.length === 0) {
    return (
      <Box
        className="noData"
        sx={{
          height: expanded
            ? "calc(100dvh - 220px)"
            : evenLesserCompact
            ? "calc(100dvh - 262px)"
            : lesserCompact
            ? "calc(100dvh - 282px)"
            : lessCompact
            ? "calc(100dvh - 290px)"
            : lowerCompact
            ? "calc(100dvh - 310px)"
            : compact
            ? "calc(100dvh - 330px)"
            : moreCompact
            ? "calc(100dvh - 400px)"
            : mostCompact
            ? "calc(100dvh - 700px)" // : moreCompact
            : // ? "calc(100dvh - 354px)"
              null,
        }}
      >
        <img
          src={NoData}
          alt="no-data-img"
          className="noData__image"
          style={{
            position: moveNoDataUp && "relative",
            bottom: moveNoDataUp && "10%",
          }}
        />
      </Box>
    );
  }

  var dataToMap = mapData;
  var tableHeadsList;

  const dataToMapKeys = Object.keys(dataToMap[0]);

  if (tableHeads) {
    tableHeadsList = tableHeads;
  } else {
    tableHeadsList = (customOrderKeys || dataToMapKeys).map((key) =>
      transformKey(key)
    );
  }

  const uppercaseKeys = ["storeType"];

  if (includeActions && !tableHeadsList.includes("Actions")) {
    tableHeadsList.push("Actions");
  }

  //Checkbox Selection
  const isAllSelected = dataToMap?.every((item, index) =>
    checkedArray?.includes(index)
  );

  const isIndeterminate =
    !isAllSelected &&
    dataToMap?.some((item, index) => checkedArray?.includes(index));

  const handleCheckboxChange = (index) => {
    // Check if the index is already in the array
    if (checkedArray.includes(index)) {
      // If it's present, remove it
      setCheckedArray(checkedArray.filter((item) => item !== index));
    } else {
      // If it's not present, add it
      setCheckedArray([...checkedArray, index]);
    }
  };

  const handleMasterCheckboxChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      setCheckedArray(dataToMap?.map((_, index) => index));
    } else {
      setCheckedArray([]);
    }
  };

  return (
    <Box
      className="tableSuperContainer"
      sx={{ mt: mt ? mt : null, flex: flexNone ? "none" : 1 }}
    >
      <TableContainer
        component={Paper}
        className="tableSuperContainer__tableContainer"
        sx={{
          height: expanded
            ? "calc(100dvh - 220px)"
            : evenLesserCompact
            ? "calc(100dvh - 262px)"
            : lesserCompact
            ? "calc(100dvh - 282px)"
            : lessCompact
            ? "calc(100dvh - 290px)"
            : lowerCompact
            ? "calc(100dvh - 310px)"
            : compact
            ? "calc(100dvh - 330px)"
            : moreCompact
            ? "calc(100dvh - 400px)"
            : mostCompact
            ? "calc(100dvh - 700px)" // : moreCompact
            : // ? "calc(100dvh - 354px)"
              null,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {warning && <TableCell></TableCell>}

              {checkboxSelection && (
                <TableCell>
                  <Box sx={{ display: "flex", gap: "5px" }}>
                    <CommonActions
                      iconColor={
                        checkedArray.length === 0
                          ? "#BDBDBD77 !important"
                          : "white !important"
                      }
                      {...actionsHead}
                      disabled={checkedArray.length === 0}
                    />

                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleMasterCheckboxChange}
                      sx={{ color: "white !important" }}
                    />
                  </Box>
                </TableCell>
              )}

              {tableHeadsList.map((item, i) => (
                <TableCell
                  sx={{
                    position:
                      (item === "Actions" || item === "SOH") && "sticky",
                    right: (item === "Actions" || item === "SOH") && 0,
                    bgcolor:
                      (item === "Actions" || item === "SOH") && "primary.main",
                  }}
                  key={i}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {dataToMap.map((item, j) => {
              return (
                <TableRow
                  key={j}
                  onClick={() => {
                    dispatch(setSelectedRow(item));
                  }}
                  sx={{
                    cursor: highlightSelected && "pointer",
                    bgcolor:
                      highlightSelected &&
                      shallowEqual(selectedRowData, item) &&
                      "#f3f3f3",
                  }}
                >
                  {warning && (
                    <TableCell>
                      {item[warning.key] === warning.value ? (
                        <Tooltip title={warning.value} arrow>
                          <PriorityHigh color="error" />
                        </Tooltip>
                      ) : null}
                    </TableCell>
                  )}

                  {checkboxSelection && (
                    <TableCell>
                      <Checkbox
                        checked={checkedArray?.includes(j)}
                        onChange={() => handleCheckboxChange(j)}
                      />
                    </TableCell>
                  )}

                  {(customOrderKeys || dataToMapKeys).map((keys, k) => {
                    //Special module to change color whether there is a time out data
                    if (checkIn) {
                      if (keys === "timeOut" || keys === "createdDate") {
                        return (
                          <TableCell
                            sx={{
                              bgcolor: item["timeOut"] ? "#A2E4B8" : "#FF7276",
                            }}
                            key={k}
                          >
                            {(item[keys] &&
                              moment(item[keys]).format(
                                "MMM DD, YYYY HH:mm:ss"
                              )) ||
                              "N/A"}
                            {/* // H:mm a */}
                          </TableCell>
                        );
                      }
                      if (!item["timeOut"]) {
                        return (
                          <TableCell sx={{ bgcolor: "#FF7276" }} key={k}>
                            {item[keys] || "N/A"}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell sx={{ bgcolor: "#A2E4B8" }} key={k}>
                            {item[keys] || "N/A"}
                          </TableCell>
                        );
                      }
                    }
                    if (
                      booleanDisplayOptions.some(
                        (option) => option.keyName === keys
                      )
                    ) {
                      const foundOption = booleanDisplayOptions.find(
                        (option) => option.keyName === keys
                      );

                      return (
                        <TableCell key={k}>
                          {item[keys]
                            ? foundOption?.trueDisplay
                            : foundOption?.falseDisplay}
                        </TableCell>
                      );
                    }

                    if (
                      valueDisplayOptions.some(
                        (option) => option.keyName === keys
                      )
                    ) {
                      const foundOption = valueDisplayOptions.find(
                        (option) => option.keyName === keys
                      );

                      if (foundOption) {
                        const displayComponent =
                          foundOption.displayOptions[item[keys]];

                        // If there is a value for the key and a specific display option exists for that value, use it.
                        if (displayComponent) {
                          return (
                            <TableCell key={k}>{displayComponent}</TableCell>
                          );
                        }

                        // If there is a value for the key but no specific display option exists, show the custom "hasValue" component.
                        if (item[keys]) {
                          return (
                            <TableCell key={k}>
                              {foundOption.displayOptions.hasValue}
                            </TableCell>
                          );
                        }

                        // If there is no value for the key, use the "noValue" display option.
                        return (
                          <TableCell key={k}>
                            {foundOption.displayOptions.noValue}
                          </TableCell>
                        );
                      }
                    }

                    // Nested Property
                    // Structure: { key: "mainKey", nestedKeys: ["nestedKey1", "nestedKey2"] }
                    if (
                      nestedProperty?.key === keys &&
                      nestedProperty.nestedKeys
                    ) {
                      if (keys === "expirationDate") {
                        const nestedValues = item[nestedProperty.key]
                          ? Object.entries(item[nestedProperty.key])
                              .filter(([key]) =>
                                nestedProperty.nestedKeys.includes(key)
                              )
                              .map(([key, value]) => ({ key, value })) // Store both key (color) and value
                          : [];
                        console.log(nestedValues);

                        return (
                          <TableCell key={k}>
                            <Box display="flex" gap={1}>
                              {nestedValues.length > 0 ? (
                                nestedValues.map(({ key, value }, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      padding: "2px 15px",
                                      backgroundColor: key ? key : "#FF7276", // Use key as background color
                                      textAlign: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "white !important",
                                      }}
                                    >
                                      {value || 0}
                                    </Typography>
                                  </Box>
                                ))
                              ) : (
                                <>
                                  <Box
                                    sx={{
                                      width: "38px",
                                      height: "28px",
                                      backgroundColor: "grey", // Use key as background color
                                      textAlign: "center",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      width: "38px",
                                      height: "28px",
                                      backgroundColor: "grey", // Use key as background color
                                      textAlign: "center",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      width: "38px",
                                      height: "28px",
                                      backgroundColor: "grey", // Use key as background color
                                      textAlign: "center",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      width: "38px",
                                      height: "28px",
                                      backgroundColor: "grey", // Use key as background color
                                      textAlign: "center",
                                    }}
                                  />
                                </>
                              )}
                            </Box>
                          </TableCell>
                        );
                      } else {
                        const nestedValues = item[nestedProperty.key]
                          ? Object.entries(item[nestedProperty.key])
                              .filter(([key]) =>
                                nestedProperty.nestedKeys.includes(key)
                              )
                              .map(([_, value]) => value)
                          : null;

                        return (
                          <TableCell key={k}>
                            {nestedValues ? nestedValues.join(", ") : "N/A"}
                          </TableCell>
                        );
                      }
                    }

                    if (item[keys] === true && keys !== attachKey) {
                      return (
                        <TableCell key={k}>
                          <CheckCircle color="success" />
                        </TableCell>
                      );
                    }

                    if (item[keys] === false && keys !== attachKey) {
                      return (
                        <TableCell key={k}>
                          <Cancel color="error" />
                        </TableCell>
                      );
                    }

                    if (keys === attachKey) {
                      return (
                        <TableCell key={k}>
                          <Attachment
                            sx={{
                              color: !item[keys]
                                ? "error.main"
                                : "success.main",
                            }}
                          />
                        </TableCell>
                      );
                    }

                    if (viewMoreKey === keys) {
                      return (
                        <TableCell key={k}>
                          <IconButton
                            sx={{ color: "secondary.main", p: 0 }}
                            onClick={onViewMoreClick}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      );
                    }

                    if (keys === "phoneNumber") {
                      return (
                        <TableCell key={k}>
                          {item[keys] && "+63 " + formatPhoneNumber(item[keys])}
                        </TableCell>
                      );
                    }

                    if (keys === "soh") {
                      return (
                        <TableCell
                          sx={{
                            position: "sticky",
                            right: 0,
                            bgcolor: checkIn
                              ? item["timeOut"]
                                ? "#A2E4B8"
                                : "#FF7276"
                              : "white !important",
                          }}
                          key={k}
                        >
                          {item[keys] && item[keys]}
                        </TableCell>
                      );
                    }

                    if (keys === "referenceNos") {
                      return (
                        <TableCell
                          key={k}
                          sx={{ whiteSpace: "normal", wordWrap: "break-word" }}
                        >
                          {item[keys] && item[keys].join(", ")}
                        </TableCell>
                      );
                    }

                    if (keys === "origin") {
                      return (
                        <TableCell key={k}>
                          {item[keys] === "Prospecting"
                            ? "Prospect"
                            : item[keys]}
                        </TableCell>
                      );
                    }

                    //Override createdAt or updatedAt default formatting if time only
                    if (timeArray?.includes(keys)) {
                      return (
                        <TableCell key={k}>
                          {item[keys] && moment(item[keys]).format("hh:mm a")}
                        </TableCell>
                      );
                    }

                    if (dateTimeArray?.includes(keys)) {
                      return (
                        <TableCell key={k}>
                          {item[keys] &&
                            moment(item[keys]).format("MMM D, YYYY hh:mm a")}
                        </TableCell>
                      );
                    }

                    if (dateTimeSplitArray?.includes(keys)) {
                      return (
                        <React.Fragment key={k}>
                          <TableCell>
                            {item[keys] &&
                              moment(item[keys]).format("MMM DD, YYYY")}
                          </TableCell>
                          <TableCell key={k}>
                            {item[keys] && moment(item[keys]).format("hh:mm a")}
                          </TableCell>
                        </React.Fragment>
                      );
                    }

                    if (
                      keys === "createdAt" ||
                      keys === "updatedAt" ||
                      keys === "date" ||
                      keys === "chequeDate" ||
                      keys === "deliveryDate"
                    ) {
                      return (
                        <TableCell key={k}>
                          {item[keys] &&
                            moment(item[keys]).format("MMM DD, YYYY")}
                          {/* // H:mm a */}
                        </TableCell>
                      );
                    }

                    if (keys === "createdDate") {
                      return (
                        <TableCell key={k}>
                          {item[keys] &&
                            moment(item[keys]).format("MMM DD, YYYY")}
                          {/* // H:mm a */}
                        </TableCell>
                      );
                    }

                    if (uppercaseKeys.includes(keys)) {
                      return (
                        <TableCell key={k}>
                          {item[keys]?.toUpperCase()}
                        </TableCell>
                      );
                    }

                    if (
                      onViewMoreConstant &&
                      k === (customOrderKeys || dataToMapKeys).length - 1
                    ) {
                      return (
                        <React.Fragment key={k}>
                          <TableCell>
                            {/* Content of the last regular column */}
                            {pesoArray && pesoArray.includes(keys) && "₱ "}

                            {percentageArray && percentageArray.includes(keys)
                              ? (item[keys] * 100)?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionsDigits: 2,
                                })
                              : pesoArray && pesoArray.includes(keys)
                              ? item[keys]?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : !item[keys]
                              ? "N/A"
                              : item[keys]}

                            {percentageArray &&
                              percentageArray.includes(keys) &&
                              "%"}
                          </TableCell>

                          <TableCell>
                            {/* Additional column for onViewMoreConstant */}
                            <IconButton
                              sx={{ color: "secondary.main" }}
                              onClick={onViewMoreConstant}
                              disabled={onViewMoreConstantDisabled}
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </React.Fragment>
                      );
                    }

                    return (
                      <TableCell key={k} sx={border &&  { borderRight: "1px solid #BDBDBD77"}}>
                        {pesoArray && pesoArray.includes(keys) && "₱"}
                        {/* {keys === "phoneNumber" && "+63"} */}

                        {percentageArray && percentageArray.includes(keys)
                          ? (item[keys] * 100)?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionsDigits: 2,
                            })
                          : pesoArray && pesoArray.includes(keys)
                          ? item[keys]?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : !item[keys]
                          ? item[keys] === null
                            ? "N/A"
                            : item[keys]
                          : item[keys]}

                        {percentageArray &&
                          percentageArray.includes(keys) &&
                          "%"}
                      </TableCell>
                    );
                  })}

                  {includeActions && (
                    <TableCell
                      sx={{
                        position: "sticky",
                        right: 0,
                        bgcolor: checkIn
                          ? item["timeOut"]
                            ? "#A2E4B8"
                            : "#FF7276"
                          : "white !important",
                      }}
                    >
                      <CommonActions
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onFreebie={onFreebie && onFreebie}
                        onReleaseFreebie={onReleaseFreebie && onReleaseFreebie}
                        onRegularRegister={
                          onRegularRegister && onRegularRegister
                        }
                        onUpdateFreebies={onUpdateFreebies && onUpdateFreebies}
                        onCancelFreebies={onCancelFreebies && onCancelFreebies}
                        onMap={onMap && onMap}
                        onView={onView && onView}
                        onManageApprovers={
                          onManageApprovers && onManageApprovers
                        }
                        onAddPriceChange={onAddPriceChange && onAddPriceChange}
                        onVoid={onVoid && onVoid}
                        onHistory={onHistory && onHistory}
                        onPrint={onPrint && onPrint}
                        onPrintTTA={onPrintTTA && onPrintTTA}
                        onPrintFreebies={onPrintFreebies && onPrintFreebies}
                        onDelete={onDelete && onDelete}
                        onTagUserInCluster={
                          onTagUserInCluster && onTagUserInCluster
                        }
                        onViewCluster={onViewCluster && onViewCluster}
                        onCancel={onCancel && onCancel}
                        onResetPassword={onResetPassword && onResetPassword}
                        onManageProducts={onManageProducts && onManageProducts}
                        onPriceChange={onPriceChange && onPriceChange}
                        onAttach={onAttach && onAttach}
                        onRemove={onRemove && onRemove}
                        onApprove={onApprove && onApprove}
                        onReject={onReject && onReject}
                        onReceive={onReceive && onReceive}
                        onClear={onClear && onClear}
                        onPaymentHistories={
                          onPaymentHistories && onPaymentHistories
                        }
                        onListingHistories={
                          onListingHistories && onListingHistories
                        }
                        onFile={onFile && onFile}
                        onCheckout={onCheckout && onCheckout}
                        onPay={onPay && onPay}
                        onInspect={onInspect && onInspect}
                        onDownload={onDownload && onDownload}
                        onReplace={onReplace && onReplace}
                        onNoReplace={onNoReplace && onNoReplace}
                        item={item}
                        status={status}
                        disableActions={disableActions}
                        {...actions}
                      />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 50, 100]}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(e.target.value);
          // setRowsPerPageFiltered(searchData,clusterData);
        }}
        page={page}
        onPageChange={(_, newPage) => {
          setPage(newPage);
        }}
        count={count}
        className="tableSuperContainer__tablePagination"
      />
    </Box>
  );
}

export default CommonTable;
