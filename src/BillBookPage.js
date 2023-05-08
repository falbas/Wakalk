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

import { DetailBillPage } from './DetailBillPage'

export const BillBookPage = () => {
  const [bills, setBill] = useState()
  const [openDetailBillPage, setOpenDetailBillPage] =
    useState(false)
  const [selectedBill, setSelectedBill] = useState({})

  const fetchData = async () => {
    try {
      const { data: response } = await axios.get('/transactions?status=unpaid')
      setBill(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenDetailBillPage = (item) => {
    setOpenDetailBillPage(!openDetailBillPage)
    setSelectedBill(item)
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
          <SafeAreaView style={{ paddingBottom: 50 }}>
            <FlatList
              style={styles.productListContainer}
              data={bills}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        </View>
      )}

      {openDetailBillPage && (
        <DetailBillPage
          selectedBill={selectedBill}
          handleOpenDetailBillPage={handleOpenDetailBillPage}
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
