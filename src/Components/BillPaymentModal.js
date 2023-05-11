import axios from 'axios'
import { useState } from 'react'
import { StyleSheet, Text, View, Modal } from 'react-native'
import { Button } from './Button'

export const BillPaymentModal = ({ visible, handle, transaction }) => {
  const handleBillPayment = async () => {
    try {
      const response = await axios.put(`/transactions/${transaction.id}`, {
        status: 'paid',
        customer: transaction.customer,
        total: transaction.total,
        products: transaction.products,
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
          <View>
            <Text style={styles.titleText}>Konfirmasi Sudah Dibayar</Text>
            <Text style={styles.bodyText}>
              Transaksi sudah dibayar dan hapus dari daftar utang?
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.confirmationAButton}
                onPress={handleBillPayment}
              >
                Simpan
              </Button>
              <Button style={styles.confirmationBButton} onPress={handle}>
                Batal
              </Button>
            </View>
          </View>
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
  titleText: {
    fontWeight: 'bold',
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 5,
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
})
