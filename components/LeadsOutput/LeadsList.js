import { FlatList, Text } from 'react-native';
import LeadsItem from './LeadsItem';

function renderLeadsItem(itemData) {
  // return <Text>{itemData.item.first_name}</Text>;
  return <LeadsItem {...itemData.item} />
}

function LeadsList({ leads, onRefresh, refreshing }) {
  return (
    <FlatList
      data={leads}
      renderItem={renderLeadsItem}
      keyExtractor={(item) => item.id}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}

export default LeadsList;
