import { filter, lowerCase, sumBy } from "lodash";
import { FC, ReactElement } from "react";
import { useOutletContext } from "react-router-dom";
import { IEnrolmentDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { shortenLargeNumbers } from "src/shared/utils/utils";

import { InstructorContextType } from "../../interfaces/instructor.interface";
import ManageEarningsTable from "./components/ManageEarningsTable";

const ManageEarnings: FC = (): ReactElement => {
  const { enrolments = [], instructor } =
    useOutletContext<InstructorContextType>();
  console.log("enrolments:", enrolments, instructor);
  const completedEnrolments: IEnrolmentDocument[] = filter(
    enrolments,
    (enrolment: IEnrolmentDocument) =>
      lowerCase(enrolment.status) === lowerCase("ENROLED"),
  );
  const sum: number = sumBy(enrolments, "price");
  const average: number = sum / enrolments.length;
  const averageSellingPrice = average
    ? parseInt(shortenLargeNumbers(average))
    : 0;

  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col flex-wrap">
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3">
          <div className="border border-grey flex items-center justify-center p-8 sm:col-span-1">
            <div className="flex flex-col gap-3">
              <span className="text-center text-base lg:text-xl">
                Earnings to date
              </span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">
                ${instructor?.totalEarnings}
              </span>
            </div>
          </div>
          <div className="border border-grey flex items-center justify-center p-8 sm:col-span-1">
            <div className="flex flex-col gap-3">
              <span className="text-center text-base lg:text-xl">
                Avg. selling price
              </span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">
                ${averageSellingPrice}
              </span>
            </div>
          </div>
          <div className="border border-grey flex items-center justify-center p-8 sm:col-span-1">
            <div className="flex flex-col gap-3">
              <span className="text-center text-base lg:text-xl">
                Enrolments completed
              </span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">
                {instructor?.completedJobs}
              </span>
            </div>
          </div>
        </div>

        <ManageEarningsTable
          type="active"
          enrolments={completedEnrolments}
          enrolmentTypes={completedEnrolments.length}
        />
      </div>
    </div>
  );
};

export default ManageEarnings;
