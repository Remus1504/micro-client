import { FC, ReactElement, useContext } from "react";
import { CourseContext } from "src/features/courses/context/CourseContext";
// import HtmlParser from 'src/shared/html-parser/HtmlParser';
import { v4 as uuidv4 } from "uuid";

const CourseLeftAbout: FC = (): ReactElement => {
  const { course } = useContext(CourseContext);

  return (
    <>
      <div className="font-semibold text-lg mt-10 pb-6">About This Course</div>
      <div className="pb-6">
        {/* <HtmlParser input={course.description} /> */}
        {course.description}
      </div>
      <hr className="border-grey my-3" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4">
        <div className="flex flex-col">
          <span className="text-[#95979d]">Main Categories</span>
          <span className="font-normal">{course.categories}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#95979d]">Sub Categories</span>
          <div className="flex flex-col">
            {course?.subCategories.map((category: string, index: number) => (
              <span className="font-normal" key={uuidv4()}>
                {`${category}${
                  index !== course.subCategories.length - 1 ? "," : ""
                }`}
                &nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-grey my-3" />
    </>
  );
};

export default CourseLeftAbout;
