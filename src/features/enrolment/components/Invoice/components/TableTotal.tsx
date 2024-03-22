import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC, ReactElement, useContext } from "react";
import { EnrolmentContext } from "src/features/enrolment/context/EnrolmentContext";
import { IEnrolmentInvoiceService } from "src/features/enrolment/interfaces/enrolment.interface";

const styles = StyleSheet.create({
  tbody: {
    marginTop: 20,
    fontSize: 10,
    fontFamily: "Lato Bold",
    fontWeight: "bold",
    paddingTop: 4,
    textAlign: "center",
    flex: 1,
    height: 20,
    color: "#4aa1f3",
  },
  total: { flex: 2, textAlign: "left" },
});

const TableTotal: FC = (): ReactElement => {
  const { enrolmentInvoice } = useContext(EnrolmentContext);

  return (
    <>
      {enrolmentInvoice && Object.keys(enrolmentInvoice).length && (
        <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
          <View style={[styles.tbody, styles.total]}>
            <Text></Text>
          </View>
          <View style={styles.tbody}></View>
          <View style={styles.tbody}></View>
          <View style={styles.tbody}></View>
          <View style={styles.tbody}></View>
          <View style={styles.tbody}>
            <Text></Text>
          </View>
          <View style={styles.tbody}>
            <Text>Total</Text>
          </View>
          <View style={styles.tbody}>
            <Text>
              $
              {enrolmentInvoice.enrolmentService
                .reduce(
                  (sum: number, item: IEnrolmentInvoiceService) =>
                    sum + item.price * item.quantity,
                  0,
                )
                .toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default TableTotal;
