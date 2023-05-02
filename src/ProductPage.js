import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native'

import PRODUCTS from './Products'

export const ProductPage = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.resultContainer}>
      <Text>{item.barcode}</Text>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titleText}>Daftar Produk</Text>
      </View>
      <SafeAreaView>
        <FlatList
          data={PRODUCTS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
})
