import { FC, ReactElement, Suspense, useRef, useState } from "react";
import { FaArrowRight, FaCircleNotch, FaRegClock } from "react-icons/fa";
import { useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import RegisterModal from "src/features/auth/Components/Register";
import { useGetAuthCourseByIdQuery } from "src/features/auth/services/authentication.service";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import Button from "src/shared/Button/Button";
import Header from "src/shared/header/components/Header";
import HtmlParser from "src/shared/html-parser/HtmlParser";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import StarRating from "src/shared/rating/rating";
import { emptyCourseData } from "src/shared/utils/static";
import { rating, shortenLargeNumbers } from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

const CourseInfoDisplay: FC = (): ReactElement => {
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const { courseId } = useParams<string>();
  const { data, isSuccess, isLoading } = useGetAuthCourseByIdQuery(
    `${courseId}`,
  );
  const course = useRef<InstructorCourse>(emptyCourseData);
  if (isSuccess) {
    course.current = data.course as InstructorCourse;
  }

  return (
    <>
      {showRegisterModal && (
        <Suspense>
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            onToggle={() => {
              setShowRegisterModal(false);
            }}
          />
        </Suspense>
      )}
      <div className="flex w-screen flex-col">
        <Header navClass="navbar peer-checked:navbar-active relative z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
        {isLoading ? (
          <CircularPageLoader />
        ) : (
          <div className="relative m-auto mt-8 min-h-screen w-screen px-6 xl:container md:px-12 lg:px-6">
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
                            course.current.ratingSum /
                              course.current.ratingsCount,
                          )}
                          size={14}
                        />
                      </div>
                      <div className="ml-2 mt-[2px] flex gap-1 text-sm">
                        <span className="text-orange-400">
                          {rating(
                            course.current.ratingSum /
                              course.current.ratingsCount,
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
              </div>

              <div className="flex flex-wrap">
                <div className="order-last flex w-full flex-col p-4 lg:order-first lg:w-2/3">
                  <div className="relative flex max-h-[600px] cursor-pointer justify-center bg-[#F5F5F5]">
                    {!isLoading && isSuccess && (
                      <img
                        src={course.current.coverImage}
                        alt="Course Image"
                        className="object-contains h-full w-full transition-all duration-500 hover:scale-105"
                      />
                    )}
                    {isLoading && !isSuccess && (
                      <div className="object-contains flex h-[600px] w-full transition-all duration-500 hover:scale-105">
                        <FaCircleNotch
                          className="animate-spin h-10 w-full mr-3 flex self-center"
                          size={40}
                          color="#50b5ff"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-10 pb-6 text-lg font-semibold">
                    About This Course
                  </div>
                  <div className="pb-6">
                    <HtmlParser input={course.current.description ?? ""} />
                  </div>
                  <hr className="border-grey my-3" />
                  <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2">
                    <div className="flex flex-col">
                      <span className="text-[#95979d]">Main Categories</span>
                      <span className="font-normal">
                        {course.current.categories}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#95979d]">Sub Categories</span>
                      <div className="flex flex-col">
                        {course.current.subCategories &&
                          course.current.subCategories.map(
                            (category: string, index: number) => (
                              <span
                                className="font-normal"
                                key={uuidv4()}
                              >{`${category}${
                                index !==
                                course.current.subCategories.length - 1
                                  ? ","
                                  : ""
                              }`}</span>
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                  <hr className="border-grey my-3" />
                </div>

                <div className="w-full p-4 lg:w-1/3">
                  <StickyBox>
                    <div className="border-grey mb-8 border">
                      <div className="flex border-b px-4 py-2">
                        <h4 className="font-bold">${course.current.price}</h4>
                      </div>
                      <ul className="mb-0 list-none px-4 py-2">
                        <li className="flex justify-between">
                          <div className="ml-15 flex w-full pb-3">
                            <div className="text-base font-bold">
                              {course.current.basicTitle}
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between">
                          <div className="ml-15 flex w-full pb-4">
                            <div className="text-sm font-normal">
                              {course.current.basicDescription}
                            </div>
                          </div>
                        </li>
                        <li className="flex justify-between">
                          <div className="ml-15 flex w-full pb-3">
                            <FaRegClock className="flex self-center" />{" "}
                            <span className="ml-3 text-sm font-semibold">
                              {course.current.expectedDuration}
                            </span>
                          </div>
                        </li>
                        <li className="flex justify-between">
                          <div className="ml-15 flex w-full py-1">
                            <Button
                              className={
                                "text-md flex w-full cursor-pointer justify-between rounded bg-sky-500 px-8 py-2 font-bold text-white focus:outline-none "
                              }
                              onClick={() => setShowRegisterModal(true)}
                              label={
                                <>
                                  <span className="w-full">Continue</span>{" "}
                                  <FaArrowRight className="flex self-center" />
                                </>
                              }
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </StickyBox>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseInfoDisplay;
