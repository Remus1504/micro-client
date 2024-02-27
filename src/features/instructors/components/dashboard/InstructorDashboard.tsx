import { FC, ReactElement } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Button from "src/shared/Button/Button";
import { updateHeader } from "src/shared/header/reducers/header.reducer";
import { useAppDispatch } from "src/store/store";

import {
  InstructorDocument,
  InstructorContextType,
} from "../../interfaces/instructor.interface";
import ProfileHeader from "../profile/components/ProfileHeader";
import DashboardMain from "./components/DashboardMain";

const InstructorDashboard: FC = (): ReactElement => {
  const { instructor } = useOutletContext<InstructorContextType>();
  const dispatch = useAppDispatch();

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="mt-10 flex flex-col justify-between gap-y-4">
        <ProfileHeader
          showHeaderInfo={false}
          showEditIcons={false}
          instructorProfile={instructor as InstructorDocument}
        />
        <div className="self-end">
          <Button
            onClick={() => dispatch(updateHeader("home"))}
            className="bg-green-transparent w-full rounded-md text-center text-xs font-bold text-green-500 hover:text-green-600 focus:outline-none md:bg-green-500 md:px-3 md:py-2 md:text-sm md:text-white hover:md:bg-green-600 hover:md:text-white"
            label={
              <Link to={`/manage_gigs/new/${instructor?._id}`}>
                Create a new course
              </Link>
            }
          />
        </div>
      </div>
      <DashboardMain />
    </div>
  );
};

export default InstructorDashboard;
