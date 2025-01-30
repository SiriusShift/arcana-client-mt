import moment from "moment";
import { dummyPromise } from "./DummyApi";
import {
  dummyDetailedFreebiesData,
  dummyDetailedReceivingData,
  dummyDetailedReturnData,
  dummyDetailedSamplingData,
  dummyDetailedTransferInData,
  dummyDetailedTransferOutData,
  dummyFreebiesData,
  dummyGenerateReceivingData,
  dummyItemsWithBbdData,
  dummyMRPData,
  dummyReceivingData,
  dummyReturnData,
  dummySamplingData,
  dummyTransferInData,
  dummyTransferOutData,
  dummyCallsheetData,
} from "./DummyInventoryData";

// Inventory (Common)
export const dummyGetAllItemsWithBbd = async (params) => {
  const paginatedDummyData = dummyItemsWithBbdData.items.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        items: paginatedDummyData,
        totalCount: dummyItemsWithBbdData.items.length,
        totalPages: Math.ceil(
          dummyItemsWithBbdData.items.length / params.PageSize
        ),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};
// Inventory MRP
export const dummyGetInventoryMrp = async (params) => {
  const searchFilteredData = dummyMRPData.inventoryMrp.filter(
    (item) =>
      item.itemCode.toLowerCase().includes(params.Search.toLowerCase()) ||
      item.itemDescription.toLowerCase().includes(params.Search.toLowerCase())
  );

  const paginatedDummyData = searchFilteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        inventoryMrp: paginatedDummyData,
        totalCount: searchFilteredData.length,
        totalPages: Math.ceil(searchFilteredData.length / params.PageSize),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

// Receiving
export const dummyReceiveMoveOrder = async (body) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        message: "Move Order received successfully",
        data: body,
      },
    });

    console.log(body);
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllReceivedOrders = async (params) => {
  const filteredData = dummyReceivingData.receivedOrders.filter((item) => {
    const matchesSearch = item.businessName
      .toLowerCase()
      .includes(params.Search.toLowerCase());

    return matchesSearch;
  });

  const paginatedDummyData = filteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        receivedOrders: paginatedDummyData,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.PageSize),
      },
    });

    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetReceivedOrderById = async (id) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyDetailedReceivingData.find(
        (item) => item.moveOrderId == id
      ),
      rejectConditions: [
        {
          check: !dummyDetailedReceivingData.find(
            (item) => item.moveOrderId == id
          ),
          message: "Move Order not found",
        },
      ],
    });

    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGenerateMoveOrder = async (id) => {
  const foundMoveOrder = dummyGenerateReceivingData.find(
    (item) => item.moveOrderId == id
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: foundMoveOrder,
      rejectConditions: [
        {
          check: !foundMoveOrder,
          message: "Move Order not found",
        },
        {
          check: dummyReceivingData.receivedOrders.find(
            (item) => item.moveOrderId == id
          ),
          message: "Move Order already received",
        },
      ],
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

// Transfer In
export const dummyReceiveTransferIn = async () => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: { message: "Transfer In received successfully" },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyRejectTransferIn = async () => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: { message: "Transfer In rejected successfully" },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllTransferIns = async (params) => {
  const filteredData = dummyTransferInData.transferIns.filter((item) => {
    const itemDate = moment(item.transactionDate); // Assuming 'item.date' is in a compatible format
    const startDate = params.DateFrom ? moment(params.DateFrom) : moment(0);
    const endDate = params.DateTo ? moment(params.DateTo) : moment();

    const isWithinDateRange =
      !startDate || !endDate || (itemDate >= startDate && itemDate <= endDate);
    const matchesSearch = item.from
      .toLowerCase()
      .includes(params.Search.toLowerCase());

    const matchesTransferInStatus =
      item.transferInStatus === params.TransferInStatus;

    return matchesSearch && isWithinDateRange && matchesTransferInStatus;
  });

  const paginatedDummyData = filteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        transferIns: paginatedDummyData,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.PageSize),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetTransferInById = async (id) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyDetailedTransferInData.find((item) => item.id == id),
      rejectConditions: [
        {
          check: !dummyDetailedTransferInData.some((item) => item.id == id),
          message: "Transfer In not found",
        },
      ],
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

// Transfer Out
export const dummyTransferOut = async (body) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: { message: "Transfer Out successful" },
    });
    console.log(body);
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllTransferOuts = async (params) => {
  const filteredData = dummyTransferOutData.transferOuts.filter((item) => {
    const itemDate = moment(item.transactionDate); // Assuming 'item.date' is in a compatible format
    const startDate = params.DateFrom ? moment(params.DateFrom) : moment(0);
    const endDate = params.DateTo ? moment(params.DateTo) : moment();

    const isWithinDateRange =
      !startDate || !endDate || (itemDate >= startDate && itemDate <= endDate);
    const matchesSearch =
      item.to.toLowerCase().includes(params.Search.toLowerCase()) ||
      item.transactionType.toLowerCase().includes(params.Search.toLowerCase());

    const matchesTransferOutStatus =
      item.transferOutStatus === params.TransferOutStatus;

    return matchesSearch && isWithinDateRange && matchesTransferOutStatus;
  });

  const paginatedDummyData = filteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        transferOuts: paginatedDummyData,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.PageSize),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetTransferOutById = async (id) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyDetailedTransferOutData.find((item) => item.id == id),
      rejectConditions: [
        {
          check: !dummyDetailedTransferOutData.some((item) => item.id == id),
          message: "Transfer Out not found",
        },
      ],
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

// Freebies
export const dummyRequestFreebies = async (body) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: { message: "Freebies requested successfully" },
    });
    console.log(body);
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllFreebiesRequests = async (params) => {
  const filteredData = dummyFreebiesData.freebieRequests.filter((item) => {
    const itemDate = moment(item.transactionDate); // Assuming 'item.date' is in a compatible format
    const startDate = params.DateFrom ? moment(params.DateFrom) : moment(0);
    const endDate = params.DateTo ? moment(params.DateTo) : moment();

    const isWithinDateRange =
      !startDate || !endDate || (itemDate >= startDate && itemDate <= endDate);
    const matchesSearch =
      item.businessName.toLowerCase().includes(params.Search.toLowerCase()) ||
      item.ownersName.toLowerCase().includes(params.Search.toLowerCase());

    const matchesFreebieStatus = item.freebieStatus === params.FreebieStatus;

    return matchesSearch && isWithinDateRange && matchesFreebieStatus;
  });

  const paginatedDummyData = filteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        freebieRequests: paginatedDummyData,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.PageSize),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetFreebieRequestById = async (id) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyDetailedFreebiesData.find((item) => item.id == id),
      rejectConditions: [
        {
          check: !dummyDetailedFreebiesData.some((item) => item.id == id),
          message: "Freebie request not found",
        },
      ],
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllCallsheet = async () => {
  console.log("dummyGetAllCallsheet called");
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyCallsheetData,
    });

    return { data: response }; // Correct structure for RTK Query
  } catch (error) {
    console.error("dummyGetAllCallsheet error:", error);
    return { error: { message: error.message } }; // Correct error structure
  }
};


// Sampling
export const dummyAddSampling = async (body) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: { message: "Sampling submitted successfully" },
    });
    console.log(body);
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllSamplings = async (params) => {
  const filteredData = dummySamplingData.samplings.filter((item) => {
    const itemDate = moment(item.transactionDate); // Assuming 'item.date' is in a compatible format
    const startDate = params.DateFrom ? moment(params.DateFrom) : moment(0);
    const endDate = params.DateTo ? moment(params.DateTo) : moment();

    const isWithinDateRange =
      !startDate || !endDate || (itemDate >= startDate && itemDate <= endDate);
    const matchesSearch =
      item.businessName.toLowerCase().includes(params.Search.toLowerCase()) ||
      item.ownersName.toLowerCase().includes(params.Search.toLowerCase());

    return matchesSearch && isWithinDateRange;
  });

  const paginatedDummyData = filteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        samplings: paginatedDummyData,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.PageSize),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetSamplingById = async (id) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyDetailedSamplingData.find((item) => item.id == id),
      rejectConditions: [
        {
          check: !dummyDetailedSamplingData.some((item) => item.id == id),
          message: "Sampling not found",
        },
      ],
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

// Return
export const dummyReturn = async (body) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: { message: "Return successful" },
    });
    console.log(body);
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetAllReturns = async (params) => {
  const filteredData = dummyReturnData.returns.filter((item) => {
    const itemDate = moment(item.transactionDate); // Assuming 'item.date' is in a compatible format
    const startDate = params.DateFrom ? moment(params.DateFrom) : moment(0);
    const endDate = params.DateTo ? moment(params.DateTo) : moment();

    const isWithinDateRange =
      !startDate || !endDate || (itemDate >= startDate && itemDate <= endDate);
    const matchesSearch =
      item.businessName.toLowerCase().includes(params.Search.toLowerCase()) ||
      item.ownersName.toLowerCase().includes(params.Search.toLowerCase());

    return matchesSearch && isWithinDateRange;
  });

  const paginatedDummyData = filteredData.slice(
    (params.Page - 1) * params.PageSize,
    params.Page * params.PageSize
  );

  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: {
        returns: paginatedDummyData,
        totalCount: filteredData.length,
        totalPages: Math.ceil(filteredData.length / params.PageSize),
      },
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};

export const dummyGetReturnById = async (id) => {
  try {
    const response = await dummyPromise({
      type: "success",
      dummyData: dummyDetailedReturnData.find((item) => item.id == id),
      rejectConditions: [
        {
          check: !dummyDetailedReturnData.some((item) => item.id == id),
          message: "Return not found",
        },
      ],
    });
    return { data: response.data };
  } catch (error) {
    return { error: { message: error.message } };
  }
};
