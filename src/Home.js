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
import { BarCodeScanner } from 'expo-barcode-scanner'
import PRODUCTS from './Products'

export const Home = () => {
  const countTextInput = useRef(null)

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [openScanner, setOpenScanner] = useState(false)
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
    setOpenScanner(false)

    const product = PRODUCTS.filter((p) => p.barcode === data)[0]
    setScannedData((prev) => {
      return {
        ...prev,
        barcode: product.barcode,
        name: product.name,
        price: product.price,
      }
    })

    countTextInput.current.focus()
  }

  const handleOpenScanner = () => {
    setScanned(false)
    setOpenScanner(!openScanner)
  }

  const handleBarcodeTextInput = (v) => {
    setScannedData((prev) => {
      return {
        ...prev,
        barcode: v,
      }
    })
  }

  const handleNameTextInput = (v) => {
    setScannedData((prev) => {
      return {
        ...prev,
        name: v,
      }
    })
  }

  const handleCountTextInput = (v) => {
    setScannedData((prev) => {
      return {
        ...prev,
        count: v,
      }
    })
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
      setScannedData((prev) => {
        return {
          ...prev,
          barcode: '',
          name: '',
          count: 0,
          price: 0,
        }
      })
    }
  }

  return (
    <>
      {!openScanner && (
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Wakalk</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button
                style={styles.resetButton}
                textStyle={{ color: '#FF0000' }}
              >
                Reset
              </Button>
              <Button>Simpan</Button>
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

      {openScanner && (
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
              onChangeText={(v) => handleBarcodeTextInput(v)}
              value={scannedData.barcode}
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
              onChangeText={(v) => handleNameTextInput(v)}
              value={scannedData.name}
            />
          </View>
          <View>
            <Text style={styles.textTextInput}>Jumlah</Text>
            <TextInput
              style={styles.addTextInput}
              keyboardType="numeric"
              ref={countTextInput}
              onChangeText={(v) => handleCountTextInput(v)}
              value={scannedData.count === 0 ? '' : scannedData.count}
            />
          </View>
          <Button style={{ marginTop: 10 }} onPress={handleAddProduct}>
            Tambah
          </Button>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 0.6,
    paddingTop: 50,
    paddingHorizontal: 50,
  },
  productListContainer: {
    marginVertical: 20,
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
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
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
