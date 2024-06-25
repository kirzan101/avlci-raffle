import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getFormattedDate, convertToDate, getTime } from '../../util/date';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import QRResultModal from '../UI/QRResultModal';

function LeadsItem({
  id,
  first_name,
  last_name,
  created_at,
  is_uploaded,
  source,
  random_code,
}) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const qrModalMessage = `${last_name}, ${first_name}`;

  function leadPressHandler() {
    navigation.navigate('ManageLead', {
      leadId: id,
    });
  }

  function showQrModal() {
    setModalVisible(true);
    return;
  }

  function closeQrModal() {
    setModalVisible(false);
    return;
  }

  return (
    <View style={styles.leadItem}>
      <QRResultModal
        openModal={modalVisible}
        closeModal={closeQrModal}
        message={qrModalMessage}
        employeeNumber={source}
        randomAlphaNumeric={random_code}
      />
      <Pressable
        onPress={leadPressHandler}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.createdContainer}>
          <Text style={styles.textContainer}>
            {last_name}, {first_name}
            {is_uploaded == 'true' && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={'green'}
                style={styles.iconCheckContainer}
              />
            )}
          </Text>
          <Text style={styles.createdText}>
            {getFormattedDate(convertToDate(created_at))}{' '}
            {getTime(convertToDate(created_at))}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={showQrModal}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View>
          <Ionicons name="qr-code-outline" size={60} color={'green'} />
        </View>
      </Pressable>
    </View>
  );
}

export default LeadsItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  leadItem: {
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary100,
    width: 'auto',
  },
  createdContainer: {
    flexDirection: 'column',
    // flex: 2,
    justifyContent: 'space-between',
    margin: 2,
  },
  iconContainer: {
    marginRight: 4,
  },
  iconCheckContainer: {
    marginRight: 12,
  },
  textContainer: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  createdText: {
    marginVertical: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
