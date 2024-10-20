import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

import AddItem from "../Expenses/smallComponents/AddItem";
import { StoreExpenses } from "../../services/firebase/Expenses/StoreExpenses";
import { useBranches } from "../../context/BranchContext";

export default function AddExpenseModal({
  openAddExpense,
  setOpenAddExpense,
  expensesTypeInfo,
  branchesInfo,
}) {
  const { selectedBranch } = useBranches();
  const selectedBranchCode = selectedBranch ? selectedBranch.branchCode : null;

  // useState for adding items handler
  const [addItem, setAddItem] = useState(false);
  const [addAllItems, setAddAllItems] = useState(false);
  // Array for storing data to the expense form
  const [expenseItems, setExpenseItems] = useState([]);

  // useState for the Add Expense Item Form
  const [currDate, setCurrDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Set current date
  const [branchCode, setBranchCode] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  // useState for expense Items
  const [itemName, setItemName] = useState("");
  const [itemQTY, setItemQTY] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [receiptTotal, setReceiptTotal] = useState("");

  const [addedItemName, setAddedItemName] = useState("");
  const [addedItemQTY, setAddedItemQTY] = useState("");
  const [addedItemPrice, setAddedItemPrice] = useState("");
  const [addedReceiptTotal, setAddedReceiptTotal] = useState("");

  // Exit modal and cancel button
  const handleExitModal = () => {
    setBranchCode("");
    setExpenseType("");
    setReceiptNumber("");
    setItemName("");
    setItemQTY("");
    setItemPrice("");
    setReceiptTotal(0.0);

    setOpenAddExpense(false);
    setAddItem(false);
    setAddAllItems(false);
    setExpenseItems([]);
  };

  // Handler for adding expense item
  const handleAddItem = (itemName, itemQTY, itemPrice, receiptTotal) => {
    setAddItem(true);

    const expenses = {
      dateChecked: currDate,
      branchCode: selectedBranchCode,
      expenseTypeCd: expenseType,
      receiptNumber: receiptNumber,
      itemName: itemName,
      itemQTY: itemQTY,
      itemPrice: parseFloat(itemPrice),
      receiptTotal: parseFloat(receiptTotal),
    };

    setExpenseItems((prevItems) => [...prevItems, expenses]);
    console.log("Expense Item Added: ", expenses);
  };

  // Handler for removing expense item
  const handleRemoveItem = (expIndex) => {
    if (expenseItems.length > 0) {
      setExpenseItems(expenseItems.filter((_, index) => index !== expIndex));
      console.log("Removed Item!");
      if (expenseItems.length === 1) {
        setAddItem(false);
      }
    }
    console.log("Expenses Data after removing one item: ", expenseItems);
  };

  // Handler for adding all expense items
  const handleAddAllItems = async () => {
    let currentExpense;

    if (
      addedItemName === "" &&
      addedItemQTY === "" &&
      addedItemPrice === "" &&
      addedReceiptTotal === ""
    ) {
      currentExpense = {
        dateChecked: currDate,
        branchCode: selectedBranchCode,
        expenseTypeCd: expenseType,
        receiptNumber: receiptNumber,
        itemName: itemName,
        itemQTY: itemQTY,
        itemPrice: parseFloat(itemPrice),
        receiptTotal: parseFloat(receiptTotal),
      };
    } else {
      currentExpense = {
        dateChecked: currDate,
        branchCode: selectedBranchCode,
        expenseTypeCd: expenseType,
        receiptNumber: receiptNumber,
        itemName: addedItemName,
        itemQTY: addedItemQTY,
        itemPrice: parseFloat(addedItemPrice),
        receiptTotal: parseFloat(addedReceiptTotal),
      };
    }

    setExpenseItems((prevItems) => [...prevItems, currentExpense]);

    console.log("Current expense: ", currentExpense);
    const allExpenses = [...expenseItems, currentExpense];

    // Iterate each expense item to store in firebase
    for (const expense of allExpenses) {
      await StoreExpenses(expense);
      console.log("expense: ", expense);
    }

    // Reset input fields
    setBranchCode("");
    setExpenseType("");
    setReceiptNumber("");
    setItemName("");
    setItemQTY("");
    setItemPrice("");
    setReceiptTotal("");
    // Reset expenseItems
    setExpenseItems([]);
    // Close the modal
    setOpenAddExpense(false);
    setAddItem(false);
    console.log("Final Expense Items: ", allExpenses);
  };

  // Map branch desc
  const getBranchDesc = (selectedBranchCode) => {
    const branchData = branchesInfo.find(
      (branch) => branch.branchCode === selectedBranchCode
    );
    return branchData ? branchData.branchDesc : " ";
  };

  return (
    <Modal animationType="slide" transparent={true} visible={openAddExpense}>
      <View style={styles.container}>
        <ScrollView
          style={styles.addExpenseContainer}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.exitContainer}>
            <Pressable onPress={handleExitModal}>
              <AntDesign
                name="close"
                size={25}
                color="#19191C"
                style={{ marginRight: 2 }}
              />
            </Pressable>
          </View>

          {/* Input Date */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Date:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder={currDate}
              placeholderTextColor={"gray"}
              value={currDate}
              onChangeText={setCurrDate}
              editable={false}
            />
          </View>

          {/* Input Branch */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Branch:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder={getBranchDesc(selectedBranchCode)}
              placeholderTextColor={"gray"}
              value={getBranchDesc(selectedBranchCode)}
              editable={false}
            />
          </View>

          {/* Expense Type */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Expense Type:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={expenseType}
              style={styles.input}
              onValueChange={(itemValue) => setExpenseType(itemValue)}
            >
              <Picker.Item label="Select Expense Type" value="" />
              {expensesTypeInfo.map((expType, index) => (
                <Picker.Item
                  key={index}
                  label={expType.expenseTypeDesc}
                  value={expType.expenseTypeCd}
                />
              ))}
            </Picker>
          </View>

          {/* Input Receipt/OR No. */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Receipt/OR No.:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder="Receipt/OR No."
              placeholderTextColor={"gray"}
              value={receiptNumber}
              onChangeText={setReceiptNumber}
            />
          </View>

          {/* Item Name */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Item Name:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder="Item Name"
              placeholderTextColor={"gray"}
              value={itemName}
              onChangeText={setItemName}
            />
          </View>

          {/* Item Quantity */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              QTY:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder="Quantity"
              placeholderTextColor={"gray"}
              value={itemQTY}
              onChangeText={(value) => setItemQTY(Number(value))}
            />
          </View>

          {/* Item Price */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Item Price:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder="Item Price"
              placeholderTextColor={"gray"}
              value={itemPrice}
              onChangeText={setItemPrice}
            />
          </View>

          {/* Receipt Total */}
          <View style={styles.inputTitleCon}>
            <Text style={[styles.inputTitleText, { fontWeight: "500" }]}>
              Receipt Total:
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.inputTitleText]}
              placeholder="Receipt Total"
              placeholderTextColor={"gray"}
              value={receiptTotal}
              onChangeText={setReceiptTotal}
            />
          </View>

          {addItem ? (
            // Map another item form
            expenseItems.map((_, index) => (
              <AddItem
                key={index}
                index={index}
                handleRemoveItem={handleRemoveItem}
                handleAddItem={handleAddItem}
                itemLength={expenseItems.length}
                addedItemName={addedItemName}
                setAddedItemName={setAddedItemName}
                addedItemQTY={addedItemQTY}
                setAddedItemQTY={setAddedItemQTY}
                addedItemPrice={addedItemPrice}
                setAddedItemPrice={setAddedItemPrice}
                addedReceiptTotal={addedReceiptTotal}
                setAddedReceiptTotal={setAddedReceiptTotal}
              />
            ))
          ) : (
            // Add Item Button
            <Pressable
              onPress={() =>
                handleAddItem(itemName, itemQTY, itemPrice, receiptTotal)
              }
              style={styles.addItemContainer}
            >
              <Text style={styles.addItemText}>Add Item?</Text>
            </Pressable>
          )}

          {/* Add and cancel button */}
          <View style={styles.addAllCon}>
            <Pressable onPress={handleAddAllItems} style={styles.addAllButton}>
              <Text style={styles.addAllText}>Add</Text>
            </Pressable>
            <Pressable onPress={handleExitModal} style={styles.cancelButton}>
              <Text style={styles.addAllText}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  addExpenseContainer: {
    maxHeight: "80%",
    width: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  exitContainer: {
    width: "100%",
    height: 20,
    marginTop: "1%",
    display: "flex",
    alignItems: "flex-end",
    marginBottom: "1%",
    // backgroundColor: "pink",
  },
  inputTitleCon: {
    height: 25,
    width: "100%",
    justifyContent: "center",
    // backgroundColor: "pink",
  },
  inputTitleText: {
    fontSize: 15,
    marginLeft: "5%",
  },
  inputContainer: {
    height: 35,
    width: "100%",
    justifyContent: "center",
    // backgroundColor: "yellow",
  },
  input: {
    flex: 1,
    width: "88%",
    borderColor: "gray",
    borderRadius: 1,
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: "5%",
    padding: 2,
  },
  addItemContainer: {
    height: "5%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "45%",
    // backgroundColor: "pink"
  },
  addItemText: {
    fontSize: 14,
    color: "#B66619",
    textDecorationLine: "underline",
  },
  addAllCon: {
    height: 60,
    width: "100%",
    // backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addAllButton: {
    height: "65%",
    width: "42%",
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "3%",
  },
  addAllText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  cancelButton: {
    height: "65%",
    width: "42%",
    borderRadius: 5,
    backgroundColor: "#F44336",
    alignItems: "center",
    justifyContent: "center",
  },
});
