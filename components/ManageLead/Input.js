import { StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function Input({ label, isInvalid, textInputConfig, isRequired }) {
  const inputStyles = [styles.input];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  return (
    <View style={styles.inputContainer}>
      <Text style={isInvalid ? styles.invalidLabel : styles.label}>
        {label}
        {isRequired && <Text style={{ color: "red" }}> *</Text>}
      </Text>
      <TextInput
        style={isInvalid ? styles.invalidInput : inputStyles}
        {...textInputConfig}
      />
    </View>
  );
}

export default Input;

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
