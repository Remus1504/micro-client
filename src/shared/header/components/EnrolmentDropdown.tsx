import { FC, ReactElement } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IEnrolmentDocument } from "src/features/enrolment/interfaces/enrolment.interface";
import { useGetEnrolmentByStudentIdQuery } from "src/features/enrolment/services/enrolment.service";
import { lowerCase } from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

import { IHomeHeaderProps } from "../interfaces/header.interface";

const EnrolmentDropdown: FC<IHomeHeaderProps> = ({
  student,
  setIsDropdownOpen,
}): ReactElement => {
  const { data, isSuccess } = useGetEnrolmentByStudentIdQuery(
    `${student?._id}`,
  );
  console.log(data);
  console.log(isSuccess);
  let enrolments: IEnrolmentDocument[] = [];

  if (isSuccess) {
    if (data && Array.isArray(data.enrolments)) {
      enrolments = data.enrolments as IEnrolmentDocument[];
    } else {
      // Handle cases where enrolments are not as expected
      // Could log the data, display a message, etc.
      console.log("Unexpected data structure:", data);
      enrolments = []; // Ensure enrolments is always an array for safe rendering
    }
  }

  return (
    <div className="border-grey z-20 flex max-h-[470px] flex-col justify-between rounded border bg-white shadow-md">
      <div className="h-96 overflow-y-scroll">
        {enrolments.length > 0 &&
          enrolments.map((enrolment: IEnrolmentDocument) => (
            <div
              key={uuidv4()}
              className="border-grey h-[76px] border-b pt-2 text-left hover:bg-gray-50"
            >
              <Link
                to={`/enrolments/${enrolment.enrolmentId}/activities`}
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
                    src={enrolment.courseCoverImage}
                    alt=""
                  />
                </div>
                <div className="w-full pl-3">
                  <div className="text-[13px] font-normal leading-normal">
                    {enrolment.courseBasicTitle}
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <span className="font-normal text-[#b5b6ba]">
                      by {enrolment.instructorUsername}
                    </span>
                    <span className="font-normal">&#x2022;</span>
                    <span
                      className={`rounded text-white px-2 ${lowerCase(
                        enrolment.status.replace(/ /g, ""),
                      )}`}
                    >
                      {enrolment.status}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        {enrolments.length === 0 && (
          <div className="flex h-full items-center justify-center">
            No enrolments to show
          </div>
        )}
      </div>
      {enrolments.length > 0 && (
        <Link
          to={`/users/${lowerCase(
            `${student?.username}`,
          )}/${student?._id}/enrolments`}
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

export default EnrolmentDropdown;
