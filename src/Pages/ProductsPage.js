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
  Keyboard,
} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button } from '../Components/Button'
import { CustomTextInput } from '../Components/CustomTextInput'
import { ProductDetailPage } from './ProductDetailPage'

export const ProductsPage = () => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scannerIsVisible, setScannerIsVisible] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false)

  const [products, setProducts] = useState()
  const [openAddProductPage, setOpenAddProductPage] = useState(false)
  const [openProductDetailPage, setOpenProductDetailPage] = useState(false)
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

  const handleProductDetailPage = (itemId) => {
    setOpenProductDetailPage(!openProductDetailPage)
    setOpenAddProductPage(false)
    setScannerIsVisible(false)
    setSelectedProductId(itemId)
    fetchData()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductDetailPage(item.id)}
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
      {!scannerIsVisible && !openProductDetailPage && (
        <View
          style={[
            styles.topContainer,
            openAddProductPage && { flex: 0.5 },
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
            <CustomTextInput
              title={'Barcode Produk'}
              keyboardType="numeric"
              value={inputProduct.barcode}
              onChangeText={(v) => handleInputProduct('barcode', v)}
              placeholder={'Barcode Produk *'}
              buttonHandler={handleOpenScanner}
              iconSrc={require('../../assets/barcode-scanner.png')}
            />
            <CustomTextInput
              title={'Nama Produk'}
              value={inputProduct.name}
              onChangeText={(v) => handleInputProduct('name', v)}
              placeholder={'Nama Produk *'}
            />
            <CustomTextInput
              title={'Harga'}
              keyboardType="numeric"
              value={
                inputProduct.price === 0 ? '' : inputProduct.price.toString()
              }
              onChangeText={(v) => handleInputProduct('price', v)}
              placeholder={'Harga *'}
            />
            <CustomTextInput
              title={'Stok'}
              keyboardType="numeric"
              value={
                inputProduct.stock === 0 ? '' : inputProduct.stock.toString()
              }
              onChangeText={(v) => handleInputProduct('stock', v)}
              placeholder={'Stok *'}
            />
            <Button
              style={{ marginVertical: 10 }}
              onPress={handleAddProductButton}
            >
              Tambah
            </Button>
          </ScrollView>
        </View>
      )}

      {openProductDetailPage && (
        <ProductDetailPage
          productId={selectedProductId}
          handler={handleProductDetailPage}
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
    flex: 0.5,
    paddingTop: 20,
    backgroundColor: '#E6E6E6',
  },
  scannerContainer: {
    flex: 0.5,
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
})
