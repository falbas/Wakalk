import { StyleSheet, TouchableOpacity, Text } from 'react-native'

export const Button = ({ children, style, textStyle, onPress, disabled }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#45A6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
