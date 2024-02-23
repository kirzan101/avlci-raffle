import { useContext, useEffect, useState } from 'react';
import { LeadsContext } from '../store/leads-context';
import { UploadLeadsContext } from '../store/upload-leads-context';
import {
  leadsFetch,
  unUploadedleadsFetch,
  uploadLead,
} from '../database/leadsData';
import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native';
import Button from '../components/UI/Button';
import { storeBulkLead, getLead, fetchLead } from '../util/http';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import NetInfo from '@react-native-community/netinfo';
import { GlobalStyles } from '../constants/styles';

function UploadLeads() {
  const uploadLeadsCtx = useContext(UploadLeadsContext);
  const leadsCtx = useContext(LeadsContext);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function getLeads() {
      const leads = await unUploadedleadsFetch();
      uploadLeadsCtx.setLeads(leads);
    }

    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log(state.isConnected),              ;
      setIsConnected(state.isConnected);
    });

    getLeads();
    unsubscribe();
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  async function uploadLeadsHandler() {
    setModalVisible(true);
  }

  function closeModalHandle(callback) {
    setModalVisible(callback);
  }

  async function confirmModalHandle(callback) {
    if (callback) {
      const leads = await unUploadedleadsFetch();
      const result = await storeBulkLead(leads);

      setModalVisible(false);

      if (result.status == 200) {
        //upload leads
        await uploadLead();

        // update all leads context
        const updatedLeads = await leadsFetch();
        leadsCtx.setLeads(updatedLeads);

        Alert.alert('Notice:', 'Successfully uploaded!', [
          {
            text: 'OK',
            onPress: () => setModalVisible(false),
          },
        ]);
      } else {
        Alert.alert('Notice:', 'Upload error!', [
          {
            text: 'OK',
            onPress: () => setModalVisible(false),
          },
        ]);
      }
    }
  }

  const unuploadedLeadCount = leadsCtx.leads.filter(
    (lead) => lead.is_uploaded == 'false'
  ).length;

  return (
    <>
      <View>
        {!isConnected && (
          <Text style={styles.connectionStatusOffline}>Offline mode</Text>
        )}
      </View>
      <View style={styles.container}>
        <ConfirmationModal
          openModal={modalVisible}
          closeModal={closeModalHandle}
          confirmModal={confirmModalHandle}
          message={'Upload all the leads?'}
        />
        <Image
          style={styles.image}
          source={require('../assets/images/undraw_upload.png')}
        />
        <Text style={styles.infoText}>
          For Upload Leads: {unuploadedLeadCount}
        </Text>
        {unuploadedLeadCount > 0 && isConnected && (
          <Button
            style={styles.button}
            onPress={uploadLeadsHandler}
            disabled={unuploadedLeadCount == 0 ? true : false}
          >
            Click to upload
          </Button>
        )}
      </View>
    </>
  );
}

export default UploadLeads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  infoSmallText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 50,
  },
  connectionStatusOnline: {
    backgroundColor: GlobalStyles.colors.primary400,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  connectionStatusOffline: {
    backgroundColor: GlobalStyles.colors.error500,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
