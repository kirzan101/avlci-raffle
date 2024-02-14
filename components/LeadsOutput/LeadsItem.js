import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getFormattedDate, convertToDate } from '../../util/date';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';

function LeadsItem({ id, first_name, last_name, created_at, is_uploaded }) {
  const navigation = useNavigation();

  function leadPressHandler() {
    navigation.navigate('ManageLead', {
      leadId: id,
    });
  }

  return (
    <Pressable
      onPress={leadPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.leadItem}>
        <Text style={styles.textContainer}>
          {last_name}, {first_name}
          {is_uploaded == 'true' && (
            <Ionicons
              name="checkmark-circle-outline"
              size={12}
              color={'green'}
              style={styles.iconCheckContainer}
            />
          )}
        </Text>
        <View style={styles.createdContainer}>
          <Ionicons
            name="time"
            size={24}
            color={'green'}
            style={styles.iconContainer}
          />
          <Text style={styles.textContainer}>
            {getFormattedDate(convertToDate(created_at))}
          </Text>
        </View>
      </View>
    </Pressable>
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
  },
  createdContainer: {
    flexDirection: 'row',
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
  },
});
