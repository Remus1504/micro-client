import { FC, ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  IEnrolmentDocument,
  IEnrolmentTableProps,
} from "src/features/enrolment/interfaces/enrolment.interface";
import { updateHeader } from "src/shared/header/reducers/header.reducer";
import { TimeAgo } from "src/shared/utils/time.utils";
import { useAppDispatch } from "src/store/store";
import { v4 as uuidv4 } from "uuid";

const ManageEarningsTable: FC<IEnrolmentTableProps> = ({
  type,
  enrolments,
  enrolmentTypes,
}): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col justify-between">
      <div className="border-grey border border-b-0 px-3 py-3">
        <div className="font-bold uppercase text-xs sm:text-sm md:text-base">
          Payouts{" "}
        </div>
      </div>
      <table className="border border-grey w-full table-auto flex flex-row flex-no-wrap text-sm text-gray-500 overflow-hidden sm:inline-table">
        {enrolmentTypes > 0 ? (
          <>
            <thead className="border-grey border-b text-xs uppercase text-gray-700 sm:[&>*:not(:first-child)]:hidden">
              {enrolments.map(() => (
                <tr
                  key={uuidv4()}
                  className="bg-sky-500 text-white flex flex-col flex-nowrap sm:table-row md:table-row mb-1 sm:mb-0 lg:bg-transparent lg:text-black "
                >
                  <th className="p-3 text-left md:text-center">Date</th>
                  <th className="p-3 text-left md:text-center">Activity</th>
                  <th className="p-3 text-left md:text-center">Description</th>
                  <th className="p-3 text-left md:text-center">From</th>
                  <th className="p-3 text-left md:text-center">Enrolment</th>
                  <th className="p-3 text-left md:text-center">Amount</th>
                </tr>
              ))}
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {enrolments.map((order: IEnrolmentDocument) => (
                <tr
                  key={uuidv4()}
                  className="bg-white border-b border-grey flex flex-col flex-nowrap sm:table-row mb-2 sm:mb-0 "
                >
                  <td className="p-3 text-left md:text-center">
                    {TimeAgo.dayMonthYear(`${order.events.sucessfulEnrolment}`)}
                  </td>
                  <td className="p-3 text-left md:text-center">Earning</td>
                  <td className="p-3 text-left md:text-center">order</td>
                  <td className="p-3 text-left md:text-center lowercase">
                    {order.studentUsername}
                  </td>
                  <td className="p-3 text-left md:text-center">
                    <Link
                      onClick={() => dispatch(updateHeader("home"))}
                      to={`/enrolments/${order.enrolmentId}/activities`}
                      className="underline"
                    >
                      {order.enrolmentId}
                    </Link>
                  </td>
                  <td className="px-3 text-left md:text-center text-sky-500 font-bold">
                    US ${0.8 * order.price}
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

export default ManageEarningsTable;
