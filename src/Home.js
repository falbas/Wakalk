import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Button } from './Components/Button'
import { SearchByNameModal } from './Components/SearchByNameModal'
import { SearchByBarcodeModal } from './Components/SearchByBarcodeModal'
import { SaveTransactionModal } from './Components/SaveTransactionModal'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Checkbox from 'expo-checkbox'

export const Home = () => {
  const countTextInput = useRef(null)

  const [hasPermission, setHasPermission] = useState(null)
  const [scannerIsVisible, setScannerIsVisible] = useState(false)
  const [searchByNameModalVisible, setSearchByNameModalVisible] =
    useState(false)
  const [searchByBarcodeModalVisible, setSearchByBarcodeModalVisible] =
    useState(false)
  const [scanned, setScanned] = useState(false)
  const [saveTransactionModalVisible, setSaveTransactionModalVisible] =
    useState(false)
  const [alreadyInBuyedProduct, setAlreadyInBuyedProduct] = useState(false)

  const [scannedData, setScannedData] = useState({
    barcode: '',
    name: '',
    price: 0,
    count: 0,
  })

  const [buyedProducts, setBuyedProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [buyedProductChecked, setBuyedProductChecked] = useState([])

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

    const fetchData = async (v) => {
      try {
        const { data: response } = await axios.get(`/products?barcode=${v}`)
        const product = response.data[0]
        if (product !== undefined) {
          setScannedData({
            barcode: product.barcode,
            name: product.name,
            price: product.price,
            count: 0,
          })
        } else {
          alert(`Produk dengan barcode ${data} tidak ada di etalase`)
        }
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchData(data)

    countTextInput.current.focus()
  }

  const handleOpenScanner = () => {
    setScanned(false)
    setScannerIsVisible(!scannerIsVisible)
    setScannedData({
      barcode: '',
      name: '',
      price: 0,
      count: 0,
    })
  }

  const handleDeleteButton = () => {
    const updatedBuyedProduct = []
    let updatedTotal = 0
    const updatedBuyedProductChecked = []
    buyedProducts.forEach((product, index) => {
      if (!buyedProductChecked[index]) {
        updatedBuyedProduct.push(product)
        updatedTotal += product.price * product.count
        updatedBuyedProductChecked.push(false)
      }
    })

    setBuyedProducts(updatedBuyedProduct)
    setTotal(updatedTotal)
    setBuyedProductChecked(updatedBuyedProductChecked)
  }

  const handleAddProduct = () => {
    if (
      scannedData.barcode !== '' &&
      scannedData.name !== '' &&
      scannedData.count !== 0
    ) {
      if (!alreadyInBuyedProduct) {
        setBuyedProducts((prev) => [...prev, scannedData])
        setTotal(total + scannedData.price * scannedData.count)
        setBuyedProductChecked((prev) => [...prev, false])
      } else {
        let updatedTotal = 0
        const updatedBuyedProduct = buyedProducts.map((item) => {
          const { price, count } =
            item.barcode === scannedData.barcode ? scannedData : item
          updatedTotal += price * count
          return { ...item, price, count }
        })
        setBuyedProducts(updatedBuyedProduct)
        setTotal(updatedTotal)
      }
      setScanned(false)
      setScannedData({
        barcode: '',
        name: '',
        price: 0,
        count: 0,
      })
    }
  }

  const handleEditBuyedProduct = (item) => {
    setScannedData(item)
    setAlreadyInBuyedProduct(true)
  }

  const handleBuyedProductChecked = (index) => {
    const updatedBuyedProductChecked = buyedProductChecked.map((item, i) =>
      i === index ? !buyedProductChecked[i] : buyedProductChecked[i]
    )
    setBuyedProductChecked(updatedBuyedProductChecked)
  }

  const handleDuplucateBuyedProduct = (item) => {
    const product = buyedProducts.filter((p) => p.barcode === item.barcode)[0]

    if (product !== undefined) {
      setScannedData(product)
      setAlreadyInBuyedProduct(true)
    } else {
      setAlreadyInBuyedProduct(false)
    }
  }

  const handleOnPressSearchByBarcodeModal = (item) => {
    if (item !== 'cancel') {
      setScannedData((prev) => {
        return {
          ...prev,
          barcode: item.barcode,
          name: item.name,
          price: item.price,
        }
      })
      countTextInput.current.focus()
      handleDuplucateBuyedProduct(item)
    }
    setSearchByBarcodeModalVisible(!searchByBarcodeModalVisible)
  }

  const handleOnPressSearchByNameModal = (item) => {
    if (item !== 'cancel') {
      setScannedData((prev) => {
        return {
          ...prev,
          barcode: item.barcode,
          name: item.name,
          price: item.price,
        }
      })
      handleDuplucateBuyedProduct(item)
      countTextInput.current.focus()
    }
    setSearchByNameModalVisible(!searchByNameModalVisible)
  }

  const handleSaveTransactionModal = (con) => {
    if (con !== 'cancel') {
      setTotal(0)
      setBuyedProducts([])
    }
    setSaveTransactionModalVisible(!saveTransactionModalVisible)
  }

  return (
    <>
      {!scannerIsVisible && (
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Wakalk</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button
                style={[
                  styles.resetButton,
                  (!buyedProductChecked.includes(true) ||
                    buyedProductChecked.length === 0) && { opacity: 0.75 },
                ]}
                onPress={handleDeleteButton}
                disabled={
                  !buyedProductChecked.includes(true) ||
                  buyedProductChecked.length === 0
                }
              >
                Hapus
              </Button>
              <Button
                style={total === 0 && { opacity: 0.75 }}
                onPress={() => setSaveTransactionModalVisible(true)}
                disabled={total === 0}
              >
                Simpan
              </Button>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalValue}>{`Rp${total}`}</Text>
          </View>
          <ScrollView style={styles.productListContainer}>
            {buyedProducts.map((item, index) => (
              <TouchableOpacity
                style={styles.productItemContainer}
                key={index}
                onPress={() => handleEditBuyedProduct(item)}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={buyedProductChecked[index]}
                  onValueChange={() => handleBuyedProductChecked(index)}
                />
                <Text style={{ flex: 0.5 }}>{item.name}</Text>
                <Text style={{ flex: 0.1, textAlign: 'right' }}>
                  {item.count}
                </Text>
                <Text style={{ flex: 0.2, textAlign: 'right' }}>
                  {item.price}
                </Text>
                <Text style={{ flex: 0.2, textAlign: 'right' }}>
                  {item.count * item.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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

      <View style={styles.bottomContainer}>
        <ScrollView>
          <View>
            <Text style={styles.textTextInput}>Barcode Produk</Text>
            <TextInput
              style={styles.addTextInput}
              keyboardType="numeric"
              value={scannedData.barcode}
              onPressIn={() => setSearchByBarcodeModalVisible(true)}
              placeholder="Barcode Produk *"
            />
            <View style={styles.iconScanContainer}>
              <TouchableOpacity
                style={styles.iconScanButton}
                onPress={handleOpenScanner}
              >
                <Image
                  style={styles.iconScan}
                  source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.textTextInput}>Nama Produk</Text>
            <TextInput
              style={styles.addTextInput}
              value={scannedData.name}
              onPressIn={() => setSearchByNameModalVisible(true)}
              placeholder="Nama Produk *"
            />
          </View>
          <View>
            <Text style={styles.textTextInput}>Jumlah</Text>
            <TextInput
              style={styles.addTextInput}
              keyboardType="numeric"
              ref={countTextInput}
              onChangeText={(v) =>
                setScannedData((prev) => {
                  return { ...prev, count: v }
                })
              }
              value={
                scannedData.count === 0 ? '' : scannedData.count.toString()
              }
              placeholder="Jumlah *"
            />
          </View>
          <Button
            style={[
              { marginTop: 10 },
              scannedData.count === 0 && { opacity: 0.75 },
            ]}
            onPress={handleAddProduct}
            disabled={scannedData.count === 0}
          >
            {alreadyInBuyedProduct === true ? 'Ubah' : 'Tambah'}
          </Button>
          {alreadyInBuyedProduct && (
            <Text style={{ color: '#FF0000' }}>
              *Produk sudah ada di keranjang
            </Text>
          )}
        </ScrollView>
      </View>

      {searchByBarcodeModalVisible && (
        <SearchByBarcodeModal
          visible={searchByBarcodeModalVisible}
          handler={handleOnPressSearchByBarcodeModal}
          value={scannedData.barcode}
        />
      )}
      {searchByNameModalVisible && (
        <SearchByNameModal
          visible={searchByNameModalVisible}
          handler={handleOnPressSearchByNameModal}
          value={scannedData.name}
        />
      )}
      {saveTransactionModalVisible && (
        <SaveTransactionModal
          visible={saveTransactionModalVisible}
          handle={handleSaveTransactionModal}
          total={total}
          buyedProducts={buyedProducts}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 0.6,
  },
  productListContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  scannerContainer: {
    flex: 0.6,
    backgroundColor: '#000000',
  },
  bottomContainer: {
    flex: 0.4,
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 20,
  },
  totalText: {
    textAlign: 'center',
  },
  totalValue: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
  productItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginVertical: 3,
    marginEnd: 3,
  },
  resetButton: {
    backgroundColor: '#FF0000',
    marginRight: 10,
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
