export default (context, inject) => {
  const formatDate = (dateValue) => {
    let dateParam = null
    if (!dateValue.includes(':')) {
      dateParam = new Date(dateValue + ' 00:00:00')
    } else {
      dateParam = new Date(dateValue)
    }
    let day = dateParam.getDate()
    let month = dateParam.getMonth() + 1
    const year = dateParam.getFullYear()
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }
    return day + '-' + month + '-' + String(year).substr(-2, 2)
  }
  const formatCurrency = (currencyValue) => {
    console.log(currencyValue)
    const decimal = currencyValue - Math.floor(currencyValue)
    const result = []
    const source = String(Math.floor(currencyValue)).split('')
    while (source.length) {
      result.push(source.splice(-3, 3).join(''))
    }
    if (decimal > 0) {
      return result.reverse().join(' ') + ' <sup>' + Math.round(decimal * 100) + '</sup>'
    } else {
      return result.reverse().join(' ')
    }
  }
  inject('formatDate', formatDate)
  inject('formatCurrency', formatCurrency)
}
