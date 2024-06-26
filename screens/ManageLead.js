import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { GlobalStyles } from '../constants/styles';
import IconButton from '../components/UI/IconButton';
import Button from '../components/UI/Button';
import { LeadsContext } from '../store/leads-context';
import LeadForm from '../components/ManageLead/LeadForm';
import {
  insertLeadData,
  updateLeadData,
  deleteLeadData,
} from '../database/leadsData';
import {
  getSourceDefaults,
  storeDefaults,
  updateDafaults,
} from '../database/sourceData';
import { getAgent, storeLead } from '../util/http';
import NetInfo from '@react-native-community/netinfo';
import QRResultModal from '../components/UI/QRResultModal';

function ManageLead({ route, navigation }) {
  const leadsCtx = useContext(LeadsContext);
  const [isConnected, setIsConnected] = useState(false);
  const [defaultSource, setDefaultSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [btnStatus, setBtnStatus] = useState(false);
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [randomCode, setRandomCode] = useState('');
  const [codeName, setCodeName] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const editedLeadId = route.params?.leadId;
  const isEditing = !!editedLeadId; // '!!' converts to boolean

  const selectedLead = leadsCtx.leads.find((lead) => lead.id === editedLeadId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit' : 'Add',
    });
  }, [navigation, isEditing]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const initializeData = async () => {
      const defaultResult = await getSourceDefaults();
      setDefaultSource(defaultResult);
    };

    unsubscribe();
    initializeData();
  }, []);

  async function deleteLeadHandler() {
    Alert.alert('Warning:', 'Delete this record?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          // delete to local
          leadsCtx.deleteLead(editedLeadId);

          // delete to database
          await deleteLeadData(editedLeadId);

          Alert.alert('Notice:', 'Successfully Deleted!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(leadsData) {
    const onlineLeadData = leadsData;

    setEmployeeNumber(leadsData.source); //source here is the employee/agent number
    setRandomCode(leadsData.random_code);

    if (isEditing) {
      // update to local
      leadsCtx.updateLead(editedLeadId, leadsData);

      // update to database
      const result = await updateLeadData(editedLeadId, leadsData);
      const message = result ? 'Successfully Updated!' : 'Invalid form.';

      Alert.alert('Notice:', message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      const codeNameResult = await getAgent(leadsData.source);
      setCodeName(codeNameResult);
      leadsData.code_name = codeNameResult;

      // submit online
      if (isConnected) {
        try {
          const response = await storeLead(onlineLeadData);

          if (response.status == 200) {
            leadsData.is_uploaded = 'true';
          }
        } catch (error) {
          console.log('error on online submit', error.response.data);
        }
      }

      // add to database
      const insertedId = await insertLeadData(leadsData);

      if (insertedId > 0) {
        leadsData['id'] = insertedId;
      }

      // add to local
      leadsCtx.addLead(leadsData);

      if (insertedId > 0) {
        storeDefaults(leadsData);
        setModalMessage('Successfully Added!');
        setModalVisible(true);
      } else {
        Alert.alert('Notice:', 'Invalid form.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    }
  }

  function closeModalHandle() {
    setModalVisible(false);
    navigation.goBack();
    // setBtnStatus();
  }

  return (
    <View style={styles.container}>
      <QRResultModal
        openModal={modalVisible}
        closeModal={closeModalHandle}
        message={modalMessage}
        employeeNumber={employeeNumber}
        randomAlphaNumeric={randomCode}
        codeName={codeName}
      />
      <ScrollView>
        <LeadForm
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          onSubmit={confirmHandler}
          onCancel={cancelHandler}
          defaultValues={selectedLead}
          isEditing={isEditing}
          defaultSource={defaultSource}
        />
      </ScrollView>
      {isEditing && selectedLead.is_uploaded == 'false' && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error50}
            size={36}
            onPress={deleteLeadHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 50,
  },
});
