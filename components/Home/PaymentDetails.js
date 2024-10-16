import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";

import Header from "./SmallComponents/PayNowDetails/Header";
import AmountDetails from "./SmallComponents/PayNowDetails/AmountDetails";
import PaymentMethod from "./SmallComponents/PayNowDetails/PaymentMethod";
import InputAmount from "./SmallComponents/PayNowDetails/InputAmount";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import * as Print from "expo-print";

import generateReceipt from "@utils/Home/generateReceipt";

import { processDailySales } from "@services/firebase/Home/processDailySales";

import { useBranches } from "../../context/BranchContext";

import { retrieveEmployeeName } from "@services/firebase/Home/retrieveEmployeeName";
import { retrieveOrderModes } from "@services/firebase/Home/retrieveOrderModes";

export default function PaymentDetails({
  paymentDetailsState,
  setPaymentDetailsState,
  paymentMethod,
  setPaymentMethod,
  finalTotal,
  setPaymentDetails,
  paymentDetails,
  foodService,
  discount,
  customDiscountCode,
  retekessNumber,
  orderNumber,
  orderNote,
  customerName,
  timeElapsed,
  orderDetails,
  employeeId,
  subTotal,
  onsiteMode,
  setResetOrder,
  setFoodService,
  setCustomerName,
  setOrderNote,
  setOrderNumber,
  setRetekessNumber,
  setTimeElapsed,
  setOrderDetails,
  setCustomDiscountCode,
  setDiscount,
  setFinalTotal,
  setSubTotal,
  setOnsiteMode,
}) {
  const [paidAmount, setPaidAmount] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const orderModesData = retrieveOrderModes();
  const { selectedBranch } = useBranches();
  let consumeMethod = "";

  const orderModeCode = orderModesData.find(
    (orderMode) => foodService === orderMode.orderModeDesc
  )?.orderModeCode;

  console.log("orderModeCode", orderModeCode);

  if (!orderModeCode) {
    consumeMethod = "";
  } else if (onsiteMode === "Dine In") {
    consumeMethod = "DINE";
  } else if (onsiteMode === "Take Out") {
    consumeMethod = "TAKE";
  } else if (orderModeCode === "GB" || orderModeCode === " FP") {
    consumeMethod = "ONLN";
  } else {
    consumeMethod = "DELI";
  }

  const selectedBranchCode = selectedBranch ? selectedBranch.branchCode : null;

  const dateToday = new Date().toISOString().split("T")[0];
  const orderChange = paidAmount - finalTotal;
  const orderTakenBy = retrieveEmployeeName(employeeId);

  const printReceipt = async () => {
    const html = await generateReceipt(
      orderNumber,
      customerName,
      orderDetails,
      subTotal,
      discount,
      finalTotal
    );
    await Print.printAsync({ html });
  };

  const handlePrintPress = () => {
    printReceipt();
    processDailySales(
      selectedBranchCode,
      consumeMethod,
      discount,
      customDiscountCode,
      timeElapsed,
      orderChange,
      dateToday,
      orderDetails,
      orderModeCode,
      orderNumber,
      orderNote,
      orderTakenBy,
      paymentDetails,
      retekessNumber,
      finalTotal
    );
    setResetOrder(true);
    setFoodService("");
    setCustomerName("");
    setOrderNote("");
    setOrderNumber("");
    setRetekessNumber("");
    setTimeElapsed("");
    setOrderDetails([]);
    setCustomDiscountCode("");
    setDiscount(0);
    setFinalTotal(0);
    setSubTotal(0);
    setPaymentMethod("");
    setPaymentDetails({});
    setOnsiteMode("");
    setPaymentDetailsState(false);
  };

  return (
    <Modal visible={paymentDetailsState} transparent={true}>
      <View style={styles.background}>
        <ScrollView style={styles.container}>
          <Header
            setModalState={setPaymentDetailsState}
            foodService={foodService}
            orderNumber={orderNumber}
            retekessNumber={retekessNumber}
          />

          <AmountDetails
            finalTotal={finalTotal}
            paymentMethod={paymentMethod}
            paidAmount={paidAmount}
            paymentDetails={paymentDetails}
          />

          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            setReferenceNumber={setReferenceNumber}
            referenceNumber={referenceNumber}
          />

          <InputAmount
            setPaidAmount={setPaidAmount}
            setPaymentDetails={setPaymentDetails}
            paymentMethod={paymentMethod}
            referenceNumber={referenceNumber}
          />

          {paidAmount >= finalTotal && (
            <>
              {/* <TouchableOpacity style={styles.confirmButton}>
                <MaterialIcons name="check" size={24} color="white" />
                <Text style={styles.buttonText}>Confirm Payment Method</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.printButton}
                onPress={handlePrintPress}
              >
                <MaterialIcons name="check" size={24} color="white" />
                <Text style={styles.buttonText}>
                  Complete and Print Receipt
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, alignItems: "flex-end" },
  container: {
    backgroundColor: "white",
    width: "35%",
  },

  confirmButton: {
    marginHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#19191C",
    borderRadius: 15,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 15,
  },
  printButton: {
    marginHorizontal: 25,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B66619",
    borderRadius: 15,
    paddingVertical: 10,
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
