import { FC, ReactElement } from "react";

import CoursePackage from "./CourseViewRight/CoursePackage";
import CourseRelatedTags from "./CourseViewRight/CourseRelatedTags";
import CourseInstructor from "./CourseViewRight/CourseInstructor";

const CourseViewRight: FC = (): ReactElement => {
  return (
    <>
      <CoursePackage />
      <CourseInstructor />
      <CourseRelatedTags />
    </>
  );
};

export default CourseViewRight;
