import { FC, ReactElement, useRef } from "react";
import { useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { InstructorDocument } from "src/features/instructors/interfaces/instructor.interface";
import { useGetInstructorByIdQuery } from "src/features/instructors/services/Instructor.service";
import TopCoursesView from "src/shared/courses/TopCoursesView";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import StarRating from "src/shared/rating/rating";
import { emptyCourseData, emptyInstructorData } from "src/shared/utils/static";
import { rating } from "src/shared/utils/utils";

import { shortenLargeNumbers } from "../../../../shared/utils/utils";
import { CourseContext } from "../../context/CourseContext";
import { InstructorCourse } from "../../interfaces/course.interface";
import {
  useGetCourseByIdQuery,
  useGetMoreCoursesLikeThisQuery,
} from "../../services/course.service";
import GigViewLeft from "./components/CourseViewLeft";
import GigViewRight from "./components/CourseViewRight";

const CourseView: FC = (): ReactElement => {
  const { courseId, instructorId } = useParams<string>();
  const {
    data: courseData,
    isSuccess: isCourseDataSuccess,
    isLoading: isCourseLoading,
  } = useGetCourseByIdQuery(`${courseId}`);
  const {
    data: instructorData,
    isSuccess: isInstructorDataSuccess,
    isLoading: isInstructorLoading,
  } = useGetInstructorByIdQuery(`${instructorId}`);
  const {
    data: moreCoursesData,
    isSuccess: isMoreCoursesSuccess,
    isLoading: isMoreCoursesLoading,
  } = useGetMoreCoursesLikeThisQuery(`${courseId}`);
  const course = useRef<InstructorCourse>(emptyCourseData);
  const instructor = useRef<InstructorDocument>(emptyInstructorData);
  const moreCourses = useRef<InstructorCourse[]>([]);

  const isLoading =
    isCourseLoading && isInstructorLoading && isMoreCoursesLoading;

  if (isCourseDataSuccess) {
    course.current = courseData.course as InstructorCourse;
  }

  if (isInstructorDataSuccess) {
    instructor.current = instructorData.instructor as InstructorDocument;
  }

  if (isMoreCoursesSuccess) {
    moreCourses.current = moreCoursesData.courses as InstructorCourse[];
  }

  return (
    <>
      {isLoading ? (
        <CircularPageLoader />
      ) : (
        <main className="max-w-8xl container mx-auto mt-8">
          <h2 className="mb-4 px-4 text-xl font-bold text-[#404145] lg:text-3xl">
            {course.current.title}
          </h2>
          <div className="mb-4 flex flex-row gap-x-2 px-4">
            <img
              className="flex h-8 w-8 self-center rounded-full object-cover"
              src={course.current.profilePicture}
              alt=""
            />
            <span className="flex self-center font-extrabold">
              {course.current.username}
            </span>
            <>
              {course.current.ratingSum &&
              course.current.ratingsCount &&
              course.current.ratingSum >= 1 &&
              course.current.ratingsCount >= 1 ? (
                <>
                  <span className="flex self-center">|</span>
                  <div className="flex w-full gap-x-1 self-center">
                    <div className="mt-1 w-20 gap-x-2">
                      <StarRating
                        value={rating(
                          course.current.ratingSum / course.current.ratingsCount
                        )}
                        size={14}
                      />
                    </div>
                    <div className="ml-2 mt-[1px] flex gap-1 text-sm">
                      <span className="text-orange-400">
                        {rating(
                          course.current.ratingSum / course.current.ratingsCount
                        )}
                      </span>
                      <span className="">
                        ({shortenLargeNumbers(course.current.ratingsCount)})
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          </div>

          <CourseContext.Provider
            value={{
              course: course.current,
              instructor: instructor.current,
              isSuccess: isCourseDataSuccess,
              isLoading: isCourseLoading,
            }}
          >
            <div className="flex flex-wrap">
              <div className="order-last w-full p-4 lg:order-first lg:w-2/3">
                <GigViewLeft />
              </div>

              <div className="w-full p-4 lg:w-1/3 ">
                <StickyBox offsetTop={10} offsetBottom={10}>
                  <GigViewRight />
                </StickyBox>
              </div>
            </div>
          </CourseContext.Provider>
          {moreCourses.current.length > 0 ? (
            <div className="m-auto px-6 xl:container md:px-12 lg:px-6">
              <TopCoursesView
                courses={moreCourses.current}
                title="Recommended for you"
                subTitle=""
                width="w-60"
                type="home"
              />
            </div>
          ) : (
            <></>
          )}
        </main>
      )}
    </>
  );
};

export default CourseView;
