import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { Button } from '../Components/Button'
import { CustomTextInput } from '../Components/CustomTextInput'

export const SearchByBarcodeModal = ({ visible, handler, value }) => {
  const [searchBarcodeValue, setSearchBarcodeValue] = useState(value)
  const [term, setTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setTerm(searchBarcodeValue), 1000)
    return () => clearTimeout(timer)
  }, [searchBarcodeValue])

  useEffect(() => {
    if (term !== '') {
      fetchData(searchBarcodeValue)
    }
  }, [term])

  const fetchData = async (v) => {
    try {
      const { data: response } = await axios.get(`/products?barcode=${v}`)
      setSearchResult(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <CustomTextInput
          title={'Cari produk berdasarkan barcode'}
          keyboardType="numeric"
          onChangeText={(v) => setSearchBarcodeValue(v)}
          value={searchBarcodeValue}
          autoFocus
        />
        <ScrollView>
          {searchResult.map((item, index) => (
            <TouchableOpacity
              style={styles.resultContainer}
              key={index}
              onPress={() => handler(item)}
            >
              <Text>{item.barcode}</Text>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.closeButtonContainer}>
        <Button style={styles.closeButton} onPress={() => handler('cancel')}>
          Kembali
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  closeButtonContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    margin: 10,
  },
})
