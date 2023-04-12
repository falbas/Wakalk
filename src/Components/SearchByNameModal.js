import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { Button } from './Button'

export const SearchByNameModal = ({ visible, handler, value }) => {
  const [searchNameValue, setSearchNameValue] = useState(value)

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Text style={styles.textTextInput}>Cari produk berdasarkan nama</Text>
        <TextInput
          style={styles.addTextInput}
          onChangeText={(v) => setSearchNameValue(v)}
          value={searchNameValue}
          autoFocus
        />
        <Button onPress={() => handler(searchNameValue)}>Close</Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 20,
  },
  textTextInput: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
})
