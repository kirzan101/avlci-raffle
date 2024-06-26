import QRCode from 'react-native-qrcode-svg';
import { GlobalStyles } from '../../constants/styles';

function GeneratedQR({ employeeNumber, randomAlphaNumeric, codeName }) {
  const textValue = `AVLCI-${codeName}-${randomAlphaNumeric}`;
  const logoFromFile = require('../../assets/icon.png');

  return (
    <QRCode
      value={textValue}
      color={GlobalStyles.colors.primary500}
      size={200}
      logo={logoFromFile}
      logoBorderRadius={5}
      backgroundColor='white'
      logoBackgroundColor='white'
      logoSize={40}
    />
  );
}

export default GeneratedQR;
