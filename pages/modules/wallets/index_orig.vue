<template>
  <div>
    <div class="text-h4 title">Balances</div>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Movimientos ARS - <small>Info de muestra</small></v-card-title>
          <GChart
            type="BarChart"
            :data="chartDatabarARS"
            :options="chartOptions"
          />
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Movimientos USD - <small>Info de muestra</small></v-card-title>
          <GChart
            type="ColumnChart"
            :data="chartDatabarUSD"
            :options="chartOptions"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { GChart } from 'vue-google-charts/legacy'
import { menu } from './definitions'

export default {
  name: 'WalletsHome',
  components: {
    GChart
  },
  data () {
    return {
      chartOptions: {},
      chartDatabarARS: [
        ['Mes', 'IN', 'OUT'],
        ['Jul-22', 100, 200],
        ['Jun-22', 200, 100],
        ['May-22', 300, 100],
        ['Abr-22', 200, 300]
      ],
      chartDatabarUSD: [
        ['Mes', 'IN', 'OUT'],
        ['Jul-22', 100, 200],
        ['Jun-22', 200, 100],
        ['May-22', 300, 100],
        ['Abr-22', 200, 300]
      ]
    }
  },
  mounted () {
    this.$nuxt.$emit('changelayout', { moduleNav: menu })
    this.$store.dispatch('resetNav')
    this.$store.dispatch('addToNav', { text: 'Balances', to: '/modules/wallets', exact: true, icon: 'mdi-wallet' })
  }
}
</script>
