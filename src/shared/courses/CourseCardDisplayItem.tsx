import { find } from "lodash";
import { FC, ReactElement, useEffect, useRef } from "react";
import { FaPencilAlt, FaRegStar, FaStar } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import {
  ICourseCardItems,
  InstructorCourse,
} from "src/features/courses/interfaces/course.interface";
import {
  rating,
  replaceAmpersandAndDashWithSpace,
} from "src/shared/utils/utils";
import { socket, socketService } from "src/sockets/socket.service";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import { lowerCase, replaceSpacesWithDash } from "../utils/utils";

const CourseCardDisplayItem: FC<ICourseCardItems> = ({
  course,
  linkTarget,
  showEditIcon,
}): ReactElement => {
  const instructor = useAppSelector((state: IReduxState) => state.instructor);
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const instructorUsername = useRef<string>("");
  const title: string = replaceSpacesWithDash(course.title);
  const navigate: NavigateFunction = useNavigate();

  const navigateToEditCourse = (courseId: string): void => {
    navigate(`/manage_courses/edit/${courseId}`, { state: course });
  };

  const saveCourseTitle = (course: InstructorCourse): void => {
    if (authUser?.username) {
      const category: string = replaceAmpersandAndDashWithSpace(
        course.categories,
      );
      socket.emit("category", category, authUser.username);
    }
  };

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit("getLoggedInUsers", "");
    socket.on("online", (data: string[]) => {
      instructorUsername.current = find(
        data,
        (name: string) => name === course.username,
      ) as string;
    });
  }, [authUser.username, course.username]);

  return (
    <div className="rounded">
      <div className="mb-8 flex cursor-pointer flex-col gap-2">
        <Link
          to={`/course/${lowerCase(`${course.username}`)}/${title}/${
            course.instructorId
          }/${course.id}/view`}
          onClick={() => saveCourseTitle(course)}
        >
          <LazyLoadImage
            src={course.coverImage}
            alt="Course cover image"
            className="w-full rounded-lg"
            wrapperClassName="bg-center"
            placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            effect="opacity"
          />
        </Link>
        <div className="flex items-center gap-2 relative">
          <LazyLoadImage
            src={course.profilePicture}
            alt="Profile image"
            className="h-7 w-8 rounded-full object-cover"
            wrapperClassName="bg-center"
            placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            effect="opacity"
          />
          {instructorUsername.current === course.username && (
            <span className="bottom-0 left-5 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
          )}
          <div className="flex w-full justify-between">
            <span className="text-md hover:underline">
              {linkTarget ? (
                <Link
                  to={`/instructor_profile/${lowerCase(`${course.username}`)}/${
                    course.instructorId
                  }/${
                    instructor.username === course.username ? "edit" : "view"
                  }`}
                >
                  <strong className="text-sm font-medium md:text-base">
                    {course.username}
                  </strong>
                </Link>
              ) : (
                <strong className="text-sm font-medium md:text-base">
                  {course.username}
                </strong>
              )}
            </span>
            {showEditIcon && (
              <FaPencilAlt
                className="mr-2 flex self-center"
                size={15}
                onClick={() => navigateToEditCourse(`${course.id}`)}
              />
            )}
          </div>
        </div>
        <div>
          <Link
            to={`/course/${lowerCase(`${course.username}`)}/${title}/${
              course.instructorId
            }/${course.id}/view`}
            onClick={() => saveCourseTitle(course)}
          >
            <p className="line-clamp-2 text-sm text-[#404145] hover:underline md:text-base">
              {course.basicDescription}
            </p>
          </Link>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          {parseInt(`${course.ratingsCount}`) > 0 ? <FaStar /> : <FaRegStar />}
          <strong className="text-sm font-bold">
            (
            {rating(
              parseInt(`${course.ratingSum}`) /
                parseInt(`${course.ratingsCount}`),
            )}
            )
          </strong>
        </div>
        <div>
          <strong className="text-sm font-bold md:text-base">
            From ${course.price}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CourseCardDisplayItem;
