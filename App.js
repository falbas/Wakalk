import axios from 'axios'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'

import { Nav } from './src/Components/Nav'
import { Home } from './src/Pages/Home'
import { ProductsPage } from './src/Pages/ProductsPage'
import { TransactionsPage } from './src/Pages/TransactionsPage'

axios.defaults.baseURL = Constants.expoConfig.extra.apiUrl

export default function App() {
  const [activePage, setActivePage] = useState('Home')

  const switchPage = (page) => {
    setActivePage(page)
  }

  return (
    <>
      <View style={styles.container}>
        {activePage === 'Home' && <Home />}
        {activePage === 'ProductsPage' && <ProductsPage />}
        {activePage === 'TransactionsPage' && <TransactionsPage />}
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
