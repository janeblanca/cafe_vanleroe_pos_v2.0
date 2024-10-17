import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Discounts({
  setDiscount,
  subTotal,
  discountCodes,
  customDiscountCode,
  setCustomDiscountCode,
}) {
  const { height } = useWindowDimensions();
  const styles = makeStyles(height);

  const [selectedButton, setSelectedButton] = useState(null);

  const studentDiscount = 10.00000001;

  const handlePress = (button) => {
    if (selectedButton === button) {
      // If the same button is pressed again, reset the discount to 0
      setSelectedButton(null);
      setDiscount(0);
    } else {
      // Update the selected button and apply the corresponding discount
      setSelectedButton(button);

      if (button === "senior" || button === "20") {
        setDiscount((subTotal * 0.2).toFixed(2));
      } else if (button === "student") {
        setDiscount(studentDiscount.toFixed(2));
      } else if (button === "10") {
        setDiscount((subTotal * 0.1).toFixed(2));
      } else if (button === "30") {
        setDiscount((subTotal * 0.3).toFixed(2));
      } else if (button === "40") {
        setDiscount((subTotal * 0.4).toFixed(2));
      }
    }
  };

  const handleApplyDiscount = () => {
    const foundDiscount = discountCodes.find(
      (code) => code.discountCd === customDiscountCode.trim()
    );

    if (foundDiscount) {
      const discountAmount = foundDiscount.discountAmount;
      setSelectedButton(customDiscountCode);
      setDiscount(discountAmount.toFixed(2));
    } else {
      alert("Invalid discount code.");
      setSelectedButton(null);
      setDiscount(0);
    }
  };

  const getButtonColor = (button) => {
    return selectedButton === button ? "#592508" : "#B66619";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Percentage Discounts</Text>

      <View style={styles.discountContainer}>
        <Pressable
          style={[
            styles.discountButton,
            { backgroundColor: getButtonColor("senior") },
          ]}
          onPress={() => handlePress("senior")}
        >
          <Text style={styles.discountText}>Senior Citizen/PWD</Text>
        </Pressable>
        <Pressable
          style={[
            styles.discountButton,
            { backgroundColor: getButtonColor("student") },
          ]}
          onPress={() => handlePress("student")}
        >
          <Text style={styles.discountText}>Student</Text>
        </Pressable>
      </View>

      <View style={styles.discountContainer}>
        <Pressable
          style={[
            styles.discountButton,
            { backgroundColor: getButtonColor("10") },
          ]}
          onPress={() => handlePress("10")}
        >
          <Text style={styles.discountText}>10%</Text>
        </Pressable>
        <Pressable
          style={[
            styles.discountButton,
            { backgroundColor: getButtonColor("20") },
          ]}
          onPress={() => handlePress("20")}
        >
          <Text style={styles.discountText}>20%</Text>
        </Pressable>
      </View>

      <View style={styles.discountContainer}>
        <Pressable
          style={[
            styles.discountButton,
            { backgroundColor: getButtonColor("30") },
          ]}
          onPress={() => handlePress("30")}
        >
          <Text style={styles.discountText}>30%</Text>
        </Pressable>
        <Pressable
          style={[
            styles.discountButton,
            { backgroundColor: getButtonColor("40") },
          ]}
          onPress={() => handlePress("40")}
        >
          <Text style={styles.discountText}>40%</Text>
        </Pressable>
      </View>

      <Text style={styles.customDiscountLabel}>
        Custom Discount/Voucher Code
      </Text>
      <TextInput
        placeholder="Add discount/voucher code"
        value={customDiscountCode}
        onChangeText={setCustomDiscountCode}
        style={styles.addDiscount}
      />
      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleApplyDiscount}
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (height) =>
  StyleSheet.create({
    container: { marginTop: 20 },
    headerText: {
      fontSize: 20,
      fontWeight: "600",
      color: "#19191C",
    },
    discountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 20,
      marginTop: 15,
    },
    discountButton: {
      backgroundColor: "#B66619",
      padding: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderRadius: 60,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    discountText: {
      color: "white",
      fontWeight: "600",
      fontSize: height <= 480 ? 10 : 16,
    },
    customDiscountLabel: {
      fontSize: 20,
      fontWeight: "600",
      color: "#19191C",
      paddingVertical: 10,
    },
    addDiscount: {
      borderWidth: 1,
      borderColor: "#E4E4E4",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 60,
    },
    applyButton: {
      flex: 1,
      paddingVertical: 10,
      backgroundColor: "#B66619",
      alignItems: "center",
      borderRadius: 60,
      marginTop: 10,
    },
    applyText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
    },
  });
