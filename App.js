import { StyleSheet, View } from 'react-native'
import { Home } from './src/Home'
import { Nav } from './src/Components/Nav'

export default function App() {
  return (
    <View style={styles.container}>
      <Home />
      <Nav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
