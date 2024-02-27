import { FC } from "react";
import { instructorContext } from "src/features/instructors/context/InstructorContext";
import {
  IProfileHeaderProps,
  InstructorDocument,
} from "src/features/instructors/interfaces/instructor.interface";

import AboutMe from "./overview/aboutme/AboutMe";
import Certifications from "./overview/certifications/Certifications";
import Description from "./overview/description/Description";
import Education from "./overview/education/Education";
import Experience from "./overview/experience/Experience";
import Language from "./overview/language/Language";
import Skills from "./overview/skills/Skills";
import SocialLinks from "./overview/sociallinks/SocialLinks";

const InstructorOverview: FC<IProfileHeaderProps> = ({
  instructorProfile,
  setInstructorProfile,
  showEditIcons,
}) => {
  return (
    <instructorContext.Provider
      value={{
        showEditIcons,
        setInstructorProfile,
        instructorProfile: instructorProfile as InstructorDocument,
      }}
    >
      <div className="w-full py-4 lg:w-1/3">
        <Language />
        <AboutMe />
        <SocialLinks />
        <Certifications />
      </div>

      <div className="w-full pl-4 py-4 lg:w-2/3">
        <Description />
        <Experience />
        <Education />
        <Skills />
      </div>
    </instructorContext.Provider>
  );
};

export default InstructorOverview;
