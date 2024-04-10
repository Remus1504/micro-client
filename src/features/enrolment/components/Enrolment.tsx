import {
  FC,
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import Button from "src/shared/Button/Button";
import { TimeAgo } from "src/shared/utils/time.utils";
import { socket, socketService } from "src/sockets/socket.service";
import { useAppSelector } from "src/store/store";
import { IReduxState } from "src/store/store.interface";

import { IEnrolmentDocument } from "../interfaces/enrolment.interface";
import { useGetEnrolmentByEnrolmentIdQuery } from "../services/enrolment.service";
import DeliveryTimer from "./DeliveryTimer";
import EnrolmentActivities from "./order-activities/EnrolmentActivities";
import EnrolmentDetailsTable from "./EnrolmentDetailsTable";

const Enrolment: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [showDeliveryPanel, setShowDeliveryPanel] = useState<boolean>(false);
  const [enrolment, setOrder] = useState<IEnrolmentDocument>(
    {} as IEnrolmentDocument,
  );
  const { enrolmentId } = useParams<string>();
  const elementRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const { data, isSuccess } = useGetEnrolmentByEnrolmentIdQuery(
    `${enrolmentId}`,
  );

  useEffect(() => {
    socketService.setupSocketConnection();
    if (isSuccess) {
      console.log("Data from API:", data.enrolment);
      setOrder({ ...data.enrolment } as IEnrolmentDocument);
    }
  }, [data?.enrolment, isSuccess]);

  useEffect(() => {
    socket.on("enrolment notification", (enrolment: IEnrolmentDocument) => {
      if (enrolment.enrolmentId === enrolmentId) {
        setOrder({ ...enrolment });
      }
    });
  }, [enrolmentId]);
  console.log("Show Delivery Panel state:", showDeliveryPanel);

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap">
        <div className="enrolment-last w-full p-4 lg:enrolment-first lg:w-2/3">
          <EnrolmentDetailsTable enrolment={enrolment} authUser={authUser} />
          {enrolment && enrolment.studentUsername === authUser.username && (
            <div className="mt-4 flex flex-col justify-between bg-white md:flex-row">
              <div className="flex w-full flex-col flex-wrap p-4 md:w-2/3">
                <span className="text-base font-bold text-black lg:text-lg">
                  {enrolment.delivered
                    ? "Your course is here!"
                    : "Your course has now started"}
                </span>
                {enrolment?.delivered ? (
                  <p className="mt-1 w-5/6 flex-wrap text-sm">
                    View the start date to make sure you have exactly what you
                    need. Let {enrolment.instructorUsername} know your thoughts.
                  </p>
                ) : (
                  <>
                    <p className="mt-1 w-5/6 flex-wrap text-sm">
                      We notified {enrolment.instructorUsername} about your
                      enrolment.
                    </p>
                    <p className="mt-1 w-5/6 flex-wrap text-sm">
                      You should start your course by{" "}
                      {TimeAgo.dayMonthYear(enrolment.offer.newStartDate)}
                    </p>
                  </>
                )}
              </div>
              <div className="mb-4 ml-5 w-full justify-center self-center text-left md:mr-3 md:w-1/3 md:text-right">
                {enrolment &&
                  enrolment.delivered &&
                  enrolment.studentUsername === authUser.username && (
                    <Button
                      className="rounded bg-sky-500 px-2 py-2 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                      label="View Enrolment"
                      onClick={() => {
                        if (elementRef.current) {
                          elementRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                        setShowDeliveryPanel(!showDeliveryPanel);
                      }}
                    />
                  )}
              </div>
            </div>
          )}
          {enrolment && Object.keys(enrolment).length > 0 && (
            <EnrolmentActivities
              ref={elementRef}
              enrolment={enrolment}
              authUser={authUser}
              viewDeliveryBtnClicked={showDeliveryPanel}
            />
          )}
        </div>

        <div className="w-full p-4 lg:w-1/3 ">
          {Object.keys(enrolment).length > 0 ? (
            <>
              {enrolment.delivered &&
                authUser.username === enrolment.instructorUsername && (
                  <DeliveryTimer enrolment={enrolment} authUser={authUser} />
                )}
              {enrolment.delivered &&
                authUser.username === enrolment.instructorUsername && <></>}
              {!enrolment.delivered && (
                <DeliveryTimer enrolment={enrolment} authUser={authUser} />
              )}

              <div className="bg-white">
                <div className="mb-2 flex flex-col border-b px-4 pb-4 pt-3 md:flex-row">
                  <img
                    className="h-11 w-20 object-cover"
                    src={enrolment?.courseCoverImage}
                    alt="Course Cover Image"
                  />
                  <div className="flex flex-col">
                    <h4 className="mt-2 text-sm font-bold text-[#161c2d] md:mt-0 md:pl-4">
                      {enrolment.offer.courseTitle}
                    </h4>
                    <span
                      className={`status mt-1 w-24 rounded px-[3px] py-[3px] text-xs font-bold uppercase text-white md:ml-4 ${enrolment.status.replace(
                        / /g,
                        "",
                      )}`}
                    >
                      {enrolment.status}
                    </span>
                  </div>
                </div>
                <ul className="mb-0 list-none">
                  <li className="flex justify-between px-4 pb-2 pt-2">
                    <div className="flex gap-2 text-sm font-normal">
                      Enroled from
                    </div>
                    <span className="text-sm font-bold text-green-500">
                      {enrolment?.instructorUsername}
                    </span>
                  </li>
                  <li className="flex justify-between px-4 pb-2 pt-2">
                    <div className="flex gap-2 text-sm font-normal">
                      Enrolments
                    </div>
                    <span className="text-sm font-bold">
                      #{enrolment?.enrolmentId}
                    </span>
                  </li>
                  <li className="flex justify-between px-4 pb-2 pt-2">
                    <div className="flex gap-2 text-sm font-normal">
                      Start date
                    </div>
                    <span className="text-sm font-bold">
                      {TimeAgo.dayMonthYear(enrolment?.offer?.newStartDate)}
                    </span>
                  </li>
                  <li className="flex justify-between px-4 pb-4 pt-2">
                    <div className="flex gap-2 text-sm font-normal">
                      Total price
                    </div>
                    <span className="text-sm font-bold">
                      ${enrolment?.price}
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enrolment;
