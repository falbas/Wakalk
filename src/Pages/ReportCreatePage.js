import axios from 'axios'
import { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Button } from '../Components/Button'
import { CustomTextInput } from '../Components/CustomTextInput'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { TransactionDetailPage } from './TransactionDetailPage'
import { ReportPrintPage } from './ReportPrintPage'

export const ReportCreatePage = ({ handle }) => {
  const [activePage, setActivePage] = useState('createReport')

  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    return currentDate
  })
  const [endDate, setEndDate] = useState(new Date())
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState({})

  const showDatepicker = (type) => {
    if (type === 'start') {
      DateTimePickerAndroid.open({
        value: startDate,
        onChange: (event, selectedDate) => {
          const currentDate = selectedDate
          currentDate.setHours(0, 0, 0, 0)
          setStartDate(currentDate)
        },
        mode: 'date',
        is24Hour: true,
      })
    } else {
      DateTimePickerAndroid.open({
        value: endDate,
        onChange: (event, selectedDate) => {
          const currentDate = selectedDate
          setEndDate(currentDate)
        },
        mode: 'date',
        is24Hour: true,
      })
    }
  }

  const getReport = async () => {
    try {
      const { data: response } = await axios.get(
        `/transactions?startDate=${startDate}&endDate=${endDate}`
      )
      setTransactions(response.data)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleOpenTransactionDetailPage = (item) => {
    setActivePage(
      activePage === 'createReport' ? 'detailTransaction' : 'createReport'
    )
    setSelectedTransaction(item)
  }

  const handleOpenReportPrintPage = () => {
    setActivePage(
      activePage === 'createReport' ? 'printReport' : 'createReport'
    )
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => handleOpenTransactionDetailPage(item)}
    >
      <View>
        <Text>
          {new Date(item.createdAt).toLocaleString('id-ID', {
            weekday: 'long',
            hour12: false,
          })}
        </Text>
        <Text>Rp{item.total}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <>
      {activePage === 'createReport' && (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={() => handle({})}>{'<'}</Button>
              <Text style={styles.titleText}>Buat Laporan</Text>
            </View>
            <Button
              style={transactions.length === 0 && { opacity: 0.75 }}
              onPress={handleOpenReportPrintPage}
              disabled={transactions.length === 0}
            >
              Cetak Laporan
            </Button>
          </View>
          <View style={styles.bodyContainer}>
            <CustomTextInput
              title={'Dari Tanggal'}
              onPressIn={() => showDatepicker('start')}
              showSoftInputOnFocus={false}
              value={`${startDate.getDate()}-${
                startDate.getMonth() + 1
              }-${startDate.getFullYear()}`}
            />
            <CustomTextInput
              title={'Sampai Tanggal'}
              onPressIn={() => showDatepicker('end')}
              showSoftInputOnFocus={false}
              value={`${endDate.getDate()}-${
                endDate.getMonth() + 1
              }-${endDate.getFullYear()}`}
            />
            <Button style={{ marginTop: 10 }} onPress={getReport}>
              Buat Laporan
            </Button>
            <SafeAreaView style={styles.transactionsContainer}>
              <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </SafeAreaView>
          </View>
        </View>
      )}
      {activePage === 'printReport' && (
        <ReportPrintPage
          handle={handleOpenReportPrintPage}
          transactions={transactions}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {activePage === 'detailTransaction' && (
        <TransactionDetailPage
          handle={handleOpenTransactionDetailPage}
          transactionId={selectedTransaction.id}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
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
  bodyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textTextInput: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  transactionsContainer: {
    paddingBottom: 480,
    marginTop: 5,
  },
  transactionItem: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
})
