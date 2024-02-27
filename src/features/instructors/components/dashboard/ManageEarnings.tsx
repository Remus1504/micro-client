import { filter, lowerCase, sumBy } from "lodash";
import { FC, ReactElement } from "react";
import { useOutletContext } from "react-router-dom";
import { IOrderDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { shortenLargeNumbers } from "src/shared/utils/utils";

import { InstructorContextType } from "../../interfaces/instructor.interface";
import ManageEarningsTable from "./components/ManageEarningsTable";

const ManageEarnings: FC = (): ReactElement => {
  const { orders, instructor } = useOutletContext<InstructorContextType>();
  const completedOrders: IOrderDocument[] = filter(
    orders,
    (order: IOrderDocument) =>
      lowerCase(order.status) === lowerCase("Delivered")
  );
  const sum: number = sumBy(orders, "price");
  const average: number = sum / orders.length;
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
                Orders completed
              </span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">
                {instructor?.completedJobs}
              </span>
            </div>
          </div>
        </div>

        <ManageEarningsTable
          type="active"
          orders={completedOrders}
          orderTypes={completedOrders.length}
        />
      </div>
    </div>
  );
};

export default ManageEarnings;
