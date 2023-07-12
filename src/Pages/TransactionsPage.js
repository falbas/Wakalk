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

import { TransactionDetailPage } from './TransactionDetailPage'
import { ReportCreatePage } from './ReportCreatePage'
import { Button } from '../Components/Button'

export const TransactionsPage = () => {
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

  const handleOpenTransactionDetailPage = (item) => {
    setActivePage(
      activePage === 'transactionHistory'
        ? 'detailTransaction'
        : 'transactionHistory'
    )
    setSelectedTransaction(item)
  }

  const handleOpenReportCreatePage = () => {
    setActivePage(
      activePage === 'transactionHistory' ? 'createReport' : 'transactionHistory'
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleOpenTransactionDetailPage(item)}
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
            <Button onPress={handleOpenReportCreatePage}>Buat Laporan</Button>
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
        <TransactionDetailPage
          transactionId={selectedTransaction.id}
          handle={handleOpenTransactionDetailPage}
        />
      )}

      {activePage === 'createReport' && (
        <ReportCreatePage handle={handleOpenReportCreatePage} />
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
