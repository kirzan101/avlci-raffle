import { useContext, useLayoutEffect } from 'react';
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

function ManageLead({ route, navigation }) {
  const leadsCtx = useContext(LeadsContext);

  const editedLeadId = route.params?.leadId;
  const isEditing = !!editedLeadId; // '!!' converts to boolean

  const selectedLead = leadsCtx.leads.find((lead) => lead.id === editedLeadId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Lead' : 'Add Lead',
    });
  }, [navigation, isEditing]);

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

    // // delete to local
    // leadsCtx.deleteLead(editedLeadId);

    // // delete to database
    // await deleteLeadData(editedLeadId);

    // navigation.goBack() 
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(leadsData) {
    if (isEditing) {
      // update to local
      leadsCtx.updateLead(editedLeadId, leadsData);

      // update to database
      await updateLeadData(editedLeadId, leadsData);

      Alert.alert("Notice:", "Successfully Updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      // add to local
      leadsCtx.addLead(leadsData);

      // add to database
      const result = await insertLeadData(leadsData);
      // console.log("add result", result);

      Alert.alert("Notice:", "Successfully Added!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
    // navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <LeadForm
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          onSubmit={confirmHandler}
          onCancel={cancelHandler}
          defaultValues={selectedLead}
        />
      </ScrollView>
      {isEditing && (
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
