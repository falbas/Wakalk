import axios from 'axios'
import { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Modal } from 'react-native'
import { Button } from './Button'

export const SaveTransactionModal = ({
  visible,
  handle,
  total,
  buyedProducts,
}) => {
  const [payLater, setPayLater] = useState(false)
  const [customer, setCustomer] = useState('')

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
          {!payLater && (
            <View>
              <Text style={styles.titleText}>Simpan Transaksi</Text>
              <Text style={styles.bodyText}>
                Transaksi sudah dibayar dan ingin disimpan?
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.confirmationAButton}
                  onPress={() => handleSaveTransaction('paid')}
                >
                  Simpan
                </Button>
                <Button
                  style={styles.confirmationBButton}
                  onPress={() => setPayLater(!payLater)}
                >
                  Bayar Nanti
                </Button>
              </View>
            </View>
          )}
          {payLater && (
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
                  style={[
                    styles.confirmationAButton,
                    { flexBasis: '100%' },
                    customer === '' && { opacity: 0.75 },
                  ]}
                  onPress={() => handleSaveTransaction('unpaid')}
                  disabled={customer === ''}
                >
                  Bayar Nanti
                </Button>
              </View>
            </View>
          )}
          <Button style={styles.cancelButton} onPress={() => handle('cancel')}>
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
    flexDirection: 'row',
    marginTop: 20,
  },
  confirmationAButton: {
    flexBasis: '50%',
    marginHorizontal: 5,
  },
  confirmationBButton: {
    flexBasis: '50%',
    marginHorizontal: 5,
    backgroundColor: '#FF0000',
  },
  cancelButton: {
    marginTop: 10,
    marginHorizontal: 5,
  },
})
