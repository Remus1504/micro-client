import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC, ReactElement, useContext } from "react";
import { EnrolmentContext } from "src/features/enrolment/context/EnrolmentContext";
import { TimeAgo } from "src/shared/utils/time.utils";

const CLIENT_ENDPOINT = import.meta.env.VITE_CLIENT_ENDPOINT;

const styles = StyleSheet.create({
  spaceBetween: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#3E3E3E",
  },
  titleContainer: { flexDirection: "row", marginTop: 20 },
  title: { fontSize: 11, fontFamily: "Lato Bold", fontWeight: "bold" },
  subTitle: { fontSize: 10 },
  link: { fontSize: 10, color: "#4aa1f3" },
});

const InvoiceUserInfo: FC = (): ReactElement => {
  const { enrolmentInvoice } = useContext(EnrolmentContext);

  return (
    <>
      {enrolmentInvoice && Object.keys(enrolmentInvoice).length && (
        <>
          <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
              <View style={{ maxWidth: 200 }}>
                <Text style={styles.title}>To </Text>
                <Text style={styles.subTitle}>
                  {enrolmentInvoice.studentUsername}
                </Text>
              </View>
              <View style={{ maxWidth: 200 }}>
                <Text style={styles.title}>Date issued</Text>
                <Text style={styles.subTitle}>
                  {TimeAgo.dayMonthYear(`${enrolmentInvoice.date}`)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
              <View></View>
              <View style={{ maxWidth: 200 }}>
                <Text style={styles.title}>Order number</Text>
                <Link
                  src={`${`${CLIENT_ENDPOINT}/orders/${enrolmentInvoice.enrolmentId}/activities`}`}
                  style={styles.link}
                >
                  {enrolmentInvoice.enrolmentId}
                </Link>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default InvoiceUserInfo;
