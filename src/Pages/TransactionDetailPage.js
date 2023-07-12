import axios from 'axios'
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import { Button } from '../Components/Button'

export const TransactionDetailPage = ({ transactionId, handle }) => {
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
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={() => handle({})}>{'<'}</Button>
            </View>
            <Text style={styles.titleText}>Detail Transaksi</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text>
              {new Date(transaction.createdAt).toLocaleString('id-ID', {
                weekday: 'long',
                hour12: false,
              })}
            </Text>
            <Text>
              {'Metode Pembayaran: '}
              {transaction.paymentMethod == 'cash' && 'Cash'}
              {transaction.paymentMethod == 'qris' && 'QRIS'}
            </Text>
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
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  productListContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  totalContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
