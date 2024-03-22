import { FC, ReactElement, useContext } from "react";
import { createSearchParams, Link } from "react-router-dom";
import { CourseContext } from "src/features/courses/context/CourseContext";
import { replaceSpacesWithDash } from "src/shared/utils/utils";
import { v4 as uuidv4 } from "uuid";

const CourseRelatedTags: FC = (): ReactElement => {
  const { course } = useContext(CourseContext);

  return (
    <div className="border-grey mb-8 border">
      <div className="flex border-b px-4 py-2">
        <h4 className="font-bold">Related tags</h4>
      </div>
      <div className="flex min-h-full flex-wrap gap-x-2 gap-y-5 px-2 py-4">
        {course?.tags.map((tag: string) => (
          <Link
            key={uuidv4()}
            to={`/search/courses?${createSearchParams({
              query: `${replaceSpacesWithDash(`${tag}`.trim())}`,
            })}`}
          >
            <span className="text-medium left-0 top-0 rounded-md bg-[#edeef3] p-2 font-bold text-[#55545b] hover:underline hover:text-sky-400">
              {tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseRelatedTags;
