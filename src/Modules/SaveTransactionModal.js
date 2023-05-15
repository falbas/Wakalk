import axios from 'axios'
import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Modal, Image } from 'react-native'
import { Button } from '../Components/Button'

export const SaveTransactionModal = ({
  visible,
  handle,
  total,
  buyedProducts,
}) => {
  const [payLater, setPayLater] = useState(false)
  const [customer, setCustomer] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const handleSaveTransaction = async (status) => {
    try {
      const response = await axios.post('/transactions', {
        status: status,
        customer: customer,
        total: total,
        products: buyedProducts,
      })
      if (response.status === 200) {
        handle()
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.container}>
          {paymentMethod === '' && (
            <View>
              <Text style={styles.titleText}>Pilih Metode Pembayaran</Text>
              <Text style={styles.bodyText}>
                Pilih metode pembayaran yang ingin digunakan
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.button}
                  onPress={() => setPaymentMethod('cash')}
                >
                  Cash
                </Button>
                <Button
                  style={styles.button}
                  onPress={() => setPaymentMethod('qris')}
                >
                  QRIS
                </Button>
                <Button
                  style={[styles.button, { backgroundColor: '#FF0000' }]}
                  onPress={() => setPaymentMethod('paylater')}
                >
                  Bayar Nanti
                </Button>
              </View>
            </View>
          )}
          {paymentMethod === 'cash' && (
            <View>
              <Text style={styles.titleText}>Cash</Text>
              <Text style={styles.bodyText}>Bayar secara cash</Text>
              <View style={styles.buttonContainer}>
                <Button style={styles.button}>Simpan</Button>
                <Button
                  style={styles.button}
                  onPress={() => setPaymentMethod('')}
                >
                  Ubah Metode Pembayaran
                </Button>
              </View>
            </View>
          )}
          {paymentMethod === 'qris' && (
            <View>
              <Text style={styles.titleText}>QRIS</Text>
              <Text style={styles.bodyText}>
                Silahkan scan QR berikut untuk pembayaran
              </Text>
              <Image
                style={{
                  width: 200,
                  height: 200,
                  alignSelf: 'center',
                  marginTop: 10,
                }}
                resizeMode="contain"
                source={require('../../assets/qr-gojek.jpeg')}
              />
              <View style={styles.buttonContainer}>
                <Button style={styles.button}>Simpan</Button>
                <Button
                  style={styles.button}
                  onPress={() => setPaymentMethod('')}
                >
                  Ubah Metode Pembayaran
                </Button>
              </View>
            </View>
          )}
          {paymentMethod === 'paylater' && (
            <View>
              <Text style={styles.titleText}>Bayar Nanti</Text>
              <Text style={styles.bodyText}>
                Transaksi akan dibayar nanti dan dimasukan ke buku utang,
                masukan nama pembeli
              </Text>
              <TextInput
                style={styles.payLaterTextInput}
                value={customer}
                onChangeText={(v) => setCustomer(v)}
                placeholder="Nama Pembeli *"
              />
              <View style={styles.buttonContainer}>
                <Button
                  style={[styles.button, customer === '' && { opacity: 0.75 }]}
                  onPress={() => handleSaveTransaction('unpaid')}
                  disabled={customer === ''}
                >
                  Bayar Nanti
                </Button>
                <Button
                  style={styles.button}
                  onPress={() => setPaymentMethod('')}
                >
                  Ubah Metode Pembayaran
                </Button>
              </View>
            </View>
          )}
          <Button style={styles.button} onPress={() => handle('cancel')}>
            Batal
          </Button>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  titleText: {
    fontWeight: 'bold',
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 5,
  },
  payLaterTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginTop: 5,
  },
})
