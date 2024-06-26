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
import { useEffect, useState } from 'react';
import Button from '../UI/Button';
import leadValidation from '../../validations/leadValidation';
import { GlobalStyles } from '../../constants/styles';
import Dropdown from './Dropdown';
import { getAgents } from '../../util/http';

function LeadForm({
  submitButtonLabel,
  onCancel,
  onSubmit,
  defaultValues,
  isEditing,
  defaultSource,
}) {
  const today = new Date();
  // const [defaultSources, setDefaultSources] = useState([]);
  // console.log('defaultSource here', defaultSource)
  useEffect(() => {
    const initializeData = async () => {
      await agent_list();
    };

    initializeData();
  }, []);

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
    remarks: {
      value: defaultValues ? defaultValues.remarks?.toString() : '',
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
    random_code: {
      value: defaultValues ? defaultValues.random_code?.toString() : '',
      isValid: !!defaultValues,
    },
    code_name: {
      value: defaultValues ? defaultValues.code_name?.toString() : '',
      isValid: !!defaultValues,
    },
  });

  //defaults here
  if (defaultSource.length > 0 && inputs.source.value.length === 0) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        source: { value: defaultSource[0].source, isValid: true },
      };
    });
  }

  if (defaultSource.length > 0 && inputs.source_prefix.value.length === 0) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        source_prefix: { value: defaultSource[0].source_prefix, isValid: true },
      };
    });
  }

  const civil_statuses = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'With Live-in partner', value: 'With Live-in partner' },
    { label: 'Widowed/Separated', value: 'Widowed/Separated' },
  ];

  const source_prefixes = [
    { label: 'OPC', value: 'OPC' },
    { label: 'JPC', value: 'JPC' },
    { label: 'OPC-MR', value: 'OPC-MR' },
    { label: 'OPC/IHG', value: 'OPC/IHG' },
    { label: 'CSD/IHG', value: 'CSD/IHG' },
    // { label: 'LSR', value: 'LSR' },
    // { label: 'ALM', value: 'ALM' },
    // { label: 'LS', value: 'LS' },
    // { label: 'IP', value: 'IP' },
    // { label: 'PRJ', value: 'PRJ' },
    // { label: 'ROIeioprtuy[4r', value: 'ROI' },
    // { label: 'NMB', value: 'NMB' },
    // { label: 'BROI', value: 'BROI' },
    // { label: 'BNMB', value: 'BNMB' },
    // { label: 'SURVEY', value: 'SURVEY' },
  ];

  const [agents, setAgents] = useState([]);
  const agent_list = async () => {
    try {
      const response = await getAgents();
      // const data = await response.json();
      const mappedAgent = response.map((agent) => {
        return {
          label: `${agent.last_name}, ${agent.first_name}`,
          value: agent.employee_number,
        };
      });

      setAgents([...mappedAgent]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // console.log('agentList', agent_list());

  const getCivilStatus = (val) => {
    inputChangeHandler('civil_status', val);
  };

  const getSourcePrefix = (val) => {
    inputChangeHandler('source_prefix', val);
  };

  const getSource = (val) => {
    inputChangeHandler('source', val);
  };

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const [isInvalid, setIsInvalid] = useState(false);
  const randomCode = generateRandomAlphanumeric(6);

  function submitHandler() {
    const leadsData = {
      first_name: inputs.first_name.value.trim(),
      middle_name: inputs.middle_name.value.trim(),
      last_name: inputs.last_name.value.trim(),
      companion_first_name: inputs.companion_first_name.value.trim(),
      companion_middle_name: inputs.companion_middle_name.value.trim(),
      companion_last_name: inputs.companion_last_name.value.trim(),
      address: inputs.address.value.trim(),
      hotel: inputs.hotel.value.trim(),
      mobile_number: inputs.mobile_number.value.trim(),
      occupation: inputs.occupation.value.trim(),
      age: inputs.age.value.trim(),
      source_prefix: inputs.source_prefix.value.trim(),
      source: inputs.source.value.trim(),
      civil_status: inputs.civil_status.value.trim(),
      remarks: inputs.remarks.value.trim(),
      is_uploaded:
        inputs.is_uploaded && typeof inputs.is_uploaded.value === 'string'
          ? inputs.is_uploaded.value.trim()
          : 'false',
      random_code: defaultValues ? defaultValues.random_code : randomCode,
      code_name: '',
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
      <Text style={styles.title}>Complimentary buffet availment</Text>
      <Text style={styles.noteText}>
        This gives AVLCI the authority to process the personal information.
      </Text>
      <Text style={styles.noteText}>
        I have given them for their comnpany's purpose.
      </Text>
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
      {/* <Input
        label="Agent"
        isInvalid={isInvalid && !inputs.source.isValid}
        isRequired={true}
        textInputConfig={{
          keyboardType: 'default',
          maxLength: 8,
          autoCapitalize: 'words',
          onChangeText: inputChangeHandler.bind(this, 'source'),
          value: inputs.source.value,
        }}
      /> */}
      <Dropdown
        options={agents}
        label={'Agent'}
        isInvalid={isInvalid && !inputs.source.isValid}
        isRequired={true}
        dropdownVal={getSource}
        value={inputs.source.value}
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
      <Input
        label="Remarks"
        isInvalid={isInvalid && !inputs.remarks.isValid}
        isRequired={false}
        textInputConfig={{
          multiline: true,
          onChangeText: inputChangeHandler.bind(this, 'remarks'),
          value: inputs.remarks.value,
        }}
      />
      <View style={styles.buttons}>
        {/* {isEditing && inputs.is_uploaded.value == 'false' && (
          <Button style={styles.button} onPress={submitHandler}>
            {submitButtonLabel}
          </Button>
        )}
        {!isEditing && (
          <Button style={styles.button} onPress={submitHandler}>
            {submitButtonLabel}
          </Button>
        )} */}
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
  noteText: {
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: 'normal',
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
