import axios from 'axios'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Home } from './src/Home'
import { ProductPage } from './src/ProductPage'
import { Nav } from './src/Components/Nav'

axios.defaults.baseURL = 'http://192.168.1.5:8000'

export default function App() {
  const [activePage, setActivePage] = useState('home')

  const switchPage = (page) => {
    setActivePage(page)
  }

  return (
    <View style={styles.container}>
      {activePage === 'home' && <Home />}
      {activePage === 'productpage' && <ProductPage />}
      <Nav onSwitch={switchPage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
