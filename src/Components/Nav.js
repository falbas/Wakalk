import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'

export const Nav = () => {
  return (
    <View style={styles.container}>
      <View style={styles.navIconContainer}>
        <Image
          style={styles.navIcon}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
      </View>
      <View style={styles.navIconContainer}>
        <Image
          style={styles.navIcon}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
      </View>
      <View style={styles.navIconContainer}>
        <Image
          style={styles.navIcon}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
      </View>
      <View style={styles.navIconContainer}>
        <Image
          style={styles.navIconMain}
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
