import { Text, View } from 'react-native';

function LeadsSummary({ leads, periodName }) {

  return (
    <View>
      <Text>{periodName}</Text>
      <Text>Total Leads: {leads.length}</Text>
    </View>
  );
}

export default LeadsSummary;
