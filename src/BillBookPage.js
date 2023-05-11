import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native'

import { DetailTransactionPage } from './DetailTransactionPage'

export const BillBookPage = () => {
  const [transactions, setTransactions] = useState([])
  const [openDetailBillPage, setOpenDetailBillPage] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState({})

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get('/transactions?status=unpaid')
      setTransactions(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [openDetailBillPage])

  const handleOpenDetailBillPage = (item) => {
    setOpenDetailBillPage(!openDetailBillPage)
    setSelectedTransaction(item)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleOpenDetailBillPage(item)}
    >
      <Text>
        {new Date(item.createdAt).toLocaleString('id-ID', {
          weekday: 'long',
          hour12: false,
        })}
      </Text>
      <Text>{item.customer}</Text>
      <Text>Rp{item.total}</Text>
    </TouchableOpacity>
  )

  return (
    <>
      {!openDetailBillPage && (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Buku Utang</Text>
          </View>
          {transactions.length > 0 ? (
            <SafeAreaView style={{ paddingBottom: 50 }}>
              <FlatList
                style={styles.productListContainer}
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </SafeAreaView>
          ) : (
            <View style={{ padding: 50 }}>
              <Text>Tidak ada utang</Text>
            </View>
          )}
        </View>
      )}

      {openDetailBillPage && (
        <DetailTransactionPage
          transactionId={selectedTransaction.id}
          handle={handleOpenDetailBillPage}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  productListContainer: {
    marginTop: 20,
    paddingHorizontal: 50,
  },
  productItem: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
})
