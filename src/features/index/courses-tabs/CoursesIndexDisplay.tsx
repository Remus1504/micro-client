import { find, lowerCase } from "lodash";
import { FC, ReactElement, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useGetAuthCoursesByCategoryQuery } from "src/features/auth/services/authentication.service";
import {
  ICoursesProps,
  InstructorCourse,
} from "src/features/courses/interfaces/course.interface";
import CoursePaginate from "src/shared/courses/CoursePaginate";
import Header from "src/shared/header/components/Header";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import PageMessage from "src/shared/page-message/pagemessage";
import {
  categories,
  replaceAmpersandAndDashWithSpace,
  replaceDashWithSpaces,
  replaceSpacesWithDash,
} from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

import CourseIndexItem from "./CourseIndexItem";

const ITEMS_PER_PAGE = 12;

const CoursesIndexDisplay: FC<ICoursesProps> = ({ type }): ReactElement => {
  const [itemFrom, setItemFrom] = useState<string>("0");
  const [paginationType, setPaginationType] = useState<string>("forward");
  const courseCurrent = useRef<InstructorCourse[]>([]);
  const { category } = useParams<string>();
  const [searchParams] = useSearchParams({});
  const location = useLocation();
  let courses: InstructorCourse[] = [];
  let totalCourses = 0;
  const updatedSearchParams: URLSearchParams = new URLSearchParams(
    searchParams.toString()
  );
  const queryType: string =
    type === "search"
      ? replaceDashWithSpaces(`${updatedSearchParams}`)
      : `query=${replaceAmpersandAndDashWithSpace(
          `${lowerCase(`${category}`)}`
        )}&${updatedSearchParams.toString()}`;
  const { data, isSuccess, isLoading, isError } =
    useGetAuthCoursesByCategoryQuery({
      query: `${queryType}`,
      from: itemFrom,
      size: `${ITEMS_PER_PAGE}`,
      type: paginationType,
    });

  if (isSuccess) {
    courses = data?.courses as InstructorCourse[];
    courseCurrent.current = data?.courses as InstructorCourse[];
    totalCourses = data.total ?? 0;
  }

  const categoryName = find(categories(), (item: string) =>
    location.pathname.includes(replaceSpacesWithDash(`${lowerCase(`${item}`)}`))
  );
  const courseCategories = categoryName ?? searchParams.get("query");

  return (
    <div className="flex w-screen flex-col">
      <Header navClass="navbar peer-checked:navbar-active z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
      <div className="relative m-auto mb-10 mt-8 min-h-screen w-screen px-6 xl:container md:px-12 lg:px-6">
        {isLoading && !isSuccess ? (
          <CircularPageLoader />
        ) : (
          <>
            {!isLoading && courses.length > 0 ? (
              <>
                <h3 className="mb-5 flex gap-3 text-4xl">
                  {type === "search" && (
                    <span className="text-black">Results for</span>
                  )}
                  <strong className="text-black">{courseCategories}</strong>
                </h3>
                <div className="my-5">
                  <div className="grid gap-x-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.map((course: InstructorCourse) => (
                      <CourseIndexItem key={uuidv4()} course={course} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <PageMessage
                header="No services found for your search"
                body="Try a new search or get a free quote for your project from our commnunity of freelancers."
              />
            )}
          </>
        )}
        {isError && (
          <PageMessage
            header="Services issue"
            body="A network issue occured. Try agin later."
          />
        )}
        {courses.length > 0 && (
          <CoursePaginate
            courses={courseCurrent.current}
            totalCourses={totalCourses}
            showNumbers={false}
            itemsPerPage={ITEMS_PER_PAGE}
            setItemFrom={setItemFrom}
            setPaginationType={setPaginationType}
          />
        )}
      </div>
    </div>
  );
};

export default CoursesIndexDisplay;
