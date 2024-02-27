import { FC, ReactElement, useContext } from "react";
import { FaMapMarkerAlt, FaRegClock, FaUserAlt } from "react-icons/fa";
import { instructorContext } from "src/features/instructors/context/InstructorContext";
import { TimeAgo } from "src/shared/utils/time.utils";

const AboutMe: FC = (): ReactElement => {
  const { instructorProfile } = useContext(instructorContext);

  return (
    <>
      {instructorProfile ? (
        <div className="border-grey border bg-white mt-6">
          <div className="mb-1 flex justify-between border-b">
            <h4 className="flex py-2.5 pl-3.5 text-sm font-bold text-[#161c2d] md:text-base">
              ABOUT ME
            </h4>
          </div>
          <ul className="mb-0 list-none pt-1.5">
            <li className="flex justify-between text-sm md:text-base mb-2">
              <div className="col-span-3 ml-3 flex pb-3">
                <FaMapMarkerAlt className="mr-2 mt-1" />
                <div className="mr-3 font-bold">From</div>
              </div>
              <div className="mr-4">{instructorProfile.country}</div>
            </li>
            <li className="flex justify-between text-sm md:text-base mb-2">
              <div className="col-span-3 ml-3 flex pb-3">
                <FaUserAlt className="mr-2 mt-1" />
                <div className="mr-3 font-bold">Member since</div>
              </div>
              <div className="mr-4">
                {TimeAgo.formatDateToMonthAndYear(
                  `${instructorProfile.createdAt}`
                )}
              </div>
            </li>
            <li className="flex justify-between text-sm md:text-base mb-2">
              <div className="col-span-3 ml-3 flex pb-3">
                <FaRegClock className="mr-2 mt-1" />
                <div className="mr-3 font-bold">Avg. Response Time</div>
              </div>
              <div className="mr-4">
                {instructorProfile.responseTime} hour
                {instructorProfile.responseTime === 1 ? "" : "s"}
              </div>
            </li>
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AboutMe;
