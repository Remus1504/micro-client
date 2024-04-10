import { FC, ReactElement, useState } from "react";
import Button from "src/shared/Button/Button";
import DeliverWorkModal from "src/shared/modals/DeliveryModal";
import ExtendDateModal from "src/shared/modals/Extension";
import { IModalProps } from "src/shared/modals/interfaces/modal.interface";

import { useCountDown } from "../hooks/useCountDown";
import {
  IEnrolmentDisplayModal,
  IEnrolmentDocument,
} from "../interfaces/enrolment.interface";

const DeliveryTimer: FC<IModalProps> = ({
  enrolment,
  authUser,
}): ReactElement => {
  const [displayModal, setDisplayModal] = useState<IEnrolmentDisplayModal>({
    deliverWork: false,
    extendStartDate: false,
  });
  const [days, hours, minutes, seconds]: number[] = useCountDown(
    `${enrolment?.offer.newStartDate}`,
  );

  return (
    <>
      {displayModal.extendStartDate && (
        <ExtendDateModal
          enrolment={enrolment as IEnrolmentDocument}
          onClose={() =>
            setDisplayModal({ ...displayModal, extendStartDate: false })
          }
        />
      )}
      {displayModal.deliverWork && (
        <DeliverWorkModal
          enrolment={enrolment as IEnrolmentDocument}
          onClose={() =>
            setDisplayModal({ ...displayModal, deliverWork: false })
          }
        />
      )}
      <div className="mb-6 flex flex-col gap-4 rounded-[4px] bg-white px-4 py-3">
        <div className="text-base font-bold">
          {!enrolment?.delivered
            ? `Time left ${
                authUser?.username === enrolment?.instructorUsername
                  ? "to enrol"
                  : "for start"
              }`
            : "Want to deliver again?"}
        </div>
        {!enrolment?.delivered && (
          <div className="mb-1 flex justify-between text-center">
            <div className="flex flex-col text-sm font-bold md:text-base">
              {days}{" "}
              <span className="text-xs font-normal md:text-sm">days</span>
            </div>
            <div className="flex flex-col text-sm font-bold md:text-base">
              {hours}{" "}
              <span className="text-xs font-normal md:text-sm">hours</span>
            </div>
            <div className="flex flex-col text-sm font-bold md:text-base">
              {minutes}{" "}
              <span className="text-xs font-normal md:text-sm">minutes</span>
            </div>
            <div className="flex flex-col text-sm font-bold md:text-base">
              {seconds}{" "}
              <span className="text-xs font-normal md:text-sm">seconds</span>
            </div>
          </div>
        )}

        {authUser?.username === enrolment?.instructorUsername && (
          <div className="flex w-full cursor-pointer flex-col gap-4">
            <Button
              className="w-full rounded bg-green-500 px-4 py-2 text-center text-sm font-bold text-white hover:bg-green-400 focus:outline-none md:text-base"
              label={`Enrol ${!enrolment?.delivered ? "Now" : "Again"}`}
              onClick={() =>
                setDisplayModal({
                  ...displayModal,
                  deliverWork: !displayModal.deliverWork,
                })
              }
            />
            {!enrolment?.delivered && (
              <div
                className="mb-2 text-center text-sm underline"
                onClick={() =>
                  setDisplayModal({
                    ...displayModal,
                    extendStartDate: !displayModal.extendStartDate,
                  })
                }
              >
                Extend start date
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryTimer;
