import axios from 'axios'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'

import { Nav } from './src/Components/Nav'
import { Home } from './src/Home'
import { ProductListPage } from './src/ProductListPage'
import { TransactionHistoryPage } from './src/TransactionHistoryPage'
import { BillBookPage } from './src/BillBookPage'

axios.defaults.baseURL = Constants.expoConfig.extra.apiUrl

export default function App() {
  const [activePage, setActivePage] = useState('home')

  const switchPage = (page) => {
    setActivePage(page)
  }

  return (
    <>
      <View style={styles.container}>
        {activePage === 'home' && <Home />}
        {activePage === 'productlistpage' && <ProductListPage />}
        {activePage === 'transactionhistorypage' && <TransactionHistoryPage />}
        {activePage === 'billbookpage' && <BillBookPage />}
      </View>
      <Nav onSwitch={switchPage} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
})
