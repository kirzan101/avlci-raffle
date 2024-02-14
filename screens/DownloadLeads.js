import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

function DownloadLeads() {
  // return <Text>This is a test page!</Text>;
  async function download() {
    console.log('pressed download');
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/images/undraw_maintenance.png')}
      />
      <Text style={styles.infoText}>On development...</Text>
      <Pressable onPress={download}>
        <Text>Download</Text>
      </Pressable>
    </View>
  );
}

export default DownloadLeads;

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
  image: {
    width: 300,
    height: 300,
    margin: 20,
  },
});
