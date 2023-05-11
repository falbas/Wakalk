import axios from 'axios'
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import { Button } from './Components/Button'
import { BillPaymentModal } from './Components/BillPaymentModal'

export const DetailTransactionPage = ({ transactionId, handle }) => {
  const [billPaymentModalVisible, setBillPaymentModalVisible] = useState(false)
  const [transaction, setTransaction] = useState()

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get(
        `/transactions/${transactionId}`
      )
      setTransaction(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenBillPaymentModal = () => {
    setBillPaymentModalVisible(false)
    fetchData()
  }

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={{ flex: 0.5 }}>{item.name}</Text>
      <Text style={{ flex: 0.1, textAlign: 'right' }}>{item.count}</Text>
      <Text style={{ flex: 0.2, textAlign: 'right' }}>{item.price}</Text>
      <Text style={{ flex: 0.2, textAlign: 'right' }}>
        {item.count * item.price}
      </Text>
    </View>
  )

  if (transaction !== undefined) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Detail Transaksi</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={() => handle({})}>Kembali</Button>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Text>
              {transaction.status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
            </Text>
            <Text>
              {new Date(transaction.createdAt).toLocaleString('id-ID', {
                weekday: 'long',
                hour12: false,
              })}
            </Text>

            {transaction.status === 'unpaid' && (
              <Text>{transaction.customer}</Text>
            )}
          </View>
          <SafeAreaView>
            <FlatList
              style={styles.productListContainer}
              data={transaction.products}
              renderItem={renderItem}
              keyExtractor={(item) => item.barcode}
            />
          </SafeAreaView>
          <View style={styles.totalContainer}>
            <Text>Total</Text>
            <Text>Rp{transaction.total}</Text>
          </View>
        </View>
        {transaction.status === 'unpaid' && (
          <>
            <View style={styles.bottomContainer}>
              <Button onPress={() => setBillPaymentModalVisible(true)}>
                Sudah Dibayar
              </Button>
            </View>
            <BillPaymentModal
              visible={billPaymentModalVisible}
              handle={handleOpenBillPaymentModal}
              transaction={transaction}
            />
          </>
        )}
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 50,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginHorizontal: 50,
    marginTop: 20,
  },
  productListContainer: {
    marginTop: 20,
    marginHorizontal: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  productItem: {
    flexDirection: 'row',
  },
  totalContainer: {
    marginHorizontal: 50,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
