import { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import * as Print from 'expo-print'
import { WebView } from 'react-native-webview'
import { Button } from '../Components/Button'

export const ReportPrintPage = ({
  handle,
  transactions,
  startDate,
  endDate,
}) => {
  const [htmlProductList, setHtmlProductList] = useState('')
  const [totalTransaction, setTotalTransaction] = useState(0)
  const [totalCountProduct, setTotalCountProduct] = useState(0)
  const formattedStartDate = new Date(startDate).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedEndDate = new Date(endDate).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const nowDate = new Date().toLocaleString('id-ID', {
    weekday: 'long',
    hour12: false,
  })
  useEffect(() => {
    let tempTotalTransaction = 0
    let tempTotalCountProduct = 0
    let report = {}
    transactions.forEach((transaction) => {
      tempTotalTransaction += transaction.total
      transaction.products.forEach((product) => {
        report[product.barcode] = {
          barcode: product.barcode,
          name: product.name,
          price: product.price,
          count: report[product.barcode]
            ? report[product.barcode].count + product.count
            : product.count,
        }
        tempTotalCountProduct += product.count
      })
    })
    let tempProductList = ''
    for (const key in report) {
      tempProductList += `
        <tr>
          <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
            report[key].barcode
          }</td>
          <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
            report[key].name
          }</td>
          <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
            report[key].price
          }</td>
          <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
            report[key].count
          }</td>
          <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">${
            report[key].price * report[key].count
          }</td>
        </tr>
      `
    }
    setHtmlProductList(tempProductList)
    setTotalTransaction(tempTotalTransaction)
    setTotalCountProduct(tempTotalCountProduct)
  }, [])
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=2.0, minimum-scale=0.5" />
    </head>
    <body>
      <header>
        <h1 style="text-align: center;">Laporan Penjualan Toko Farhan</h1>
        <h2 style="text-align: center;">${formattedStartDate} - ${formattedEndDate}</h2>
        <table style="text-align: left; font-size: 20px; margin-top: 48px">
          <tr>
            <th>Total Transaksi</th>
            <th>: Rp${totalTransaction}</th>
          </tr>
        </table>
      </header>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">ID Produk</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Nama Produk</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Harga Satuan</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Jumlah Terjual</th>
            <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Total Terjual</th>
          </tr>
        </thead>
        <tbody>
          ${htmlProductList}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="2"></th>
            <th style="padding: 8px; text-align: left;">Total</th>
            <th style="padding: 8px; text-align: left;">${totalCountProduct}</th>
            <th style="padding: 8px; text-align: left;">Rp${
              totalTransaction
            }</th>
          </tr>
        </tfoot>
      </table>
      <div style="position: fixed; bottom: -15;">
        <p>Dibuat pada: ${nowDate}</p>
      </div>
    </body>
  </html>
  `

  const print = async () => {
    await Print.printAsync({
      html,
    })
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={() => handle({})}>{'<'}</Button>
            <Text style={styles.titleText}>Cetak Laporan</Text>
          </View>
          <Button onPress={print}>Print</Button>
        </View>
      </View>
      <WebView
        style={styles.webViewContainer}
        originWhitelist={['*']}
        source={{ html: html }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  webViewContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
})
