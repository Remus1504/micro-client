import {
  FC,
  lazy,
  LazyExoticComponent,
  ReactElement,
  Suspense,
  useEffect,
} from "react";
import { IHeader } from "src/shared/header/interfaces/header.interface";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import { saveToSessionStorage } from "src/shared/utils/utils";

import Categories from "./Categories";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import CourseTabs from "./courses-tabs/CoursesTabs";

const IndexHeader: LazyExoticComponent<FC<IHeader>> = lazy(
  () => import("src/shared/header/components/Header"),
);

const Index: FC = (): ReactElement => {
  useEffect(() => {
    saveToSessionStorage(JSON.stringify(false), JSON.stringify(""));
  }, []);

  return (
    <div className="flex flex-col">
      <Suspense fallback={<CircularPageLoader />}>
        <IndexHeader navClass="navbar peer-checked:navbar-active fixed z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
        <Hero />
        <CourseTabs />
        <HowItWorks />
        <hr />
        <Categories />
      </Suspense>
    </div>
  );
};

export default Index;
