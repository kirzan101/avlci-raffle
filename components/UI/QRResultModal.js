import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { GlobalStyles } from '../../constants/styles';
import SpinningIcon from './SpinningIcon';
import GeneratedQR from './GeneratedQR';

function QRResultModal({
  openModal,
  closeModal,
  message,
  employeeNumber,
  randomAlphaNumeric,
  codeName,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  function closed() {
    closeModal(modalVisible);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openModal}
      onRequestClose={() => {
        setModalVisible(!openModal);
      }}
      backdropColor={'green'}
      backdropOpacity={1}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <GeneratedQR
            employeeNumber={employeeNumber}
            randomAlphaNumeric={randomAlphaNumeric}
            codeName={codeName}
          />
          <Text style={styles.modalText}>
            AVLCI-{codeName}-{randomAlphaNumeric}
          </Text>
          <View style={styles.buttonPosition}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => closed()}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default QRResultModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor: 'rgba(0, 255, 0, 0.5)'
    backgroundColor: 'rgba(241, 240, 234, 0.5)',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 60,
    paddingVertical: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: GlobalStyles.colors.error500,
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 12,
    alignContent: 'center',
    height: 'auto',
    width: 70,
  },
  buttonConfirm: {
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 12,

    alignContent: 'center',
  },
  buttonPosition: {
    // flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
