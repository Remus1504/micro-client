import { findIndex } from "lodash";
import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IOrderDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import {
  orderTypes,
  sellerOrderList,
  shortenLargeNumbers,
} from "src/shared/utils/utils";
import { socket } from "src/sockets/socket.service";

import { InstructorContextType } from "../../interfaces/instructor.interface";
import ManageOrdersTable from "./components/ManageOrdersTable";

const INSTRUCTOR_COURSE_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  IN_PROGRESS: "in progress",
  ENROLED: "delivered",
};

const ManageOrders: FC = (): ReactElement => {
  const [type, setType] = useState<string>(INSTRUCTOR_COURSE_STATUS.ACTIVE);
  const { orders } = useOutletContext<InstructorContextType>();
  const ordersRef = useMemo(() => [...orders], [orders]);

  useEffect(() => {
    socket.on("order notification", (order: IOrderDocument) => {
      const index = findIndex(ordersRef, ["orderId", order.orderId]);
      if (index > -1) {
        ordersRef.splice(index, 1, order);
      }
    });
  }, [ordersRef]);

  return (
    <div className="container mx-auto mt-8 px-6 md:px-12 lg:px-6">
      <div className="flex flex-col flex-wrap">
        <div className="mb-8 px-4 text-xl font-semibold text-black md:px-0 md:text-2xl lg:text-4xl">
          Manage Orders
        </div>
        <div className="p-0">
          <ul className="flex w-full cursor-pointer list-none flex-col flex-wrap rounded-[2px] sm:flex-none sm:flex-row">
            <li
              className="inline-block py-3 uppercase"
              onClick={() => setType(INSTRUCTOR_COURSE_STATUS.ACTIVE)}
            >
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === INSTRUCTOR_COURSE_STATUS.ACTIVE
                    ? "pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg"
                    : ""
                }`}
              >
                Active
                {orderTypes(INSTRUCTOR_COURSE_STATUS.IN_PROGRESS, ordersRef) >
                  0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      orderTypes(
                        INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
                        ordersRef
                      )
                    )}
                  </span>
                )}
              </a>
            </li>
            <li
              className="inline-block py-3 uppercase"
              onClick={() => setType(INSTRUCTOR_COURSE_STATUS.COMPLETED)}
            >
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === INSTRUCTOR_COURSE_STATUS.COMPLETED
                    ? "pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg"
                    : ""
                }`}
              >
                Completed
                {orderTypes(INSTRUCTOR_COURSE_STATUS.COMPLETED, ordersRef) >
                  0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      orderTypes(INSTRUCTOR_COURSE_STATUS.COMPLETED, ordersRef)
                    )}
                  </span>
                )}
              </a>
            </li>
            <li
              className="inline-block py-3 uppercase"
              onClick={() => setType(INSTRUCTOR_COURSE_STATUS.CANCELLED)}
            >
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === INSTRUCTOR_COURSE_STATUS.CANCELLED
                    ? "pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg"
                    : ""
                }`}
              >
                Cancelled
                {orderTypes(INSTRUCTOR_COURSE_STATUS.CANCELLED, ordersRef) >
                  0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      orderTypes(INSTRUCTOR_COURSE_STATUS.CANCELLED, ordersRef)
                    )}
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>

        {type === INSTRUCTOR_COURSE_STATUS.ACTIVE && (
          <ManageOrdersTable
            type="active"
            orders={sellerOrderList(
              INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
              ordersRef
            )}
            orderTypes={orderTypes(
              INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
              ordersRef
            )}
          />
        )}
        {type === INSTRUCTOR_COURSE_STATUS.COMPLETED && (
          <ManageOrdersTable
            type="completed"
            orders={sellerOrderList(
              INSTRUCTOR_COURSE_STATUS.COMPLETED,
              ordersRef
            )}
            orderTypes={orderTypes(
              INSTRUCTOR_COURSE_STATUS.COMPLETED,
              ordersRef
            )}
          />
        )}
        {type === INSTRUCTOR_COURSE_STATUS.CANCELLED && (
          <ManageOrdersTable
            type="cancelled"
            orders={sellerOrderList(
              INSTRUCTOR_COURSE_STATUS.CANCELLED,
              ordersRef
            )}
            orderTypes={orderTypes(
              INSTRUCTOR_COURSE_STATUS.CANCELLED,
              ordersRef
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
