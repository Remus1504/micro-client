import { FC, ReactElement, useEffect } from "react";
import { InstructorCourse } from "src/features/courses/interfaces/course.interface";
import {
  useGetCoursesByCategoryQuery,
  useGetTopRatedCoursesByCategoryQuery,
} from "src/features/courses/services/course.service";
import { InstructorDocument } from "src/features/instructors/interfaces/instructor.interface";
import { useGetRandomInstructorQuery } from "src/features/instructors/services/Instructor.service";
import TopCoursesView from "src/shared/courses/TopCoursesView";
import { lowerCase } from "src/shared/utils/utils";
import { socketService } from "src/sockets/socket.service";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import FeaturedExperts from "./Experts";
import HomeCourseView from "./HomeCourseView";
import HomeSlider from "./HomeSlider";

const Home: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const { data, isSuccess } = useGetRandomInstructorQuery("10");
  const { data: categoryData, isSuccess: isCategorySuccess } =
    useGetCoursesByCategoryQuery(`${authUser.username}`);
  const { data: topCoursesData, isSuccess: isTopCoursesSucess } =
    useGetTopRatedCoursesByCategoryQuery(`${authUser.username}`);
  // const { data: sellerData, isSuccess: isSellerDataSuccess } = useGetMoreGigsLikeThisQuery('6559d9a3620b7db8c1fb7f01');
  let instructors: InstructorDocument[] = [];
  let categoryCourses: InstructorCourse[] = [];
  let topCourses: InstructorCourse[] = [];

  if (isSuccess) {
    instructors = data.instructors as InstructorDocument[];
  }

  if (isCategorySuccess) {
    categoryCourses = categoryData.courses as InstructorCourse[];
  }

  if (isTopCoursesSucess) {
    topCourses = topCoursesData.courses as InstructorCourse[];
  }

  // if (isSellerDataSuccess) {
  //   topCourses = sellerData.courses as InstructorCourse[];
  // }

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <div className="m-auto px-6 w-screen relative min-h-screen xl:container md:px-12 lg:px-6">
      <HomeSlider />
      {topCourses.length > 0 && (
        <TopCoursesView
          courses={topCourses}
          title="Top rated services in"
          subTitle={`Highest rated talents for all your ${lowerCase(
            topCourses[0].categories
          )} needs.`}
          category={topCourses[0].categories}
          width="w-72"
          type="home"
        />
      )}
      {categoryCourses.length > 0 && (
        <HomeCourseView
          courses={categoryCourses}
          title="Because you viewed a course on"
          subTitle=""
          category={categoryCourses[0].categories}
        />
      )}
      <FeaturedExperts instructors={instructors} />
    </div>
  );
};

export default Home;
