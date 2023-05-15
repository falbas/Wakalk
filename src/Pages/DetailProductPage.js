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
import { ConfirmModal } from '../Components/ConfirmModal'

export const DetailProductPage = ({ productId, handler }) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scannerIsVisible, setScannerIsVisible] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [product, setProduct] = useState()

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get(`/products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
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
    setProduct((prev) => {
      return { ...prev, barcode: data }
    })
  }

  const handleOpenScanner = () => {
    setScanned(false)
    setScannerIsVisible(!scannerIsVisible)
  }

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(`/products/${productId}`, {
        barcode: product.barcode,
        name: product.name,
        price: product.price,
        stock: product.stock,
      })
    } catch (error) {
      console.error(error.message)
    }
    setUpdateModalVisible(!updateModalVisible)
  }

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`/products/${productId}`)
      if (response.status === 200) {
        handler()
      }
    } catch (error) {
      console.error(error.message)
    }
    setDeleteModalVisible(!deleteModalVisible)
  }

  if (product !== undefined) {
    return (
      <>
        {scannerIsVisible && (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        )}
        <View
          style={[
            styles.container,
            scannerIsVisible && { flex: 0.4, paddingTop: 20 },
          ]}
        >
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={handler}>{'<'}</Button>
              <Text style={styles.titleText}>Detail Produk</Text>
            </View>
            <Button
              style={styles.deleteButton}
              onPress={() => setDeleteModalVisible(true)}
            >
              Hapus Produk
            </Button>
          </View>
          <ScrollView style={styles.inputContainer}>
            <View>
              <Text style={styles.textTextInput}>Barcode Produk</Text>
              <TextInput
                style={styles.addTextInput}
                value={product.barcode}
                onChangeText={(v) => {
                  setProduct((prev) => {
                    return { ...prev, barcode: v }
                  })
                }}
                keyboardType="numeric"
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
                value={product.name}
                onChangeText={(v) => {
                  setProduct((prev) => {
                    return { ...prev, name: v }
                  })
                }}
              />
            </View>
            <View>
              <Text style={styles.textTextInput}>Harga</Text>
              <TextInput
                style={styles.addTextInput}
                value={product.price.toString()}
                onChangeText={(v) => {
                  setProduct((prev) => {
                    return { ...prev, price: v }
                  })
                }}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text style={styles.textTextInput}>Stok</Text>
              <TextInput
                style={styles.addTextInput}
                value={product.stock.toString()}
                onChangeText={(v) => {
                  setProduct((prev) => {
                    return { ...prev, stock: v }
                  })
                }}
                keyboardType="numeric"
              />
            </View>
            <Button
              style={{ marginVertical: 10 }}
              onPress={() => setUpdateModalVisible(!updateModalVisible)}
            >
              Perbarui Produk
            </Button>
          </ScrollView>
        </View>

        <ConfirmModal
          visible={updateModalVisible}
          title={'Perbarui Produk'}
          body={'Ingin memperbarui produk?'}
          yesText={'Perbarui'}
          yesHandler={handleUpdateProduct}
          noText={'Batal'}
          noHandler={() => setUpdateModalVisible(!updateModalVisible)}
        />

        <ConfirmModal
          visible={deleteModalVisible}
          title={'Hapus Produk'}
          body={'Ingin menghapus produk?'}
          yesText={'Hapus'}
          yesHandler={handleDeleteProduct}
          noText={'Batal'}
          noHandler={() => setDeleteModalVisible(!deleteModalVisible)}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 5,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF0000',
  },
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
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
