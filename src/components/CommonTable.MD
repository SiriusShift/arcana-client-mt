# CommonTable Component Documentation

## Overview

The `CommonTable` component is a reusable table component designed for displaying tabular data with various functionalities such as selection, actions, and pagination. It utilizes Material-UI components and supports extensive customization options.

## Props

### Required Props

- **`mapData`** (`Array`): The data to be displayed in the table. Each item in the array should be an object representing a row in the table.
- **`page`** (`Number`): Current page number for pagination.
- **`setPage`** (`Function`): Function to set the page number for pagination.
- **`rowsPerPage`** (`Number`): Number of rows per page for pagination.
- **`setRowsPerPage`** (`Function`): Function to set the number of rows per page.
- **`count`** (`Number`): Total number of rows for pagination.

### Optional Props

- **`actionsHead`** (`Object`): Props for customizing the actions displayed in the table header.
- **`mt`** (`String` | `Number`): Margin top value for the table container.
- **`tableHeads`** (`Array`): Custom column headers for the table. If not provided, headers are derived from the keys of the first data item.
- **`customOrderKeys`** (`Array`): Custom order of the keys for mapping data to columns.
- **`includeActions`** (`Boolean`): Whether to include an "Actions" column in the table. Defaults to `true`.
- **`onEdit`**, **`onArchive`**, **`onView`**, **`onFreebie`**, **`onReleaseFreebie`**, **`onRegularRegister`**, **`onUpdateFreebies`**, **`onCancelFreebies`**, **`onManageApprovers`**, **`onAddPriceChange`**, **`onCancel`**, **`onVoid`**, **`onHistory`**, **`onDelete`**, **`onPrintTTA`**, **`onPrintFreebies`**, **`onTagUserInCluster`**, **`onViewCluster`**, **`onResetPassword`**, **`onAttach`**, **`onManageProducts`**, **`onPriceChange`**, **`onRemove`**, **`onApprove`**, **`onReject`**, **`onReceive`**, **`onClear`**, **`onFile`**, **`onPay`**, **`onPaymentHistories`**, **`onInspect`** (`Function`): Event handlers for various row actions.

- **`status`** (`String`): Status of the table data (used for styling or conditional logic).
- **`evenLesserCompact`** | **`lesserCompact`** | **`lessCompact`** | **`lowerCompact`** | **`compact`** | **`moreCompact`** (`Boolean`): Different levels of compactness for the table container height.
- **`percentageArray`** (`Array`): Keys representing percentage values.
- **`pesoArray`** (`Array`): Keys representing peso values.
- **`timeArray`** (`Array`): Keys representing time values.
- **`dateTimeArray`** (`Array`): Keys representing date-time values.
- **`dateTimeSplitArray`** (`Array`): Keys representing date-time split values.
- **`viewMoreKey`** (`String`): Key used for the "View More" column.
- **`onViewMoreClick`** (`Function`): Event handler for the "View More" click action.
- **`onViewMoreConstant`** (`Function`): Event handler for the "View More Constant" action.
- **`onViewMoreConstantDisabled`** (`Boolean`): Whether the "View More Constant" action should be disabled.
- **`attachKey`** (`String`): Key representing attachment status.
- **`highlightSelected`** (`Boolean`): Whether to highlight the selected row.
- **`disableActions`** (`Boolean`): Whether to disable actions in the "Actions" column.
- **`moveNoDataUp`** (`Boolean`): Whether to adjust the position of the "No Data" image.
- **`checkboxSelection`** (`Boolean`): Whether to enable checkbox selection for rows.
- **`checkedArray`** (`Array`): Array of indices representing selected rows.
- **`setCheckedArray`** (`Function`): Function to set the selected rows.
- **`warning`** (`Object`): Object specifying warning conditions (e.g., key and value to trigger a warning icon).
- **`booleanDisplayOptions`** (`Array`): Array of objects defining boolean display options.
- **`valueDisplayOptions`** (`Array`): Array of objects defining value display options.
- **`flexNone`** (`Boolean`): Whether to set the table container's flex property to "none".
- **`nestedProperty`** (`Object`): Object specifying nested properties to be displayed.

## Example Usage

```jsx
<CommonTable
  mapData={data}
  mt={2}
  tableHeads={["Name", "Age", "Actions"]}
  customOrderKeys={["name", "age", "actions"]}
  checkboxSelection
  checkedArray={checkedIndices}
  setCheckedArray={setCheckedIndices}
  onEdit={handleEdit}
  onDelete={handleDelete}
  page={currentPage}
  setPage={setCurrentPage}
  rowsPerPage={rowsPerPage}
  setRowsPerPage={setRowsPerPage}
  count={totalRows}
  status={status}
/>
```
