import { StyleSheet, Text, View, Modal } from 'react-native'
import { Button } from './Button'

export const ConfirmModal = ({
  visible,
  title,
  body,
  yesText,
  yesHandler,
  noText,
  noHandler,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.container}>
          <View>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.bodyText}>{body}</Text>
            <View style={styles.buttonContainer}>
              <Button style={styles.confirmationAButton} onPress={yesHandler}>
                {yesText}
              </Button>
              <Button style={styles.confirmationBButton} onPress={noHandler}>
                {noText}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  titleText: {
    fontWeight: 'bold',
  },
  bodyText: {
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  confirmationAButton: {
    flexBasis: '50%',
    marginHorizontal: 5,
  },
  confirmationBButton: {
    flexBasis: '50%',
    marginHorizontal: 5,
    backgroundColor: '#FF0000',
  },
})
