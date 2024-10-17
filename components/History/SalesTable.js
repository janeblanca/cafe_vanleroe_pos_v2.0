import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import { useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function SalesTable({
  salesInfo,
  orderModeInfo,
  // modeOfPaymentInfo,
  addOnsInfo,
}) {
  const [visibleItems, setVisibleItems] = useState({});

  const handleVisibleItems = (index) => {
    setVisibleItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Map orderModeDesc from ORDER_MODE
  const getOrderMode = (orderModeCode) => {
    const orderModeData = orderModeInfo.find(
      (item) => item.orderModeCode === orderModeCode
    );
    return orderModeData ? orderModeData.orderModeDesc : " ";
  };

  // Map modeOfPaymentDesc from MODE_OF_PAYMENT
  // const getModeOfPayment = (modeOfPaymentCode) => {
  //   const modeOfPaymentData = modeOfPaymentInfo.find(
  //     (item) => item.paymentMethodCode === modeOfPaymentCode
  //   );

  //   return modeOfPaymentData ? modeOfPaymentData.paymentMethodDesc : "";
  // };

  // Map addOnsDesc from POS_ITEMS_ADDONS
  // const getAddOns = (addOnsCode) => {
  //   const addOnsData = addOnsInfo.find((item) => item.addOnCode === addOnsCode);
  //   return addOnsData ? addOnsData.addOnDesc : " ";
  // };

  const renderItem = ({ item, index }) => {
    const orderedItems = Array.isArray(item.orderItems)
      ? item.orderItems
          .map(({ itemName, itemQuantity }) => `${itemQuantity} - ${itemName}`)
          .join("\n")
      : item.orderItems;

    const orderAddOnsArr = [];

    if (Array.isArray(item.orderItems)) {
      item.orderItems.forEach((orderItem) => {
        if (Array.isArray(orderItem.addOns)) {
          orderItem.addOns.forEach((addOn) => {
            orderAddOnsArr.push(addOn.desc);
          });
        }
      });
    } else {
      orderAddOnsArr.push(item.orderItems);
    }
    console.log("Order Add ons array: ", orderAddOnsArr);

    const paymentMethods = item.paymentMethods
      .map((method) => method.modeOfPayment)
      .join(",");

    console.log("payment methods: ", paymentMethods);

    return (
      <View style={styles.row}>
        <Text style={[styles.dataText, { width: 200 }]}>{item.orderNo}</Text>
        <Text style={[styles.dataText, { width: 200 }]}>{paymentMethods}</Text>
        <Text style={[styles.dataText, { width: 150 }]}>
          {getOrderMode(item.orderMode)}
        </Text>
        <Text style={[styles.dataText, { width: 170 }]}>
          {Object.values(item.orderItems).reduce(
            (total, item) => total + item.itemQuantity,
            0
          )}
        </Text>

        {Array.isArray(item.orderItems) ? (
          <>
            <Text style={[styles.dataText, { width: 270 }]}>
              {visibleItems[index]
                ? orderedItems
                : `${item.orderItems[0].itemQuantity} - ${item.orderItems[0].itemName} \n`}
            </Text>
            <Text style={[styles.dataText, { width: 170 }]}>
              {visibleItems[index]
                ? orderAddOnsArr.join("\n")
                : `${item.orderItems[0].addOns
                    .map((addOn) => addOn.desc)
                    .join("\n")} \n`}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.dataText, { width: 270 }]}>
              {orderedItems}
            </Text>
            {orderAddOnsArr.map((addOnDesc, index) => {
              console.log("add on: ", addOnDesc);
              return (
                <Text key={index} style={[styles.dataText, { width: 170 }]}>
                  {addOnDesc}
                </Text>
              );
            })}
          </>
        )}

        <Text style={[styles.dataText, { width: 100 }]}>
          ₱ {item.totalAmount}
        </Text>

        {item.orderItems.length > 1 ? (
          <Pressable
            style={styles.eyeIconCon}
            onPress={() => handleVisibleItems(index)}
          >
            {visibleItems[index] ? (
              <Ionicons name="eye" size={24} color="#B66619" />
            ) : (
              <Ionicons name="eye-off" size={24} color="#B66619" />
            )}
          </Pressable>
        ) : (
          <View />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={{ borderRadius: 5, width: "98%" }}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { width: 200 }]}>Order No.</Text>
            <Text style={[styles.headerText, { width: 200 }]}>
              Mode of Payment
            </Text>
            <Text style={[styles.headerText, { width: 150 }]}>Order Mode</Text>
            <Text style={[styles.headerText, { width: 170 }]}>
              Total Ordered Items
            </Text>
            <Text style={[styles.headerText, { width: 270 }]}>
              Ordered Items
            </Text>
            <Text style={[styles.headerText, { width: 170 }]}>Add Ons</Text>
            <Text style={[styles.headerText, { width: 100 }]}>Total Price</Text>
            <Text style={[styles.headerText, { width: 100 }]}></Text>
          </View>
          <View style={styles.rowContainer}>
            <FlatList
              data={salesInfo}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
    flex: 1,
    borderRadius: 5,
  },
  header: {
    height: 60,
    flexDirection: "row",
    backgroundColor: "#F9BC4D",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#fbfbfa",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "500",
    textAlign: "center",
  },
  dataText: {
    fontSize: 15,
    textAlign: "center",
  },
  rowContainer: {
    height: 420,
    borderBottomEndRadius: 5,
  },
  eyeIconCon: {
    alignItems: "center",
  },
});
