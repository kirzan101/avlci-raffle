import { Image, StyleSheet, Text, View } from 'react-native';
import LeadsSummary from './LeadsSummary';
import LeadsList from './LeadsList';
import { GlobalStyles } from '../../constants/styles';

function LeadsOutput({ leads, leadsPeriod, fallbackText }) {
  let content = (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={require('../../assets/images/undraw_empty.png')}
      />
      <Text style={styles.infoText}>{fallbackText}</Text>
    </View>
  );

  if (leads.length > 0) {
    content = <LeadsList leads={leads} />;
  }

  return (
    <View style={styles.container}>
      <LeadsSummary leads={leads} periodName={leadsPeriod} />
      {content}
    </View>
  );
}

export default LeadsOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  imageContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
});
