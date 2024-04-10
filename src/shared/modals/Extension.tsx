import { ChangeEvent, FC, ReactElement, useState } from "react";
import {
  IExtendedDateModalProps,
  IExtendedEnrolment,
} from "src/features/enrolment/interfaces/enrolment.interface";
import { useRequestStartDateExtensionMutation } from "src/features/enrolment/services/enrolment.service";

import Button from "../Button/Button";
import Dropdown from "../dropdown/dropdown";
import TextAreaInput from "../Entries/TextAreaInput";
import { TimeAgo } from "../utils/time.utils";
import { showErrorToast } from "../utils/utils";
import ModalBg from "./ModalBg";

const ExtendDateModal: FC<IExtendedDateModalProps> = ({
  enrolment,
  onClose,
}): ReactElement => {
  const [reason, setReason] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>(
    "Select number of days",
  );
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [requestDeliveryDateExtension] = useRequestStartDateExtensionMutation();

  const requestExtension = async (): Promise<void> => {
    // Confirming button click event
    try {
      const extended: IExtendedEnrolment = {
        originalDate: enrolment.offer.oldStartDate,
        newDate: deliveryDate,
        days: parseInt(selectedDay),
        reason,
      };

      // Log the data you're sending
      console.log("Request data1:", extended);

      const response = await requestDeliveryDateExtension({
        enrolmentId: enrolment.enrolmentId,
        body: extended,
      }).unwrap();

      // Log the response data
      console.log("Request response equals:", response);

      onClose();
    } catch (error) {
      // Log any errors that occur during the request
      console.error("Error sending request:", error);
      showErrorToast("Error sending request");
    }
  };
  return (
    <ModalBg>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-[30] flex w-full items-center justify-center">
        <div className="relative bottom-auto left-auto right-auto top-auto max-h-[90vh] min-w-[350px] bg-white p-4">
          <div className="w-full text-left">
            <h4 className="mb-3 text-base font-bold">
              Request: Extend the start date
            </h4>
            <div className="alerts alert-warning rounded-none pb-[6px] text-sm font-semibold text-white">
              Extending the start date might student satisfaction.
            </div>
          </div>
          <div className="">
            <div className="mb-5">
              <h4 className="mb-0 text-sm font-bold">Original date</h4>
              <span className="text-[13px]">
                {TimeAgo.dayMonthYear(enrolment.offer.oldStartDate)}
              </span>
            </div>
            <div className="relative mb-[66px]">
              <h4 className="mb-[5px] text-sm font-bold">
                How many days do you want to add?
              </h4>
              <Dropdown
                text={selectedDay}
                maxHeight="300"
                mainClassNames="absolute bg-white z-40"
                values={["1", "2", "3", "4", "5"]}
                setValue={setSelectedDay}
                onClick={(item: string) => {
                  const days: number = parseInt(`${item}`);
                  const currentDate: Date = new Date(
                    enrolment.offer.oldStartDate,
                  );
                  currentDate.setDate(currentDate.getDate() + days);
                  setDeliveryDate(`${currentDate}`);
                }}
              />
            </div>
            <div className="mb-5">
              <h4 className="mb-[5px] text-sm font-bold">
                Help the student understand
              </h4>
              <TextAreaInput
                className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                name="description"
                value={reason}
                rows={3}
                onChange={(event: ChangeEvent) =>
                  setReason((event.target as HTMLTextAreaElement).value)
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="rounded bg-gray-200 px-6 py-3 text-center text-sm font-bold text-black focus:outline-none md:px-4 md:py-2 md:text-base"
              label="Cancel"
              onClick={onClose}
            />
            <Button
              disabled={!reason || !deliveryDate}
              className={`cursor-pointer rounded px-6 py-3 text-center text-sm font-bold text-white focus:outline-none md:px-4 md:py-2 md:text-base ${
                !reason || !deliveryDate
                  ? "cursor-not-allowed bg-sky-200"
                  : "bg-sky-500 hover:bg-sky-400"
              }`}
              label="Send Request"
              onClick={requestExtension}
            />
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default ExtendDateModal;
