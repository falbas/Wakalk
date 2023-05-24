import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { forwardRef } from 'react'

export const CustomTextInput = forwardRef((props, ref) => {
  const {
    title,
    style,
    keyboardType,
    value,
    onPressIn,
    onChangeText,
    placeholder,
    autoFocus,
    showSoftInputOnFocus,
    buttonHandler,
    iconUri = 'https://reactnative.dev/img/tiny_logo.png',
  } = props
  return (
    <View style={style}>
      {title && <Text style={styles.labelTextInput}>{title}</Text>}
      <TextInput
        style={styles.textInput}
        keyboardType={keyboardType}
        value={value}
        onPressIn={onPressIn}
        onChangeText={onChangeText}
        placeholder={placeholder}
        ref={ref}
        autoFocus={autoFocus}
        showSoftInputOnFocus={showSoftInputOnFocus}
      />
      {buttonHandler && (
        <View style={styles.iconScanContainer}>
          <TouchableOpacity
            style={styles.iconScanButton}
            onPress={buttonHandler}
          >
            <Image style={styles.iconScan} source={{ uri: iconUri }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  labelTextInput: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#B4B4B4',
  },
  iconScanContainer: {
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  iconScanButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  iconScan: {
    height: 30,
    width: 30,
  },
})
