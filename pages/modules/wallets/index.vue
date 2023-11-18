<template>
  <div>
    <div class="text-h4 title">Balances</div>
    <div v-if="loading" class="text-center pt-8">
      <v-progress-circular
        :size="70"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-row v-else>
      <v-col>
        <v-card>
          <v-card-title>Cuentas BIND</v-card-title>
          <v-card-text>
            <v-list two-line>
              <template v-for="account in balanceData.bind">
                <v-list-item :key="account.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{account.id}}
                      <span v-if="account.id === balanceData.mainAccount" class="error--text"><br/>Recaudadora</span>
                    </v-list-item-title>

                    <v-list-item-subtitle class="text--primary">
                      {{account.type}}
                    </v-list-item-subtitle>

                  </v-list-item-content>
                    <h4>$ {{account.balance.amount}}</h4>
                  <v-list-item-action>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Billeteras</v-card-title>
          <v-card-text>
            <div>
              <b>ARS:</b> $ {{parseFloat(balanceData.wallets.ars).toFixed(2)}} <br/>
              <b>USD:</b> $ {{parseFloat(balanceData.wallets.usd).toFixed(2)}}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { menu } from './definitions'

export default {
  name: 'WalletsHome',
  data () {
    return {
      balanceData: null,
      loading: true
    }
  },
  mounted () {
    this.$nuxt.$emit('changelayout', { moduleNav: menu })
    this.$store.dispatch('resetNav')
    this.$store.dispatch('addToNav', { text: 'Balances', to: '/modules/wallets', exact: true, icon: 'mdi-wallet' })
    this.getBalanceData()
  },
  methods: {
    async getBalanceData () {
      this.loading = true
      await this.$axios
        .$post(
          'exchange/wallet/getReport',
          {},
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then((evtResponse) => {
          console.log(evtResponse)
          this.balanceData = evtResponse
          this.loading = false
        })
    }
  }
}
</script>
