import { FC, ReactNode, Suspense } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

import AppPage from "./features/Application";
import ConfirmEmail from "./features/auth/Components/EmailConfirmation";
import ResetPassword from "./features/auth/Components/ResetPassword";
import BuyerDashboard from "./features/student/components/Dashboard";
import Chat from "./features/chat/components/Chat";
import Error from "./features/error/Error";
import AddCourse from "./features/courses/components/course/AddCourse";
import EditCourse from "./features/courses/components/course/EditCourse";
import Courses from "./features/courses/components/courses/Courses";
import CourseView from "./features/courses/components/view/CourseView";
import Home from "./features/Home/components/HomePage";
import CourseInfoDisplay from "./features/index/courses-tabs/CourseInfoDisplay";
import CoursesIndexDisplay from "./features/index/courses-tabs/CoursesIndexDisplay";
import Checkout from "./features/enrolment/components/Checkout";
import Order from "./features/enrolment/components/Order";
import Requirement from "./features/enrolment/components/Requirement";
import ProtectedRoute from "./features/ProtectedRoute";
import AddInstructor from "./features/instructors/components/add/AddInstructor";
import ManageEarnings from "./features/instructors/components/dashboard/ManageEarnings";
import ManageOrders from "./features/instructors/components/dashboard/ManageOrders";
import Instructor from "./features/instructors/components/dashboard/Instructor";
import InstructorDashboard from "./features/instructors/components/dashboard/InstructorDashboard";
import CurrentInstructorProfile from "./features/instructors/components/profile/CurrentInstructorProfile";
import InstructorProfile from "./features/instructors/components/profile/InstructorProfile";
import Settings from "./features/settings/components/Settings";

const Layout = ({
  backgroundColor = "#fff",
  children,
}: {
  backgroundColor: string;
  children: ReactNode;
}): JSX.Element => (
  <div style={{ backgroundColor }} className="flex flex-grow">
    {children}
  </div>
);

const AppRouter: FC = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <AppPage />,
    },
    {
      path: "reset_password",
      element: (
        <Suspense>
          <ResetPassword />
        </Suspense>
      ),
    },
    {
      path: "confirm_email",
      element: (
        <Suspense>
          <ConfirmEmail />
        </Suspense>
      ),
    },
    {
      path: "/search/categories/:category",
      element: (
        <Suspense>
          <Layout backgroundColor="#ffffff">
            <CoursesIndexDisplay type="categories" />
          </Layout>
        </Suspense>
      ),
    },
    {
      path: "/courses/search",
      element: (
        <Suspense>
          <Layout backgroundColor="#ffffff">
            <CoursesIndexDisplay type="search" />
          </Layout>
        </Suspense>
      ),
    },
    {
      path: "/course/:courseId/:title",
      element: (
        <Suspense>
          <Layout backgroundColor="#ffffff">
            <CourseInfoDisplay />
          </Layout>
        </Suspense>
      ),
    },
    {
      path: "/",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Home />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/users/:username/:studentId/orders",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <BuyerDashboard />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/instructor_onboarding",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <AddInstructor />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/instructor_profile/:username/:instructorId/edit",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <CurrentInstructorProfile />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/instructor_profile/:username/:instructorId/view",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <InstructorProfile />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/:username/:instructorId",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Instructor />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          path: "insttructor_dashboard",
          element: <InstructorDashboard />,
        },
        {
          path: "manage_orders",
          element: <ManageOrders />,
        },
        {
          path: "manage_earnings",
          element: <ManageEarnings />,
        },
      ],
    },
    {
      path: "/manage_courses/new/:instructorId",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <AddCourse />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/manage_courses/edit/:courseId",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <EditCourse />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/course/:username/:title/:instructorId/:courseId/view",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <CourseView />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/categories/:category",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Courses type="categories" />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/search/courses",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Courses type="search" />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/inbox",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Chat />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/inbox/:username/:conversationId",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Chat />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/course/checkout/:courseId",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Checkout />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/course/order/requirement/:courseId",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#ffffff">
              <Requirement />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/orders/:orderId/activities",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#f5f5f5">
              <Order />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "/:username/edit",
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#f5f5f5">
              <Settings />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <Suspense>
          <Error />
        </Suspense>
      ),
    },
  ];

  return useRoutes(routes);
};

export default AppRouter;
