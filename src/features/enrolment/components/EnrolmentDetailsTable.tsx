import { PDFDownloadLink } from "@react-pdf/renderer";
import { FC, ReactElement, useRef, useState } from "react";
import { FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TimeAgo } from "src/shared/utils/time.utils";

import { EnrolmentContext } from "../context/EnrolmentContext";
import {
  IEnrolmentInvoice,
  IEnrolmentProps,
} from "../interfaces/enrolment.interface";
import Invoice from "./Invoice/Invoice";

const EnrolmentDetailsTable: FC<IEnrolmentProps> = ({
  enrolment,
  authUser,
}): ReactElement => {
  const [showOrderDetailsPanel, setShowOrderDetailsPanel] =
    useState<boolean>(false);
  const enrolmentInvoice = useRef<IEnrolmentInvoice>({} as IEnrolmentInvoice);
  if (enrolment && Object.keys(enrolment).length > 0) {
    enrolmentInvoice.current = {
      invoiceId: `${enrolment.enrolmentId}`,
      enrolmentId: `${enrolment.enrolmentId}`,
      date: `${enrolment.dateEnrolled}`,
      studentUsername: `${enrolment.studentUsername}`,
      enrolmentService: [
        {
          service: `${enrolment.courseMainTitle}`,
          quantity: 1,
          price: enrolment.price,
        },
        {
          service: "Service Fee",
          quantity: 1,
          price: parseInt(`${enrolment.serviceFee}`),
        },
      ],
    };
  }

  return (
    <div className="flex rounded-[4px] bg-white px-4 py-3">
      <div className="w-full">
        <div className="flex gap-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8ecfa]">
              <FaBox size={18} color="#32b1e3" />
            </div>
          </div>
          <div className="w-full cursor-pointer">
            <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
              <span>Your enrolment details</span>
              <div
                onClick={() =>
                  setShowOrderDetailsPanel((item: boolean) => !item)
                }
              >
                {!showOrderDetailsPanel ? (
                  <FaChevronDown size={15} />
                ) : (
                  <FaChevronUp size={15} />
                )}
              </div>
            </div>
            {showOrderDetailsPanel && enrolment && (
              <div className="my-3 flex flex-col">
                <div className="flex justify-between">
                  <div className="flex gap-2 text-sm md:text-base">
                    <div className="flex gap-2">
                      Student:
                      <Link
                        to=""
                        className="font-bold text-blue-400 hover:underline"
                      >
                        {enrolment.studentUsername}
                      </Link>
                    </div>
                    <div className="flex gap-1">|</div>
                    <div className="flex gap-2">
                      Date enrolled{" "}
                      <p className="font-bold italic">
                        {TimeAgo.dayMonthYear(`${enrolment?.dateEnrolled}`)}
                      </p>
                    </div>
                  </div>
                  {enrolment.studentUsername === authUser.username && (
                    <PDFDownloadLink
                      document={
                        <EnrolmentContext.Provider
                          value={{ enrolmentInvoice: enrolmentInvoice.current }}
                        >
                          <Invoice />
                        </EnrolmentContext.Provider>
                      }
                      fileName={`${enrolmentInvoice.current.invoiceId}.pdf`}
                    >
                      <div className="cursor-pointer text-blue-400 underline">
                        Download invoice
                      </div>
                    </PDFDownloadLink>
                  )}
                </div>
                <div className="mt-4">
                  <div className="relative overflow-x-auto">
                    <table className="border-grey w-full border text-left text-sm text-gray-500">
                      <thead className="bg-[#f3f3f3] text-xs uppercase text-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            style={{ width: "60%" }}
                          >
                            Item
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Qty
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Duration
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Price
                          </th>
                        </tr>
                        <tr>
                          <th style={{ width: "70%" }}></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td
                            scope="row"
                            className="whitespace-wrap px-4 py-4 font-bold"
                          >
                            {enrolment.offer.courseTitle}
                          </td>
                          <td className="px-4 py-4">{enrolment.quantity}</td>
                          <td className="px-4 py-4">
                            {enrolment.offer.durationInDays} day
                            {enrolment.offer.durationInDays > 1 ? "s" : ""}
                          </td>
                          <td className="px-4 py-4">${enrolment.price}</td>
                        </tr>
                        <tr className="bg-white">
                          <th
                            scope="row"
                            className="whitespace-wrap px-4 py-4 font-normal"
                          >
                            {enrolment.offer.description}
                          </th>
                          <td className="px-4 py-4"></td>
                          <td className="px-4 py-4"></td>
                          <td className="px-4 py-4"></td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-[#f3f3f3]">
                        <tr>
                          <th scope="row" className="px-4 py-3 text-base">
                            Service Fee
                          </th>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 font-bold">
                            ${enrolment.serviceFee?.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row" className="px-4 py-3 text-base">
                            Total
                          </th>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 font-bold">
                            $
                            {enrolment.price +
                              parseInt(`${enrolment.serviceFee}`)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolmentDetailsTable;
