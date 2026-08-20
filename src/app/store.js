import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../features/api";
import { initialChangePasswordApi } from "../features/authentication/api/initialChangePasswordApi";
import { loginSlice } from "../features/authentication/reducers/loginSlice";
import { permissionsSlice } from "../features/authentication/reducers/permissionsSlice";
import { bbdCacheSlice } from "../features/inventory-management/reducers/bbdCacheSlice";
import { callsheetSlice } from "../features/inventory-management/reducers/callsheetSlice";
import { generateReceivingSlice } from "../features/inventory-management/reducers/generateReceivingSlice";
import { rdfSmsApi } from "../features/misc/api/rdfSmsApi";
import { disclosureSlice } from "../features/misc/reducers/disclosureSlice";
import { selectedRowSlice } from "../features/misc/reducers/selectedRowSlice";
import { badgeSlice } from "../features/prospect/reducers/badgeSlice";
import { selectedStoreTypeSlice } from "../features/prospect/reducers/selectedStoreTypeSlice";
import { regularRegistrationSlice } from "../features/registration/reducers/regularRegistrationSlice";
import { oneChargingApi } from "../features/user-management/api/oneChargingApi";
import { sedarApi } from "../features/user-management/api/sedarApi";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    permissions: permissionsSlice.reducer,
    selectedRow: selectedRowSlice.reducer,
    selectedStoreType: selectedStoreTypeSlice.reducer,
    badge: badgeSlice.reducer,
    regularRegistration: regularRegistrationSlice.reducer,
    disclosure: disclosureSlice.reducer,
    generateReceiving: generateReceivingSlice.reducer,
    bbdCache: bbdCacheSlice.reducer,
    callsheet: callsheetSlice.reducer,
    [api.reducerPath]: api.reducer,
    [initialChangePasswordApi.reducerPath]: initialChangePasswordApi.reducer,
    [sedarApi.reducerPath]: sedarApi.reducer,
    [oneChargingApi.reducerPath]: oneChargingApi.reducer,
    [rdfSmsApi.reducerPath]: rdfSmsApi.reducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
      initialChangePasswordApi.middleware,
      sedarApi.middleware,
      rdfSmsApi.middleware,
      oneChargingApi.middleware
    ]),
});

setupListeners(store.dispatch);
