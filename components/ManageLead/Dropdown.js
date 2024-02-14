import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function Dropdown({
  options,
  label,
  isInvalid,
  isRequired,
  dropdownVal,
  value,
}) {
  const placeholder = {
    label: "Select an option...",
    value: "",
  };

  const selectedValueHandler = (val) => {
    dropdownVal(val);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={isInvalid ? styles.invalidLabel : styles.label}>
        {label}
        {isRequired && <Text style={{ color: "red" }}> *</Text>}
      </Text>
      <RNPickerSelect
        placeholder={placeholder}
        items={options}
        onValueChange={(val) => selectedValueHandler(val)}
        value={value}
        style={isInvalid ? styles.invalidInput : styles.input}
      />
    </View>
  );
}

export default Dropdown;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    padding: 6,
    borderRadius: 6,
    fontSize: 16,
    borderBottomWidth: 1,
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    borderColor: GlobalStyles.colors.error500,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    borderBottomWidth: 1,
  },
});
