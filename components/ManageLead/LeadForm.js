import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Input from './Input';
import { convertToDate, getFormattedDate } from '../../util/date';
import { useState } from 'react';
import Button from '../UI/Button';
import leadValidation from '../../validations/leadValidation';
import { GlobalStyles } from '../../constants/styles';
import Dropdown from './Dropdown';

function LeadForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  const today = new Date();
  const [inputs, setInputs] = useState({
    first_name: {
      value: defaultValues ? defaultValues.first_name?.toString() : '',
      isValid: !!defaultValues,
    },
    middle_name: {
      value: defaultValues ? defaultValues.middle_name?.toString() : '',
      isValid: !!defaultValues,
    },
    last_name: {
      value: defaultValues ? defaultValues.last_name?.toString() : '',
      isValid: !!defaultValues,
    },
    companion_first_name: {
      value: defaultValues
        ? defaultValues.companion_first_name?.toString()
        : '',
      isValid: !!defaultValues,
    },
    companion_middle_name: {
      value: defaultValues
        ? defaultValues.companion_middle_name?.toString()
        : '',
      isValid: !!defaultValues,
    },
    companion_last_name: {
      value: defaultValues ? defaultValues.companion_last_name?.toString() : '',
      isValid: !!defaultValues,
    },
    address: {
      value: defaultValues ? defaultValues.address?.toString() : '',
      isValid: !!defaultValues,
    },
    hotel: {
      value: defaultValues ? defaultValues.hotel?.toString() : '',
      isValid: !!defaultValues,
    },
    mobile_number: {
      value: defaultValues ? defaultValues.mobile_number?.toString() : '',
      isValid: !!defaultValues,
    },
    occupation: {
      value: defaultValues ? defaultValues.occupation?.toString() : '',
      isValid: !!defaultValues,
    },
    age: {
      value: defaultValues ? defaultValues.age?.toString() : '',
      isValid: !!defaultValues,
    },
    source_prefix: {
      value: defaultValues ? defaultValues.source_prefix?.toString() : '',
      isValid: !!defaultValues,
    },
    source: {
      value: defaultValues ? defaultValues.source?.toString() : '',
      isValid: !!defaultValues,
    },
    civil_status: {
      value: defaultValues ? defaultValues.civil_status?.toString() : '',
      isValid: !!defaultValues,
    },
    is_uploaded: {
      value: defaultValues ? defaultValues.is_uploaded?.toString() : '',
      isValid: !!defaultValues,
    },
    created_at: {
      value: defaultValues
        ? getFormattedDate(convertToDate(defaultValues.created_at))
        : '',
      isValid: !!defaultValues,
    },
  });

  const civil_statuses = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'With Live-in partner', value: 'With Live-in partner' },
    { label: 'Widowed/Separated', value: 'Widowed/Separated' },
  ];

  const source_prefixes = [
    { label: 'LSR', value: 'LSR' },
    { label: 'ALM', value: 'ALM' },
    { label: 'LS', value: 'LS' },
    { label: 'IP', value: 'IP' },
    { label: 'PRJ', value: 'PRJ' },
    { label: 'ROI', value: 'ROI' },
    { label: 'NMB', value: 'NMB' },
    { label: 'BROI', value: 'BROI' },
    { label: 'BNMB', value: 'BNMB' },
    { label: 'SURVEY', value: 'SURVEY' },
  ];

  const getCivilStatus = (val) => {
    inputChangeHandler('civil_status', val);
  };

  const getSourcePrefix = (val) => {
    inputChangeHandler('source_prefix', val);
  };

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const [isInvalid, setIsInvalid] = useState(false);

  function submitHandler() {
    const leadsData = {
      first_name: inputs.first_name.value,
      middle_name: inputs.middle_name.value,
      last_name: inputs.last_name.value,
      companion_first_name: inputs.companion_first_name.value,
      companion_middle_name: inputs.companion_middle_name.value,
      companion_last_name: inputs.companion_last_name.value,
      address: inputs.address.value,
      hotel: inputs.hotel.value,
      mobile_number: inputs.mobile_number.value,
      occupation: inputs.occupation.value,
      age: inputs.age.value,
      source_prefix: inputs.source_prefix.value,
      source: inputs.source.value,
      civil_status: inputs.civil_status.value,
      is_uploaded: 'false',
      created_at: today,
    };

    //validation here
    const { isFormValid, data } = leadValidation(leadsData);

    if (!isFormValid) {
      // Alert.alert('Invalid input!', 'Please check input values.');
      setIsInvalid(!isFormValid);
      setInputs(data);
      return;
    }

    onSubmit(leadsData);
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Lead Information</Text>
      <Input
        label="First Name"
        isInvalid={isInvalid && !inputs.first_name.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'first_name'),
          value: inputs.first_name.value,
        }}
      />
      {isInvalid && !inputs.first_name.isValid && (
        <Text style={styles.errorText}>First Name is required</Text>
      )}
      <Input
        label="Middle Name"
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'middle_name'),
          value: inputs.middle_name.value,
        }}
      />
      <Input
        label="Last Name"
        isInvalid={isInvalid && !inputs.last_name.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'last_name'),
          value: inputs.last_name.value,
        }}
      />
      {isInvalid && !inputs.last_name.isValid && (
        <Text style={styles.errorText}>Last Name is required</Text>
      )}
      <Input
        label="Companion First Name"
        isInvalid={isInvalid && !inputs.companion_first_name.isValid}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'companion_first_name'),
          value: inputs.companion_first_name.value,
        }}
      />
      {isInvalid && !inputs.companion_first_name.isValid && (
        <Text style={styles.errorText}>Companion First Name is required</Text>
      )}
      <Input
        label="Companion Middle Name"
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'companion_middle_name'),
          value: inputs.companion_middle_name.value,
        }}
      />
      <Input
        label="Companion Last Name"
        isInvalid={isInvalid && !inputs.companion_last_name.isValid}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'companion_last_name'),
          value: inputs.companion_last_name.value,
        }}
      />
      {isInvalid && !inputs.companion_last_name.isValid && (
        <Text style={styles.errorText}>Companion Last Name is required</Text>
      )}
      <Input
        label="Address"
        isInvalid={isInvalid && !inputs.address.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 250,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'address'),
          value: inputs.address.value,
        }}
      />
      {isInvalid && !inputs.address.isValid && (
        <Text style={styles.errorText}>Address is required</Text>
      )}
      <Input
        label="Hotel"
        isInvalid={isInvalid && !inputs.hotel.isValid}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'hotel'),
          value: inputs.hotel.value,
        }}
      />
      {isInvalid && !inputs.hotel.isValid && (
        <Text style={styles.errorText}>Hotel is required</Text>
      )}
      <Input
        label="Mobile Number"
        isInvalid={isInvalid && !inputs.mobile_number.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'numeric',
          maxLength: 11,
          onChangeText: inputChangeHandler.bind(this, 'mobile_number'),
          value: inputs.mobile_number.value,
        }}
      />
      {isInvalid && !inputs.mobile_number.isValid && (
        <Text style={styles.errorText}>Mobile Number is required</Text>
      )}
      <Input
        label="Occupation"
        isInvalid={isInvalid && !inputs.occupation.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 50,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'occupation'),
          value: inputs.occupation.value,
        }}
      />
      {isInvalid && !inputs.occupation.isValid && (
        <Text style={styles.errorText}>Occupation is required</Text>
      )}
      <Input
        label="Age"
        isInvalid={isInvalid && !inputs.age.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'numeric',
          maxLength: 3,
          onChangeText: inputChangeHandler.bind(this, 'age'),
          value: inputs.age.value,
        }}
      />
      {isInvalid && !inputs.age.isValid && (
        <Text style={styles.errorText}>Age is required</Text>
      )}
      <Dropdown
        options={source_prefixes}
        label={'Source Prefix'}
        isInvalid={isInvalid && !inputs.source_prefix.isValid}
        isRequired={true}
        dropdownVal={getSourcePrefix}
        value={inputs.source_prefix.value}
      />
      {isInvalid && !inputs.source_prefix.isValid && (
        <Text style={styles.errorText}>Source prefix is required</Text>
      )}
      <Input
        label="Source"
        isInvalid={isInvalid && !inputs.source.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 8,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'source'),
          value: inputs.source.value,
        }}
      />
      {isInvalid && !inputs.source.isValid && (
        <Text style={styles.errorText}>Source is required</Text>
      )}
      <Dropdown
        options={civil_statuses}
        label={'Civil Status'}
        isInvalid={isInvalid && !inputs.civil_status.isValid}
        isRequired={true}
        dropdownVal={getCivilStatus}
        value={inputs.civil_status.value}
      />
      {isInvalid && !inputs.civil_status.isValid && (
        <Text style={styles.errorText}>Civil Status is required</Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

export default LeadForm;

const styles = StyleSheet.create({
  form: {},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 50,
  },
  errorText: {
    fontWeight: 'bold',
    paddingLeft: 6,
    color: GlobalStyles.colors.error500,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    padding: 6,
    borderRadius: 6,
    fontSize: 16,
    borderBottomWidth: 1,
  },
});
