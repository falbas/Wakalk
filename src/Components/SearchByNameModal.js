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

import PRODUCTS from '../Products'

export const SearchByNameModal = ({ visible, handler, value }) => {
  const [searchNameValue, setSearchNameValue] = useState(value)
  const [term, setTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState(term)
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setTerm(debouncedTerm), 1000)
    return () => clearTimeout(timer)
  }, [debouncedTerm])

  useEffect(() => {
    if (term !== '') {
      searchProducts(debouncedTerm)
    }
  }, [term])

  const searchProducts = (v) => {
    const filteredBarcode = []

    PRODUCTS.forEach((product) => {
      if (product.name.toLowerCase().includes(v.toLowerCase())) {
        filteredBarcode.push({
          barcode: product.barcode,
          name: product.name,
          price: product.price,
        })
      }
    })

    setSearchResult(filteredBarcode)
  }

  const handleOnChangeSearchName = (v) => {
    setSearchNameValue(v)
    setDebouncedTerm(v)
  }

  const handleSelectedResult = (item) => {
    setSearchNameValue(item.name)
    searchProducts(item.name)
    handler(item)
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Text style={styles.textTextInput}>Cari produk berdasarkan nama</Text>
        <TextInput
          style={styles.searchTextInput}
          onChangeText={(v) => handleOnChangeSearchName(v)}
          value={searchNameValue}
          autoFocus
        />
        <ScrollView>
          {searchResult.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectedResult(item)}
            >
              <Text>{item.barcode}</Text>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.closeButtonContainer}>
        <Button
          style={styles.closeButton}
          onPress={() => handler(searchNameValue)}
        >
          Close
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
