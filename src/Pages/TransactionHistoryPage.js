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
import { CreateReportPage } from './CreateReportPage'
import { Button } from '../Components/Button'

export const TransactionHistoryPage = () => {
  const [transactions, setTransaction] = useState([])
  const [activePage, setActivePage] = useState('transactionHistory')
  const [selectedTransaction, setSelectedTransaction] = useState({})

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get('/transactions')
      setTransaction(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenDetailTransactionPage = (item) => {
    setActivePage(
      activePage === 'transactionHistory'
        ? 'detailTransaction'
        : 'transactionHistory'
    )
    setSelectedTransaction(item)
  }

  const handleOpenCreateReportPage = () => {
    setActivePage(
      activePage === 'transactionHistory' ? 'createReport' : 'transactionHistory'
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleOpenDetailTransactionPage(item)}
    >
      <Text>
        {new Date(item.createdAt).toLocaleString('id-ID', {
          weekday: 'long',
          hour12: false,
        })}
      </Text>
      <Text>Rp{item.total}</Text>
    </TouchableOpacity>
  )

  return (
    <>
      {activePage === 'transactionHistory' && (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Riwayat Transaksi</Text>
            <Button onPress={handleOpenCreateReportPage}>Buat Laporan</Button>
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
            <View style={{ margin: 20 }}>
              <Text>Transaksi Kosong</Text>
            </View>
          )}
        </View>
      )}

      {activePage === 'detailTransaction' && (
        <DetailTransactionPage
          transactionId={selectedTransaction.id}
          handle={handleOpenDetailTransactionPage}
        />
      )}

      {activePage === 'createReport' && (
        <CreateReportPage handle={handleOpenCreateReportPage} />
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productListContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  productItem: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
})
