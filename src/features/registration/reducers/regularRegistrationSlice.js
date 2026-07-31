import { createSlice } from "@reduxjs/toolkit";

export const regularRegistrationSlice = createSlice({
  name: "regularRegistration",
  initialState: {
    value: {
      termsAndConditions: {
        terms: null,
        modeOfPayments: [],
        variableDiscount: null,
        termDaysId: null,
        creditLimit: null,
        creditTypeId: null,
        fixedDiscount: {
          discountPercentage: null,
        },
      },
      directFreebie: {
        freebies: [],
      },
      listingFeeForRegistration: {
        listingItems: [],
        isValid: false,
      },
      expensesForRegistration: {
        expenses: [],
        isValid: false,
      },
      priceMode: {
        priceModeId: null,
        items: [],
        isValid: false,
        changedItems: [],  // items with modified price
        removedItems: [],  // items that were removed
        isVatable: false
      },
      isAgree: false,
      toggleFees: false,
      isDirty: false,
    },
  },
  reducers: {
    // ...your existing reducers
    setTermsAndConditions: (state, action) => {
      const { property, value } = action.payload;
      state.value.termsAndConditions[property] = value;
      state.value.isDirty = true;
    },
    setWholeTermsAndConditions: (state, action) => {
      state.value.termsAndConditions = action.payload;
    },
    setDirty: (state, action) => {
      state.value.isDirty = action.payload;
    },
    resetTermsAndConditions: (state) => {
      state.value.termsAndConditions = {
        terms: null,
        modeOfPayments: [],
        variableDiscount: null,
        termDaysId: null,
        creditLimit: null,
        fixedDiscount: {
          discountPercentage: null,
        },
      };
    },
    setFreebies: (state, action) => {
      state.value.directFreebie.freebies = action.payload;
    },
    resetFreebies: (state) => {
      state.value.directFreebie.freebies = [];
    },
    setListingFeeForRegistration: (state, action) => {
      state.value.listingFeeForRegistration.listingItems = action.payload;
    },
    resetListingFeeForRegistration: (state) => {
      state.value.listingFeeForRegistration = {
        listingItems: [],
        isValid: false,
      };
    },
    setExpensesForRegistration: (state, action) => {
      state.value.expensesForRegistration.expenses = action.payload;
    },
    resetExpensesForRegistration: (state) => {
      state.value.expensesForRegistration = {
        expenses: [],
        isValid: false,
      };
    },
    setIsAgree: (state, action) => {
      state.value.isAgree = action.payload;
    },
    setIsListingFeeValid: (state, action) => {
      state.value.listingFeeForRegistration.isValid = action.payload;
    },
    setIsExpensesValid: (state, action) => {
      state.value.expensesForRegistration.isValid = action.payload;
    },
    toggleFeesToStore: (state) => {
      state.value.toggleFees = !state.value.toggleFees;
    },

    // ✅ New price mode reducers
    setPriceModeId: (state, action) => {
      state.value.priceMode.priceModeId = action.payload;
    },
    setTax: (state, action) => {
      state.value.priceMode.isVatable = action.payload;
    },
    setPriceModeItems: (state, action) => {
      state.value.priceMode.items = action.payload;
    },
    setIsPriceModeValid: (state, action) => {
      state.value.priceMode.isValid = action.payload;
    },
    setWholePriceMode: (state, action) => {
      state.value.priceMode = action.payload;
    },
    setPriceModeItemPrice: (state, action) => {
      const { itemCode, newPrice, originalPrice, itemId } = action.payload;

      const existingIndex = state.value.priceMode.changedItems.findIndex(
        (item) => item.itemCode === itemCode
      );

      if (newPrice === originalPrice) {
        // Price reverted to original — remove from changedItems
        if (existingIndex !== -1) {
          state.value.priceMode.changedItems.splice(existingIndex, 1);
          state.value.isDirty = false
        }
      } else {
        if (existingIndex !== -1) {
          state.value.priceMode.changedItems[existingIndex].price = newPrice;
        } else {
          state.value.priceMode.changedItems.push({ itemCode, itemId, price: newPrice });
        }
        state.value.isDirty = true
      }
    },

    resetPriceModeTrackers: (state) => {
      state.value.priceMode.changedItems = [];
      state.value.priceMode.removedItems = [];
    },

    // Track removed item
    removePriceModeItem: (state, action) => {
      const { itemCode, itemId, price } = action.payload;

      // Add to removedItems if not already there
      const alreadyRemoved = state.value.priceMode.removedItems.some(
        (item) => item.itemCode === itemCode
      );
      if (!alreadyRemoved) {
        state.value.priceMode.removedItems.push({ itemCode, itemId, price });
      }

      // Remove from active items
      state.value.priceMode.items = state.value.priceMode.items.filter(
        (item) => item.itemCode?.itemCode !== itemCode
      );

      // Remove from changedItems if it was there
      state.value.priceMode.changedItems = state.value.priceMode.changedItems.filter(
        (item) => item.itemCode !== itemCode
      );
    },
    resetPriceMode: (state) => {
      state.value.priceMode = {
        priceModeId: null,
        items: [],
        isValid: false,
        changedItems: [],
        removedItems: [],
        isVatable: false
      };
    },
  },
});

export const {
  setTermsAndConditions,
  resetTermsAndConditions,
  setFreebies,
  resetFreebies,
  setWholeTermsAndConditions,
  setListingFeeForRegistration,
  resetListingFeeForRegistration,
  setExpensesForRegistration,
  resetExpensesForRegistration,
  setIsAgree,
  setIsListingFeeValid,
  setIsExpensesValid,
  toggleFeesToStore,
  // ✅ Export new actions
  setPriceModeId,
  setPriceModeItems,
  setIsPriceModeValid,
  setWholePriceMode,
  resetPriceMode,
  setPriceModeItemPrice,
  removePriceModeItem,
  resetPriceModeTrackers,
  setDirty,
  setTax
} = regularRegistrationSlice.actions;

export default regularRegistrationSlice.reducer;