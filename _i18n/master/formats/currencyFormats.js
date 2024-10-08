//Watch documentation of params to format currency "JS" here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
//Watch currency types here: https://www.techonthenet.com/js/currency_codes.php

export default {
  'en-us': {
    currency: {
      style: 'currency',
      currency: 'USD'
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  },
  'es': {
    currency: {
      style: 'currency',
      currency: 'COP' //To show symbol "$". COP show as symbol "COP"
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    },
    decimal: {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  }
}
