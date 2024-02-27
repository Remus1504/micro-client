import { FC, ReactElement } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IOrderDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { useGetEnrolmentByStudentIdQuery } from "src/features/enrolment/services/enrolment.service";
import { lowerCase } from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

import { IHomeHeaderProps } from "../interfaces/header.interface";

const OrderDropdown: FC<IHomeHeaderProps> = ({
  student,
  setIsDropdownOpen,
}): ReactElement => {
  const { data, isSuccess } = useGetEnrolmentByStudentIdQuery(
    `${student?._id}`
  );
  let orders: IOrderDocument[] = [];
  if (isSuccess) {
    orders = data.orders as IOrderDocument[];
  }

  return (
    <div className="border-grey z-20 flex max-h-[470px] flex-col justify-between rounded border bg-white shadow-md">
      <div className="h-96 overflow-y-scroll">
        {orders.length > 0 &&
          orders.map((order: IOrderDocument) => (
            <div
              key={uuidv4()}
              className="border-grey h-[76px] border-b pt-2 text-left hover:bg-gray-50"
            >
              <Link
                to={`/orders/${order.orderId}/activities`}
                className="flex px-4"
                onClick={() => {
                  if (setIsDropdownOpen) {
                    setIsDropdownOpen(false);
                  }
                }}
              >
                <div className="mt-1 flex-shrink-0">
                  <img
                    className="h-14 w-20 object-cover"
                    src={order.courseCoverImage}
                    alt=""
                  />
                </div>
                <div className="w-full pl-3">
                  <div className="text-[13px] font-normal leading-normal">
                    {order.courseBasicTitle}
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <span className="font-normal text-[#b5b6ba]">
                      by {order.instructorUsername}
                    </span>
                    <span className="font-normal">&#x2022;</span>
                    <span
                      className={`rounded text-white px-2 ${lowerCase(
                        order.status.replace(/ /g, "")
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        {orders.length === 0 && (
          <div className="flex h-full items-center justify-center">
            No orders to show
          </div>
        )}
      </div>
      {orders.length > 0 && (
        <Link
          to={`/users/${lowerCase(
            `${student?.username}`
          )}/${student?._id}/orders`}
          className="flex h-10 cursor-pointer justify-center bg-white px-4 text-sm font-medium text-sky-500"
          onClick={() => {
            if (setIsDropdownOpen) {
              setIsDropdownOpen(false);
            }
          }}
        >
          <FaEye className="mr-2 h-4 w-4 self-center" />
          <span className="self-center">View all</span>
        </Link>
      )}
    </div>
  );
};

export default OrderDropdown;
