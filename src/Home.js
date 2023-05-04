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
import { BarCodeScanner } from 'expo-barcode-scanner'

export const Home = () => {
  const countTextInput = useRef(null)

  const [hasPermission, setHasPermission] = useState(null)
  const [scannerIsVisible, setScannerIsVisible] = useState(false)
  const [searchByNameModalVisible, setSearchByNameModalVisible] =
    useState(false)
  const [searchByBarcodeModalVisible, setSearchByBarcodeModalVisible] =
    useState(false)
  const [scanned, setScanned] = useState(false)

  const [scannedData, setScannedData] = useState({
    barcode: '',
    name: '',
    price: 0,
    count: 0,
  })

  const [buyedProducts, setBuyedProducts] = useState([])
  const [total, setTotal] = useState(0)

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

  const handleResetButton = () => {
    setBuyedProducts([])
    setTotal(0)
  }

  const handleAddProduct = () => {
    if (
      scannedData.barcode !== '' &&
      scannedData.name !== '' &&
      scannedData.count !== 0
    ) {
      setBuyedProducts((prev) => [...prev, scannedData])
      setScanned(false)
      setTotal(total + scannedData.price * scannedData.count)
      setScannedData({
        barcode: '',
        name: '',
        price: 0,
        count: 0,
      })
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
      countTextInput.current.focus()
    }
    setSearchByNameModalVisible(!searchByNameModalVisible)
  }

  const handleSaveTransaction = async () => {
    try {
      const response = await axios.post('/transactions', {
        total: total,
        products: buyedProducts,
      })
      if (response.status === 200) {
        setTotal(0)
        setBuyedProducts([])
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <>
      {!scannerIsVisible && (
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Wakalk</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button
                style={styles.resetButton}
                textStyle={{ color: '#FF0000' }}
                onPress={handleResetButton}
              >
                Reset
              </Button>
              <Button onPress={handleSaveTransaction}>Simpan</Button>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalValue}>{`Rp${total}`}</Text>
          </View>
          <ScrollView style={styles.productListContainer}>
            {buyedProducts.map((item, index) => (
              <View style={styles.productItemContainer} key={index}>
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
              </View>
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
            />
          </View>
          <Button style={{ marginTop: 10 }} onPress={handleAddProduct}>
            Tambah
          </Button>
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
    </>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 0.6,
  },
  productListContainer: {
    marginVertical: 20,
    paddingHorizontal: 50,
  },
  scannerContainer: {
    flex: 0.6,
    paddingTop: 50,
    paddingHorizontal: 50,
    backgroundColor: '#000000',
  },
  bottomContainer: {
    flex: 0.4,
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 50,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 50,
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
  },
  resetButton: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 1,
    borderColor: '#FF0000',
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
