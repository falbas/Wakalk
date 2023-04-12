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

export const SearchByBarcodeModal = ({ visible, handler, value }) => {
  const [searchBarcodeValue, setSearchBarcodeValue] = useState(value)

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Text style={styles.textTextInput}>Cari produk berdasarkan barcode</Text>
        <TextInput
          style={styles.addTextInput}
          onChangeText={(v) => setSearchBarcodeValue(v)}
          value={searchBarcodeValue}
          autoFocus
        />
        <Button onPress={() => handler(searchBarcodeValue)}>Close</Button>
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
