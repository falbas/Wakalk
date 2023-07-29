import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button } from '../Components/Button'
import { CustomTextInput } from '../Components/CustomTextInput'
import { ConfirmModal } from '../Components/ConfirmModal'

export const ProductDetailPage = ({ productId, handler }) => {
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
            <CustomTextInput
              title={'Barcode Produk'}
              keyboardType="numeric"
              value={product.barcode}
              onChangeText={(v) => {
                setProduct((prev) => {
                  return { ...prev, barcode: v }
                })
              }}
              placeholder={'Barcode Produk *'}
              buttonHandler={handleOpenScanner}
              iconSrc={require('../../assets/barcode-scanner.png')}
            />
            <CustomTextInput
              title={'Nama Produk'}
              value={product.name}
              placeholder={'Nama Produk *'}
              onChangeText={(v) => {
                setProduct((prev) => {
                  return { ...prev, name: v }
                })
              }}
            />
            <CustomTextInput
              title={'Harga'}
              value={product.price.toString()}
              placeholder={'Harga *'}
              onChangeText={(v) => {
                setProduct((prev) => {
                  return { ...prev, price: v }
                })
              }}
            />
            <CustomTextInput
              title={'Stok'}
              value={product.stock.toString()}
              placeholder={'Stok *'}
              onChangeText={(v) => {
                setProduct((prev) => {
                  return { ...prev, stock: v }
                })
              }}
            />
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
})
