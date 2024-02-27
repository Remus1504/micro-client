import { FC, ReactElement } from "react";
import { IProfileTabsProps } from "src/features/instructors/interfaces/instructor.interface";
import Dropdown from "src/shared/dropdown/dropdown";

const ProfileTabs: FC<IProfileTabsProps> = ({
  type,
  setType,
}): ReactElement => {
  return (
    <>
      <div className="sm:hidden bg-white border-grey">
        <Dropdown
          text={type}
          maxHeight="300"
          values={["Overview", "Active Courses", "Ratings & Reviews"]}
          setValue={setType}
        />
      </div>
      <ul className="hidden divide-x divide-gray-200 text-center text-sm font-medium text-gray-500 shadow dark:text-gray-400 sm:flex">
        <li className="w-full">
          <div
            onClick={() => {
              if (setType) {
                setType("Overview");
              }
            }}
            className={`inline-block w-full p-4 text-gray-600 hover:text-gray-700 focus:outline-none
              ${type === "Overview" ? "bg-sky-200" : "bg-white"}
            `}
          >
            Overview
          </div>
        </li>
        <li className="w-full">
          <div
            onClick={() => {
              if (setType) {
                setType("Active Courses");
              }
            }}
            className={`inline-block w-full p-4 text-gray-600 hover:text-gray-700 focus:outline-none
              ${type === "Active Courses" ? "bg-sky-200" : "bg-white"}
            `}
          >
            Active Courses
          </div>
        </li>
        <li className="w-full">
          <div
            onClick={() => {
              if (setType) {
                setType("Ratings & Reviews");
              }
            }}
            className={`inline-block w-full p-4 text-gray-600 hover:text-gray-700 focus:outline-none
              ${type === "Ratings & Reviews" ? "bg-sky-200" : "bg-white"}
            `}
          >
            Ratings & Reviews
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProfileTabs;
