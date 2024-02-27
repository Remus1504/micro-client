import { FC, ReactElement } from "react";

import CourseLeftAbout from "./CourseViewLeft/CourseLeftAbout";
import CourseLeftOverview from "./CourseViewLeft/CourseLeftOverview";
import CourseViewReviews from "./CourseViewLeft/CourseViewReviews";

const CourseViewLeft: FC = (): ReactElement => {
  return (
    <>
      <CourseLeftOverview />
      <CourseLeftAbout />
      <CourseViewReviews showRatings={true} hasFetchedReviews={false} />
    </>
  );
};

export default CourseViewLeft;
