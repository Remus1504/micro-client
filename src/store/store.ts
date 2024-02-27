import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Reducer } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "src/features/auth/reducers/authentication.reducers";
import logoutReducer from "src/features/auth/reducers/logout.reducers";
import studentReducer from "src/features/student/reducers/student.reducer";
import instructorReducer from "src/features/instructors/reducers/instructor.reducer";
import categoryReducer from "src/shared/header/reducers/category.reducer";
import headerReducer from "src/shared/header/reducers/header.reducer";
import notificationReducer from "src/shared/header/reducers/notification.reducer";

import { api } from "./apis";

const persistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["clientApi", "_persist"],
};

export const combineReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authUser: authReducer,
  logout: logoutReducer,
  student: studentReducer,
  instructor: instructorReducer,
  header: headerReducer,
  showCategoryContainer: categoryReducer,
  notification: notificationReducer,
});

export const rootReducers: Reducer<RootState> = (state, action) => {
  // this is to reset the state to default when user logs out
  if (action.type === "logout/logout") {
    state = {} as RootState;
  }
  return combineReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store: ToolkitStore = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
