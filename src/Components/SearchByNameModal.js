import axios from 'axios'
import { useState, useEffect } from 'react'
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
  const [term, setTerm] = useState('')
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setTerm(searchNameValue), 1000)
    return () => clearTimeout(timer)
  }, [searchNameValue])

  useEffect(() => {
    if (term !== '') {
      fetchData(searchNameValue)
    }
  }, [term])

  const fetchData = async (v) => {
    try {
      const { data: response } = await axios.get(
        `/products?name=${v}`
      )
      setSearchResult(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Text style={styles.textTextInput}>Cari produk berdasarkan nama</Text>
        <TextInput
          style={styles.searchTextInput}
          onChangeText={(v) => setSearchNameValue(v)}
          value={searchNameValue}
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
          Batal
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
  textTextInput: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
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
