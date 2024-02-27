import { find } from "lodash";
import { FC, useRef, useState } from "react";
import {
  Location,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import CourseCardDisplayItem from "src/shared/courses/CourseCardDisplayItem";
import CoursePaginate from "src/shared/courses/CoursePaginate";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import PageMessage from "src/shared/page-message/pagemessage";
import {
  categories,
  getDataFromLocalStorage,
  lowerCase,
  replaceAmpersandAndDashWithSpace,
  replaceDashWithSpaces,
  replaceSpacesWithDash,
  saveToLocalStorage,
} from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

import {
  ICoursesProps,
  InstructorCourse,
} from "../../interfaces/course.interface";
import { useSearchCoursesQuery } from "../../services/search.service";
import BudgetDropdown from "./components/BudgetDropdown";
import DeliveryTimeDropdown from "./components/DeliveryTimeDropdown";

const ITEMS_PER_PAGE = 10;

const Courses: FC<ICoursesProps> = ({ type }) => {
  const [itemFrom, setItemFrom] = useState<string>("0");
  const [paginationType, setPaginationType] = useState<string>("forward");
  const [searchParams] = useSearchParams();
  const { category } = useParams<string>();
  const location: Location = useLocation();
  const updatedSearchParams: URLSearchParams = new URLSearchParams(
    searchParams.toString()
  );
  const queryType: string =
    type === "search"
      ? replaceDashWithSpaces(`${updatedSearchParams}`)
      : `query=${replaceAmpersandAndDashWithSpace(
          `${lowerCase(`${category}`)}`
        )}&${updatedSearchParams.toString()}`;
  const { data, isSuccess, isLoading, isError } = useSearchCoursesQuery({
    query: `${queryType}`,
    from: itemFrom,
    size: `${ITEMS_PER_PAGE}`,
    type: paginationType,
  });
  const courses = useRef<InstructorCourse[]>([]);
  let totalCourses = 0;
  const filterApplied = getDataFromLocalStorage("filterApplied");
  const categoryName = find(categories(), (item: string) =>
    location.pathname.includes(replaceSpacesWithDash(`${lowerCase(`${item}`)}`))
  );
  const courseCategories = categoryName ?? searchParams.get("query");

  if (isSuccess) {
    courses.current = data.courses as InstructorCourse[];
    totalCourses = data.total ?? 0;
    saveToLocalStorage("filterApplied", JSON.stringify(false));
  }

  return (
    <>
      {isLoading && !isSuccess ? (
        <CircularPageLoader />
      ) : (
        <div className="container mx-auto items-center p-5">
          {!isLoading && data && data.courses && data?.courses.length > 0 ? (
            <>
              <h3 className="mb-5 flex gap-3 text-4xl">
                {type === "search" && (
                  <span className="text-black">Results for</span>
                )}
                <strong className="text-black">{courseCategories}</strong>
              </h3>
              <div className="mb-4 flex gap-4">
                <BudgetDropdown />
                <DeliveryTimeDropdown />
              </div>
              <div className="my-5">
                <div className="">
                  <span className="font-medium text-[#74767e]">
                    {data.total} services available
                  </span>
                </div>
                {filterApplied ? (
                  <CircularPageLoader />
                ) : (
                  <div className="grid gap-x-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data &&
                      data.courses &&
                      data?.courses.map((course: InstructorCourse) => (
                        <CourseCardDisplayItem
                          key={uuidv4()}
                          course={course}
                          linkTarget={true}
                          showEditIcon={false}
                        />
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <PageMessage
              header="No services found for your search"
              body="Try a new search or get a free quote for your project from our commnunity of freelancers."
            />
          )}
          {isError && (
            <PageMessage
              header="Services issue"
              body="A network issue occured. Try agin later."
            />
          )}
          {isSuccess &&
            !filterApplied &&
            data &&
            data.courses &&
            data.courses.length > 0 && (
              <CoursePaginate
                courses={courses.current}
                totalCourses={totalCourses}
                showNumbers={true}
                itemsPerPage={ITEMS_PER_PAGE}
                setItemFrom={setItemFrom}
                setPaginationType={setPaginationType}
              />
            )}
        </div>
      )}
    </>
  );
};

export default Courses;
