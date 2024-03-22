import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC, Fragment, ReactElement, useContext } from "react";
import { EnrolmentContext } from "src/features/enrolment/context/EnrolmentContext";
import { IEnrolmentInvoiceService } from "src/features/enrolment/interfaces/enrolment.interface";

const styles = StyleSheet.create({
  tbody: {
    fontSize: 9,
    paddingTop: 4,
    textAlign: "center",
    flex: 1,
    borderColor: "whitesmoke",
    borderBottomWidth: 1,
  },
  tbody2: { flex: 2, textAlign: "left" },
});

const TableBody: FC = (): ReactElement => {
  const { enrolmentInvoice } = useContext(EnrolmentContext);

  return (
    <div>
      {enrolmentInvoice &&
        Object.keys(enrolmentInvoice).length &&
        enrolmentInvoice.enrolmentService.map(
          (order: IEnrolmentInvoiceService, index: number) => (
            <Fragment key={index}>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={[styles.tbody, styles.tbody2]}>
                  <Text>{order.service}</Text>
                </View>
                <View style={[styles.tbody]}>
                  <Text></Text>
                </View>
                <View style={styles.tbody}>
                  <Text></Text>
                </View>
                <View style={styles.tbody}>
                  <Text></Text>
                </View>
                <View style={styles.tbody}>
                  <Text></Text>
                </View>
                <View style={styles.tbody}>
                  <Text>{order.quantity}</Text>
                </View>
                <View style={styles.tbody}>
                  <Text>{order.price.toFixed(2)} </Text>
                </View>
                <View style={styles.tbody}>
                  <Text>{(order.price * order.quantity).toFixed(2)}</Text>
                </View>
              </View>
            </Fragment>
          ),
        )}
    </div>
  );
};

export default TableBody;
