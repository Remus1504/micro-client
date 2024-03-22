import { FC, ReactElement } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { applicationLogout, lowerCase } from "src/shared/utils/utils";
import { useAppDispatch } from "src/store/store";

import { IHomeHeaderProps } from "../interfaces/header.interface";
import { updateCategoryContainer } from "../reducers/category.reducer";
import { updateHeader } from "../reducers/header.reducer";

const SettingsDropdown: FC<IHomeHeaderProps> = ({
  instructor,
  authUser,
  student,
  type,
  setIsDropdownOpen,
}): ReactElement => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();

  const onLogout = (): void => {
    if (setIsDropdownOpen) {
      setIsDropdownOpen(false);
    }
    applicationLogout(dispatch, navigate);
  };

  return (
    <div className="border-grey w-44 divide-y divide-gray-100 rounded border bg-white shadow-md">
      <ul
        className="text-gray-700s py-2 text-sm"
        aria-labelledby="avatarButton"
      >
        {student && student.isInstructor && (
          <li className="mx-3 mb-1">
            <Link
              to={`${
                type === "student"
                  ? `/${lowerCase(
                      `${authUser?.username}`,
                    )}/${instructor?._id}/instructor_dashboard`
                  : "/"
              }`}
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
                dispatch(updateHeader("instructorDashboard"));
                dispatch(updateCategoryContainer(true));
              }}
              className="block w-full cursor-pointer rounded bg-sky-500 px-4s py-2 text-center font-bold text-white hover:bg-sky-400 focus:outline-none"
            >
              {type === "student"
                ? "Switch to Instructing"
                : "Switch to Student"}
            </Link>
          </li>
        )}
        {student && student.isInstructor && type === "student" && (
          <li>
            <Link
              to={`/manage_courses/new/${instructor?._id}`}
              className="block px-4 py-2 hover:text-sky-400"
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
                dispatch(updateHeader("home"));
                dispatch(updateCategoryContainer(true));
              }}
            >
              Add a new course
            </Link>
          </li>
        )}
        {type === "student" && (
          <li>
            <Link
              to={`/users/${student?.username}/${student?._id}/enrolments`}
              className="block px-4 py-2 hover:text-sky-400"
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
                dispatch(updateHeader("home"));
                dispatch(updateCategoryContainer(true));
              }}
            >
              Dashboard
            </Link>
          </li>
        )}
        {student && student.isInstructor && type === "student" && (
          <li>
            <Link
              to={`/instructor_profile/${lowerCase(
                `${instructor?.username}`,
              )}/${instructor?._id}/edit`}
              className="block px-4 py-2 hover:text-sky-400"
              onClick={() => {
                if (setIsDropdownOpen) {
                  setIsDropdownOpen(false);
                }
                dispatch(updateHeader("home"));
                dispatch(updateCategoryContainer(true));
              }}
            >
              Profile
            </Link>
          </li>
        )}
        <li>
          <Link
            to={`/${lowerCase(`${student?.username}/edit`)}`}
            className="block px-4 py-2 hover:text-sky-400"
            onClick={() => {
              if (setIsDropdownOpen) {
                setIsDropdownOpen(false);
              }
              dispatch(updateHeader("home"));
              dispatch(updateCategoryContainer(false));
            }}
          >
            Settings
          </Link>
        </li>
      </ul>
      <div className="py-1">
        <div
          onClick={() => onLogout()}
          className="block px-4 py-2 text-sm hover:text-sky-400"
        >
          Sign out
        </div>
      </div>
    </div>
  );
};

export default SettingsDropdown;
