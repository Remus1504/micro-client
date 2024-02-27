import { FC, ReactElement, useState } from "react";
import {
  FaEllipsisH,
  FaPauseCircle,
  FaPencilAlt,
  FaPlayCircle,
  FaRegStar,
  FaStar,
  FaTrashAlt,
} from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import {
  ICoursesProps,
  InstructorCourse,
} from "src/features/courses/interfaces/course.interface";
import {
  useDeleteCourseMutation,
  useUpdateActiveCourseMutation,
} from "src/features/courses/services/course.service";
import { rating } from "src/shared/utils/utils";
import { useAppDispatch } from "src/store/store";

import { updateHeader } from "../header/reducers/header.reducer";
import ApprovalModal from "../modals/Approval";
import { IApprovalModalContent } from "../modals/interfaces/modal.interface";
import { ICourseCardItemModal } from "../shared.interface";
import {
  lowerCase,
  replaceSpacesWithDash,
  showErrorToast,
  showSuccessToast,
} from "../utils/utils";

const CourseCardItem: FC<ICoursesProps> = ({
  course: courseData,
}): ReactElement => {
  const course = courseData as InstructorCourse;
  const [courseCardItemModal, setCourseCardItemModal] =
    useState<ICourseCardItemModal>({
      overlay: false,
      deleteApproval: false,
    });
  const [approvalModalContent, setApprovalModalContent] =
    useState<IApprovalModalContent>();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const title: string = replaceSpacesWithDash(course.title);
  const [updateActiveCourse] = useUpdateActiveCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const navigateToEditCourse = (courseId: string): void => {
    setCourseCardItemModal({ ...courseCardItemModal, overlay: false });
    dispatch(updateHeader("home"));
    navigate(`/manage_courses/edit/${courseId}`, { state: course });
  };

  const onToggleCourse = async (active: boolean): Promise<void> => {
    try {
      await updateActiveCourse({ courseId: `${course.id}`, active }).unwrap();
      setCourseCardItemModal({ ...courseCardItemModal, overlay: false });
      showSuccessToast("Course status updated successfully.");
    } catch (error) {
      showErrorToast("Error setting course status.");
    }
  };

  const onDeleteCourse = async (): Promise<void> => {
    try {
      await deleteCourse({
        courseId: `${course.id}`,
        instructorId: `${course.instructorId}`,
      }).unwrap();
      setCourseCardItemModal({ deleteApproval: false, overlay: false });
      showSuccessToast("Course deleted successfully.");
    } catch (error) {
      showErrorToast("Error deleting course.");
    }
  };

  return (
    <>
      {courseCardItemModal.deleteApproval && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          onClick={onDeleteCourse}
          onClose={() =>
            setCourseCardItemModal({
              ...courseCardItemModal,
              deleteApproval: false,
            })
          }
        />
      )}
      <div className="relative">
        {courseCardItemModal.overlay && (
          <div className="border-grey absolute bottom-0 top-0 mb-8 w-full cursor-pointer border bg-white">
            <div
              onClick={() =>
                setCourseCardItemModal({
                  ...courseCardItemModal,
                  overlay: false,
                })
              }
              className="absolute -right-[12px] -top-[12px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-sky-500 bg-white text-sm font-bold leading-[0] text-sky-500"
            >
              X
            </div>
            <ul className="list-none pl-0">
              <li>
                <div
                  onClick={() => navigateToEditCourse(`${course.id}`)}
                  className="my-1 flex w-full cursor-pointer gap-4 px-4 pt-3"
                >
                  <FaPencilAlt size={13} className="flex self-center" />
                  <span className="">Edit</span>
                </div>
              </li>
              <li>
                <div
                  onClick={() => onToggleCourse(!course.active)}
                  className="my-1 flex w-full cursor-pointer gap-4 px-4 pt-3"
                >
                  {!course.active ? (
                    <FaPlayCircle size={13} className="flex self-center" />
                  ) : (
                    <FaPauseCircle size={13} className="flex self-center" />
                  )}
                  <span>{!course.active ? "Activate" : "Pause"}</span>
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    setApprovalModalContent({
                      header: "Delete this Course",
                      body: "Are you sure you want to permanently delete this course?",
                      btnText: "Delete",
                      btnColor: "bg-red-500",
                    });
                    setCourseCardItemModal({
                      ...courseCardItemModal,
                      deleteApproval: true,
                    });
                  }}
                  className="my-1 flex w-full cursor-pointer gap-4 px-4 pt-3"
                >
                  <FaTrashAlt size={13} className="flex self-center" />
                  <span className="">Delete</span>
                </div>
              </li>
            </ul>
          </div>
        )}
        <div className="border-grey mb-8 flex cursor-pointer flex-col gap-2 border">
          <Link
            onClick={() => dispatch(updateHeader("home"))}
            to={`/course/${lowerCase(`${course.username}`)}/${title}/${
              course.instructorId
            }/${course.id}/view`}
          >
            <LazyLoadImage
              src={course.coverImage}
              alt="Course cover image"
              className="w-full"
              placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            />
          </Link>
          <div className="px-2">
            <Link
              onClick={() => dispatch(updateHeader("home"))}
              to={`/course/${lowerCase(`${course.username}`)}/${title}/${
                course.instructorId
              }/${course.id}/view`}
            >
              <p className="line-clamp-2 text-[#404145] hover:text-sky-500">
                {course.basicDescription}
              </p>
            </Link>
          </div>
          <div className="flex gap-2 px-2 text-orange-400">
            {parseInt(`${course.ratingsCount}`) > 0 ? (
              <FaStar color="orange" className="mt-1" />
            ) : (
              <FaRegStar className="mt-1" />
            )}
            (
            {rating(
              parseInt(`${course.ratingSum}`) /
                parseInt(`${course.ratingsCount}`)
            )}
            )
          </div>
          <div className="flex justify-between px-2 pb-2">
            <FaEllipsisH
              size={14}
              className="self-center"
              onClick={() =>
                setCourseCardItemModal({
                  ...courseCardItemModal,
                  overlay: true,
                })
              }
            />
            <strong className="text-base font-normal">${course.price}</strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCardItem;
