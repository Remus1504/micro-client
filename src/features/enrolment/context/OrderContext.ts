import { Context, createContext } from "react";
import { IAuthUser } from "src/features/auth/interfaces/authenticationinterface";

import {
  IOrderContext,
  IOrderDocument,
  IOrderInvoice,
} from "../interfaces/enrolment.interface";

export const OrderContext: Context<IOrderContext> = createContext({
  order: {} as IOrderDocument,
  authUser: {} as IAuthUser,
  orderInvoice: {} as IOrderInvoice,
}) as Context<IOrderContext>;
