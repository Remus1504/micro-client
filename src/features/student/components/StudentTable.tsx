import { FC, ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  IEnrolmentDocument,
  IEnrolmentTableProps,
} from "src/features/enrolment/interfaces/enrolment.interface";
import { TimeAgo } from "src/shared/utils/time.utils";
import { lowerCase } from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

const studentTable: FC<IEnrolmentTableProps> = ({
  type,
  enrolments,
  enrolmentTypes,
}): ReactElement => {
  return (
    <div className="flex flex-col">
      <div className="border-grey border border-b-0 px-3 py-3">
        <div className="text-xs font-bold uppercase sm:text-sm md:text-base">
          {type} enrolments{" "}
        </div>
      </div>
      <table className="border-grey flex-no-wrap flex w-full table-auto flex-row overflow-hidden border text-sm text-gray-500 sm:inline-table">
        {enrolmentTypes > 0 ? (
          <>
            <thead className="border-grey border-b text-xs uppercase text-gray-700 sm:[&>*:not(:first-child)]:hidden">
              {enrolments.map(() => (
                <tr
                  key={uuidv4()}
                  className="mb-1 flex flex-col flex-nowrap bg-sky-500 text-white sm:mb-0 sm:table-row md:table-row lg:bg-transparent lg:text-black"
                >
                  <th className="p-3 text-center md:w-[6%]">
                    <span className="block lg:hidden">Image</span>
                  </th>
                  <th className="p-3 text-center md:w-[40%]">
                    <span className="block lg:hidden">Title</span>
                  </th>
                  <th className="p-3 text-center">Order Date</th>
                  <th className="p-3 text-center">
                    {type === "cancelled" ? "Cancelled On" : "Due On"}
                  </th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              ))}
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {enrolments.map((enrolment: IEnrolmentDocument) => (
                <tr
                  key={uuidv4()}
                  className="border-grey mb-2 flex flex-col flex-nowrap border-b bg-white sm:mb-0 sm:table-row "
                >
                  <td className="px-3 py-3 lg:flex lg:justify-center">
                    <img
                      className="h-6 w-10 object-cover lg:h-8 lg:w-11"
                      src={enrolment.courseCoverImage}
                      alt="Course cover image"
                    />
                  </td>
                  <td className="p-3 text-left">
                    <div className="grid">
                      <Link
                        to={`/enrolments/${enrolment.enrolmentId}/activities`}
                        className="truncate text-sm font-normal hover:text-sky-500"
                      >
                        {enrolment.courseBasicTitle}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3 text-left lg:text-center">
                    {TimeAgo.dayMonthYear(`${enrolment.dateEnrolled}`)}
                  </td>
                  <td className="p-3 text-left lg:text-center">
                    {type === "cancelled"
                      ? TimeAgo.dayMonthYear(`${enrolment.approvedAt}`)
                      : TimeAgo.dayMonthYear(`${enrolment.offer.newStartDate}`)}
                  </td>
                  <td className="p-3 text-left lg:text-center">
                    ${enrolment.price}
                  </td>
                  <td className="px-3 py-1 text-left lg:p-3 lg:text-center">
                    <span
                      className={`status rounded bg-transparent p-0 text-xs font-bold uppercase text-black sm:px-[5px] sm:py-[4px] sm:text-white ${lowerCase(
                        enrolment.status.replace(/ /g, ""),
                      )}`}
                    >
                      {enrolment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td className="w-full px-4 py-2 text-sm">
                No {type} enrolments to show.
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default studentTable;
