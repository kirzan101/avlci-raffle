import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LeadsSummary from './LeadsSummary';
import LeadsList from './LeadsList';
import { GlobalStyles } from '../../constants/styles';
import Button from '../UI/Button';
import { useCallback, useState } from 'react';

function LeadsOutput({
  leads,
  leadsPeriod,
  fallbackText,
  pickedDate,
  filterButton,
  removeFilter,
  search,
  searchHandler,
}) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      removeFilter();
    }, 1000);
  }, []);

  let content = (
    <View style={styles.imageContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={removeFilter} />
        }
      >
        <Image
          style={styles.image}
          source={require('../../assets/images/undraw_empty.png')}
        />
        <Text style={styles.infoText}>{fallbackText}</Text>
      </ScrollView>
    </View>
  );

  if (leads.length > 0) {
    content = (
      <LeadsList leads={leads} onRefresh={onRefresh} refreshing={refreshing} />
    );
  }

  const dateFilterButton =
    pickedDate.length > 0 ? pickedDate : 'Filter by Date';

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          keyboardType="default"
          maxLength={20}
          placeholder="Type to Search..."
          onChangeText={searchHandler}
          value={search}
        ></TextInput>
        <Button onPress={filterButton}>{dateFilterButton}</Button>
      </View>
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
    margin: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    // alignContent: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  filterText: {
    fontSize: 15,
  },
  highlightText: {
    borderRadius: 4,
    padding: 8,
    // color: 'white',
    fontWeight: 'bold',
    // backgroundColor: GlobalStyles.colors.primary400,
    // backgroundColor: 'red',
  },
  inputContainer: {
    marginHorizontal: 4,
    // marginVertical: 16,
    width: '50%',
  },
  input: {
    padding: 6,
    borderRadius: 6,
    fontSize: 16,
    borderBottomWidth: 1,
    width: '50%',
    borderBottomColor: GlobalStyles.colors.primary200
    // borderWidth: 1,
  },
});
