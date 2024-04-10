import { findIndex } from "lodash";
import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { IEnrolmentDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import {
  enrolmentTypes,
  instructorOrderList,
  shortenLargeNumbers,
} from "src/shared/utils/utils";
import { socket } from "src/sockets/socket.service";

import { InstructorContextType } from "../../interfaces/instructor.interface";
import ManageEnrolmentsTable from "./components/ManageEnrolmentsTable";

const INSTRUCTOR_COURSE_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  IN_PROGRESS: "in progress",
  ENROLED: "delivered",
};

const ManageEnrolments: FC = (): ReactElement => {
  const [type, setType] = useState<string>(INSTRUCTOR_COURSE_STATUS.ACTIVE);
  const { enrolments } = useOutletContext<InstructorContextType>();
  const enrolmentsRef = useMemo(
    () => (Array.isArray(enrolments) ? [...enrolments] : []),
    [enrolments],
  );

  useEffect(() => {
    socket.on("enrolment notification", (enrolment: IEnrolmentDocument) => {
      const index = findIndex(enrolmentsRef, [
        "enrolmentId",
        enrolment.enrolmentId,
      ]);
      if (index > -1) {
        enrolmentsRef.splice(index, 1, enrolment);
      }
    });
  }, [enrolmentsRef]);

  return (
    <div className="container mx-auto mt-8 px-6 md:px-12 lg:px-6">
      <div className="flex flex-col flex-wrap">
        <div className="mb-8 px-4 text-xl font-semibold text-black md:px-0 md:text-2xl lg:text-4xl">
          Manage Enrolments
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
                {enrolmentTypes(
                  INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
                  enrolmentsRef,
                ) > 0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      enrolmentTypes(
                        INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
                        enrolmentsRef,
                      ),
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
                {enrolmentTypes(
                  INSTRUCTOR_COURSE_STATUS.COMPLETED,
                  enrolmentsRef,
                ) > 0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      enrolmentTypes(
                        INSTRUCTOR_COURSE_STATUS.COMPLETED,
                        enrolmentsRef,
                      ),
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
                {enrolmentTypes(
                  INSTRUCTOR_COURSE_STATUS.CANCELLED,
                  enrolmentsRef,
                ) > 0 && (
                  <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                    {shortenLargeNumbers(
                      enrolmentTypes(
                        INSTRUCTOR_COURSE_STATUS.CANCELLED,
                        enrolmentsRef,
                      ),
                    )}
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>

        {type === INSTRUCTOR_COURSE_STATUS.ACTIVE && (
          <ManageEnrolmentsTable
            type="active"
            enrolments={instructorOrderList(
              INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
              enrolmentsRef,
            )}
            enrolmentTypes={enrolmentTypes(
              INSTRUCTOR_COURSE_STATUS.IN_PROGRESS,
              enrolmentsRef,
            )}
          />
        )}
        {type === INSTRUCTOR_COURSE_STATUS.COMPLETED && (
          <ManageEnrolmentsTable
            type="completed"
            enrolments={instructorOrderList(
              INSTRUCTOR_COURSE_STATUS.COMPLETED,
              enrolmentsRef,
            )}
            enrolmentTypes={enrolmentTypes(
              INSTRUCTOR_COURSE_STATUS.COMPLETED,
              enrolmentsRef,
            )}
          />
        )}
        {type === INSTRUCTOR_COURSE_STATUS.CANCELLED && (
          <ManageEnrolmentsTable
            type="cancelled"
            enrolments={instructorOrderList(
              INSTRUCTOR_COURSE_STATUS.CANCELLED,
              enrolmentsRef,
            )}
            enrolmentTypes={enrolmentTypes(
              INSTRUCTOR_COURSE_STATUS.CANCELLED,
              enrolmentsRef,
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ManageEnrolments;
