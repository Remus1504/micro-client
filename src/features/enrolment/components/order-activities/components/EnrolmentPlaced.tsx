import { FC, ReactElement, useContext } from "react";
import {
  FaPencilAlt,
  FaPlaceOfWorship,
  FaRegClock,
  FaRegFile,
} from "react-icons/fa";
import { EnrolmentContext } from "src/features/enrolment/context/EnrolmentContext";
import { TimeAgo } from "src/shared/utils/time.utils";

const EnrolmentPlaced: FC = (): ReactElement => {
  const { enrolment, authUser } = useContext(EnrolmentContext);
  console.log("placeOrder:", enrolment?.events.placeOrder);
  console.log("requirements:", enrolment?.events.requirements);
  console.log("enrolmentStarted:", enrolment?.events.enrolmentStarted);
  console.log("newStartDate:", enrolment?.offer.newStartDate);

  const placeOrderDate = enrolment?.events.placeOrder
    ? TimeAgo.dayWithTime(`${enrolment?.events.placeOrder}`)
    : "";
  const requirementsDate = TimeAgo.dayWithTime(
    `${enrolment?.events.requirements}`,
  );
  const enrolmentStartedDate = TimeAgo.dayWithTime(
    `${enrolment?.events.enrolmentStarted}`,
  );
  const newStartDate = TimeAgo.dayWithTime(`${enrolment?.offer.newStartDate}`);

  return (
    <div className="flex rounded-[4px] bg-white px-4 py-3">
      <div className="w-full">
        <div className="flex gap-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cae4fc]">
              <FaRegFile size={18} color="#389af5" />
            </div>
          </div>
          <div className="w-full cursor-pointer">
            <div className="border-grey mt-2 flex items-center gap-2 border-b pb-6 text-gray-500">
              <span className="text-base font-bold">
                {enrolment?.studentUsername === authUser?.username
                  ? "You"
                  : enrolment?.studentUsername}{" "}
                placed the enrolment
              </span>
              <p className="text-sm font-normal italic">{placeOrderDate}</p>
            </div>
          </div>
        </div>

        {enrolment?.requirements !== "" && (
          <div className="flex gap-4 pt-4">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cafcfc]">
                <FaPencilAlt size={18} color="#2debeb" />
              </div>
            </div>
            <div className="w-full cursor-pointer border-grey border-b pb-6">
              <div className="mt-2 flex items-center gap-2 text-gray-500">
                <span className="text-base font-bold">
                  {enrolment?.studentUsername === authUser?.username
                    ? "You"
                    : enrolment?.studentUsername}{" "}
                  submiited the requirements
                </span>
                <p className="text-sm font-normal italic">{requirementsDate}</p>
              </div>
              <div className="mt-4 flex w-full rounded">
                <div className="mt-2">
                  <div className="px-4s pb-2 text-left text-sm text-gray-500">
                    <div className="flex flex-col">
                      <p className="col-span-2 text-sm">
                        {enrolment?.requirements}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-4 pt-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c5fce4]">
              <FaPlaceOfWorship size={18} color="#2deb98" />
            </div>
          </div>
          <div className="w-full cursor-pointer">
            <div className="border-grey mt-2 flex items-center gap-2 border-b pb-6 text-gray-500">
              <span className="text-base font-bold">
                {enrolment?.studentUsername === authUser?.username
                  ? "Your"
                  : "The"}{" "}
                enrolment started
              </span>
              <p className="text-sm font-normal italic">
                {enrolmentStartedDate}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c5fce4]">
              <FaRegClock size={18} color="#2deb98" />
            </div>
          </div>
          <div className="w-full cursor-pointer">
            <div className="border-grey mt-2 flex items-center gap-2 border-b pb-6 text-gray-500">
              <span className="text-base font-bold">
                Your enrolment date was updated to
              </span>
              <p className="text-sm font-normal italic">{newStartDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolmentPlaced;
