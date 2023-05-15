import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Keyboard,
} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button } from '../Components/Button'
import { DetailProductPage } from './DetailProductPage'

export const ProductListPage = () => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scannerIsVisible, setScannerIsVisible] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false)

  const [products, setProducts] = useState()
  const [openAddProductPage, setOpenAddProductPage] = useState(false)
  const [openDetailProductPage, setOpenDetailProductPage] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(false)

  const [inputProduct, setInputProduct] = useState({
    barcode: '',
    name: '',
    price: 0,
    stock: 0,
  })

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true)
      setScannerIsVisible(false)
    })
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false)
    })
  }, [])

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true)
    setScannerIsVisible(false)

    setInputProduct((prev) => {
      return {
        ...prev,
        barcode: data,
      }
    })
  }

  const handleOpenScanner = () => {
    setScanned(false)
    setScannerIsVisible(!scannerIsVisible)
  }

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAddProdunctPage = () => {
    setOpenAddProductPage(!openAddProductPage)
    setScannerIsVisible(false)
  }

  const handleInputProduct = (field, value) => {
    setInputProduct((prev) => {
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleAddProductButton = async () => {
    if (
      inputProduct.barcode !== '' &&
      inputProduct.name !== '' &&
      inputProduct.price !== 0 &&
      inputProduct.stock !== 0
    ) {
      try {
        const response = await axios.post('/products', inputProduct)
        if (response.status === 200) {
          setInputProduct({
            barcode: '',
            name: '',
            price: 0,
            stock: 0,
          })
          fetchData()
        }
      } catch (error) {
        console.error(error.message)
      }
    } else {
      alert('tidak lengkap')
    }
  }

  const handleDetailProductPage = (itemId) => {
    setOpenDetailProductPage(!openDetailProductPage)
    setOpenAddProductPage(false)
    setScannerIsVisible(false)
    setSelectedProductId(itemId)
    fetchData()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleDetailProductPage(item.id)}
    >
      <View>
        <Text>{item.name}</Text>
        <Text>{item.barcode}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text>Rp{item.price}</Text>
        <Text>{item.stock}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <>
      {!scannerIsVisible && !openDetailProductPage && (
        <View
          style={[
            styles.topContainer,
            openAddProductPage && { flex: 0.6 },
            keyboardIsVisible && { flex: 0.1 },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Daftar Produk</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button
                onPress={() => setOpenAddProductPage(!openAddProductPage)}
              >
                +Produk
              </Button>
            </View>
          </View>
          <SafeAreaView style={{ paddingBottom: 50 }}>
            <FlatList
              style={styles.productListContainer}
              data={products}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        </View>
      )}

      {scannerIsVisible && (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}

      {openAddProductPage && (
        <View
          style={[styles.bottomContainer, keyboardIsVisible && { flex: 1 }]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Tambah Produk</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={handleOpenAddProdunctPage}>X</Button>
            </View>
          </View>
          <ScrollView style={styles.productListContainer}>
            <View>
              <Text style={styles.textTextInput}>Barcode Produk</Text>
              <TextInput
                style={styles.addTextInput}
                keyboardType="numeric"
                value={inputProduct.barcode}
                onChangeText={(v) => handleInputProduct('barcode', v)}
              />
              <View style={styles.iconScanContainer}>
                <TouchableOpacity
                  style={styles.iconScanButton}
                  onPress={handleOpenScanner}
                >
                  <Image
                    style={styles.iconScan}
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.textTextInput}>Nama Produk</Text>
              <TextInput
                style={styles.addTextInput}
                value={inputProduct.name}
                onChangeText={(v) => handleInputProduct('name', v)}
              />
            </View>
            <View>
              <Text style={styles.textTextInput}>Harga</Text>
              <TextInput
                style={styles.addTextInput}
                keyboardType="numeric"
                value={
                  inputProduct.price === 0 ? '' : inputProduct.price.toString()
                }
                onChangeText={(v) => handleInputProduct('price', v)}
              />
            </View>
            <View>
              <Text style={styles.textTextInput}>Stok</Text>
              <TextInput
                style={styles.addTextInput}
                keyboardType="numeric"
                value={
                  inputProduct.stock === 0 ? '' : inputProduct.stock.toString()
                }
                onChangeText={(v) => handleInputProduct('stock', v)}
              />
            </View>
            <Button
              style={{ marginVertical: 10 }}
              onPress={handleAddProductButton}
            >
              Tambah
            </Button>
          </ScrollView>
        </View>
      )}

      {openDetailProductPage && (
        <DetailProductPage
          productId={selectedProductId}
          handler={handleDetailProductPage}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 0.4,
    paddingTop: 20,
    backgroundColor: '#E6E6E6',
  },
  scannerContainer: {
    flex: 0.6,
    backgroundColor: '#000000',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productListContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  textTextInput: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  iconScanContainer: {
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  iconScanButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  iconScan: {
    height: 30,
    width: 30,
  },
})
