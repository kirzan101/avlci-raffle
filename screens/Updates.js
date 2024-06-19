import { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/UI/Button';
import { updateLocalAgents } from '../util/http';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import NetInfo from '@react-native-community/netinfo';
import { GlobalStyles } from '../constants/styles';
import { name, version } from '../package.json';

function UploadLeads() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log(state.isConnected),              ;
      setIsConnected(state.isConnected);
    });
    unsubscribe();
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [btnStatus, setBtnStatus] = useState(false);

  async function updateAgentsHandler() {
    setModalVisible(true);
    setBtnStatus(false);
  }

  function closeModalHandle(callback) {
    setModalVisible(callback);
    setBtnStatus(callback);
  }

  async function confirmModalHandle(callback) {
    if (callback) {
      const isUpdated = await updateLocalAgents();

      // close the first modal
      setModalVisible(false);
      setBtnStatus(true);

      if (isUpdated) {
        Alert.alert('Notice:', 'Successfully updated!', [
          {
            text: 'OK',
            onPress: () => {
              setBtnStatus(false);
              setModalVisible(false);
            },
          },
        ]);
      } else {
        Alert.alert('Notice:', 'No updates!', [
          {
            text: 'OK',
            onPress: () => setModalVisible(false),
          },
        ]);
      }
    }
  }

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
          message={'Update agents?'}
          btnStatus={btnStatus}
        />
        <Image
          style={styles.image}
          source={require('../assets/images/undraw_download.png')}
        />
        {isConnected && (
          <View>
            <Text style={styles.infoText}>Update Agent list</Text>
            <Button
              style={styles.button}
              disabled={btnStatus}
              onPress={updateAgentsHandler}
            >
              Update Agents
            </Button>
          </View>
        )}
        {!isConnected && (
          <View>
            <Text style={styles.infoText}>Not Available when Offline</Text>
            <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
              <Text style={styles.buttonTextDisabled}>Update Agents</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        <Text style={styles.versionText}>
          {name} v{version}
        </Text>
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
  buttonDisabled: {
    minWidth: 120,
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#A9A9A9',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextDisabled: {
    color: '#DDD',
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
  versionText: {
    backgroundColor: GlobalStyles.colors.primary200,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
