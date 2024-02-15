import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { GlobalStyles } from '../../constants/styles';

function ConfirmationModal({ openModal, closeModal, confirmModal, message }) {
  const [modalVisible, setModalVisible] = useState(false);

  function closed() {
    closeModal(modalVisible);
  }

  function confirm() {
    confirmModal(true);
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
          <View style={styles.buttonPosition}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => closed()}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonConfirm]}
              onPress={() => confirm()}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor: 'rgba(0, 255, 0, 0.5)'
    backgroundColor: 'rgba(241, 240, 234, 0.5)'
  },
  modalView: {
    margin: 20,
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
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
