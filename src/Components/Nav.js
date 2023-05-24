import { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native'

export const Nav = ({ onSwitch }) => {
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardIsVisible(true)
    })
    Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardIsVisible(false)
    })
  }, [])

  return (
    <>
      {!keyboardIsVisible && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.navIconContainer}
            onPress={() => onSwitch('home')}
          >
            <Image
              style={styles.navIcon}
              source={require('../../assets/cart.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIconContainer}
            onPress={() => onSwitch('productlistpage')}
          >
            <Image
              style={styles.navIcon}
              source={require('../../assets/product.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIconContainer}
            onPress={() => onSwitch('transactionhistorypage')}
          >
            <Image
              style={styles.navIcon}
              source={require('../../assets/history.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIconContainer}
            onPress={() => onSwitch('billbookpage')}
          >
            <Image
              style={styles.navIcon}
              source={require('../../assets/bill.png')}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navIconContainer: {
    justifyContent: 'flex-end',
  },
  navIcon: {
    height: 40,
    width: 40,
  },
  navIconMain: {
    height: 50,
    width: 50,
  },
})
