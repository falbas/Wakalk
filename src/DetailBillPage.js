import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import { Button } from './Components/Button'

export const DetailBillPage = ({ selectedBill, handleOpenDetailBillPage }) => {
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={{ flex: 0.5 }}>{item.name}</Text>
      <Text style={{ flex: 0.1, textAlign: 'right' }}>{item.count}</Text>
      <Text style={{ flex: 0.2, textAlign: 'right' }}>{item.price}</Text>
      <Text style={{ flex: 0.2, textAlign: 'right' }}>
        {item.count * item.price}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Detail Utang</Text>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => handleOpenDetailBillPage({})}>Kembali</Button>
        </View>
      </View>
      <View style={styles.dateContainer}>
        <Text>
          {new Date(selectedBill.createdAt).toLocaleString('id-ID', {
            weekday: 'long',
            hour12: false,
          })}
        </Text>
        <Text>{selectedBill.customer}</Text>
      </View>
      <SafeAreaView>
        <FlatList
          style={styles.productListContainer}
          data={selectedBill.products}
          renderItem={renderItem}
          keyExtractor={(item) => item.barcode}
        />
      </SafeAreaView>
      <View style={styles.totalContainer}>
        <Text>Total</Text>
        <Text>Rp{selectedBill.total}</Text>
      </View>
    </View>
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
  dateContainer: {
    marginHorizontal: 50,
    marginTop: 20,
  },
  productListContainer: {
    marginTop: 20,
    marginHorizontal: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  productItem: {
    flexDirection: 'row',
  },
  totalContainer: {
    marginHorizontal: 50,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
