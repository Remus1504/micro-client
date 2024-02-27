import { FC, ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IOrderDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { useGetEnrolmentByStudentIdQuery } from "src/features/enrolment/services/enrolment.service";
import { orderTypes, shortenLargeNumbers } from "src/shared/utils/utils";
import { socket, socketService } from "src/sockets/socket.service";

import StudentTable from "./StudentTable";

const STUDENT_COURSE_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  IN_PROGRESS: "in progress",
  ENROLED: "enroled",
};

const StudentDashboard: FC = (): ReactElement => {
  const [type, setType] = useState<string>(STUDENT_COURSE_STATUS.ACTIVE);
  const { studentId } = useParams<string>();
  const { data, isSuccess } = useGetEnrolmentByStudentIdQuery(`${studentId}`);
  let orders: IOrderDocument[] = [];
  if (isSuccess) {
    orders = data.orders as IOrderDocument[];
  }

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit("getLoggedInUsers", "");
  }, []);

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
              onClick={() => setType(STUDENT_COURSE_STATUS.ACTIVE)}
            >
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === STUDENT_COURSE_STATUS.ACTIVE
                    ? "pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg"
                    : ""
                }`}
              >
                Active
                {orderTypes(STUDENT_COURSE_STATUS.IN_PROGRESS, orders) > 0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      orderTypes(STUDENT_COURSE_STATUS.IN_PROGRESS, orders)
                    )}
                  </span>
                )}
              </a>
            </li>
            <li
              className="inline-block py-3 uppercase"
              onClick={() => setType(STUDENT_COURSE_STATUS.COMPLETED)}
            >
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === STUDENT_COURSE_STATUS.COMPLETED
                    ? "pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg"
                    : ""
                }`}
              >
                Completed
                {orderTypes(STUDENT_COURSE_STATUS.COMPLETED, orders) > 0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      orderTypes(STUDENT_COURSE_STATUS.COMPLETED, orders)
                    )}
                  </span>
                )}
              </a>
            </li>
            <li
              className="inline-block py-3 uppercase"
              onClick={() => setType(STUDENT_COURSE_STATUS.CANCELLED)}
            >
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === STUDENT_COURSE_STATUS.CANCELLED
                    ? "pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg"
                    : ""
                }`}
              >
                Cancelled
                {orderTypes(STUDENT_COURSE_STATUS.CANCELLED, orders) > 0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      orderTypes(STUDENT_COURSE_STATUS.CANCELLED, orders)
                    )}
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>

        {type === STUDENT_COURSE_STATUS.ACTIVE && (
          <StudentTable
            type="active"
            orders={orders}
            orderTypes={orderTypes(STUDENT_COURSE_STATUS.IN_PROGRESS, orders)}
          />
        )}
        {type === STUDENT_COURSE_STATUS.COMPLETED && (
          <StudentTable
            type="completed"
            orders={orders}
            orderTypes={orderTypes(STUDENT_COURSE_STATUS.COMPLETED, orders)}
          />
        )}
        {type === STUDENT_COURSE_STATUS.CANCELLED && (
          <StudentTable
            type="cancelled"
            orders={orders}
            orderTypes={orderTypes(STUDENT_COURSE_STATUS.CANCELLED, orders)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
