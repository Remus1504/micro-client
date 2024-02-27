import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import HomeHeader from "src/shared/header/components/HomeHeader";
import CircularPageLoader from "src/shared/page-loader/CirclePageLoader";
import {
  applicationLogout,
  getDataFromLocalStorage,
  saveToSessionStorage,
} from "src/shared/utils/utils";
import { socket } from "src/sockets/socket.service";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import { addAuthUser } from "./auth/reducers/authentication.reducers";
import { useCheckCurrentUserQuery } from "./auth/services/authentication.service";
import { addStudent } from "./student/reducers/student.reducer";
import { useGetCurrentStudentByUsernameQuery } from "./student/services/student.service";
import Home from "../features/Home/components/HomePage";
import Index from "./index/index";
import { addInstructor } from "./instructors/reducers/instructor.reducer";
import { useGetInstructorByUsernameQuery } from "./instructors/services/Instructor.service";

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const appLogout = useAppSelector((state: IReduxState) => state.logout);
  const showCategoryContainer = useAppSelector(
    (state: IReduxState) => state.showCategoryContainer
  );
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { data: currentUserData, isError } = useCheckCurrentUserQuery(
    undefined,
    { skip: authUser.id === null }
  );
  const { data: studentData, isLoading: isStudentLoading } =
    useGetCurrentStudentByUsernameQuery(undefined, {
      skip: authUser.id === null,
    });
  const { data: instructorData, isLoading: isInstructorLoading } =
    useGetInstructorByUsernameQuery(`${authUser.username}`, {
      skip: authUser.id === null,
    });

  const checkUser = useCallback(async () => {
    try {
      if (currentUserData && currentUserData.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: currentUserData.user }));
        dispatch(addStudent(studentData?.student));
        dispatch(addInstructor(instructorData?.instructor));
        saveToSessionStorage(
          JSON.stringify(true),
          JSON.stringify(authUser.username)
        );
        const becomeAInstructor = getDataFromLocalStorage("becomeAInstructor");
        if (becomeAInstructor) {
          navigate("/instructor_onboarding");
        }
        if (authUser.username !== null) {
          socket.emit("loggedInUsers", authUser.username);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    currentUserData,
    navigate,
    dispatch,
    appLogout,
    authUser.username,
    studentData,
    instructorData,
  ]);

  const logoutUser = useCallback(async () => {
    if ((!currentUserData && appLogout) || isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [currentUserData, dispatch, navigate, appLogout, isError]);

  useEffect(() => {
    checkUser();
    logoutUser();
  }, [checkUser, logoutUser]);

  if (authUser) {
    return !tokenIsValid && !authUser.id ? (
      <Index />
    ) : (
      <>
        {isStudentLoading && isInstructorLoading ? (
          <CircularPageLoader />
        ) : (
          <>
            <HomeHeader showCategoryContainer={showCategoryContainer} />
            <Home />
          </>
        )}
      </>
    );
  } else {
    return <Index />;
  }
};

export default AppPage;
