export const menu = [
  {
    icon: 'mdi-wallet',
    title: 'Balances',
    to: '/modules/wallets'
  },
  {
    icon: 'mdi-account-cash',
    title: 'Billeteras',
    to: '/lists/userbalance',
    breadcrum: [
      { text: 'Balances', to: '/modules/wallets', exact: true, icon: 'mdi-wallet' },
      { text: 'Billeteras', to: '/lists/userbalance', exact: true, icon: 'mdi-account-cash' }
    ]
  },
  {
    icon: 'mdi-credit-card-outline',
    title: 'Tarjetas',
    to: '/lists/ccard',
    breadcrum: [
      { text: 'Balances', to: '/modules/wallets', exact: true, icon: 'mdi-wallet' },
      { text: 'Tarjetas', to: '/lists/ccard', exact: true, icon: 'mdi-credit-card-outline' }
    ]
  }
]
