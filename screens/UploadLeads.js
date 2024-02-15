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

function UploadLeads() {
  const uploadLeadsCtx = useContext(UploadLeadsContext);
  const leadsCtx = useContext(LeadsContext);

  useEffect(() => {
    async function getLeads() {
      const leads = await unUploadedleadsFetch();
      uploadLeadsCtx.setLeads(leads);
    }

    getLeads();
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  async function uploadLeadsHandler() {
    setModalVisible(true);
    // Alert.alert('Notice:', 'Upload all the leads?', [
    //   {
    //     text: 'Cancel',
    //     onPress: () => console.log('Cancel Pressed'),
    //     style: 'cancel',
    //   },
    //   {
    //     text: 'OK',
    //     onPress: async () => {
    //       const leads = await unUploadedleadsFetch();
    //       // send online
    //       const result = await storeBulkLead(leads);
    //       if (result.status == 200) {
    //         // update is_upload status
    //         await uploadLead();
    //       }
    //     },
    //   },
    // ]);
  }

  function closeModalHandle(callback) {
    setModalVisible(callback);
  }

  async function confirmModalHandle(callback) {
    if (callback) {
      const leads = await unUploadedleadsFetch();
      const result = await storeBulkLead(leads);
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
      }
    }
  }

  const unuploadedLeadCount = leadsCtx.leads.filter(lead => lead.is_uploaded == "false").length;

  return (
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
      <Text style={styles.infoText}>For Upload Leads: {unuploadedLeadCount}</Text>
      <Button style={styles.button} onPress={uploadLeadsHandler}>
        Click to upload
      </Button>
    </View>
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
});
