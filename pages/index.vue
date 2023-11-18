<template>
  <div>
    <div class="text-h4 title">Tablero de control</div>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Nuevos usuarios - <small>Info de muestra</small></v-card-title>
          <GChart
            type="LineChart"
            :data="chartData"
            :options="chartOptions"
          />
        </v-card>
      </v-col>
    </v-row>
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

export default {
  name: 'IndexPage',
  components: {
    GChart
  },
  data () {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [
        ['Mes', 'Usuarios'],
        ['Jul-22', 100],
        ['Jun-22', 200],
        ['May-22', 300],
        ['Abr-22', 200]
      ],
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
    this.$nuxt.$emit('changelayout', { noNav: true })
    this.$store.dispatch('resetNav')
    this.$store.dispatch('addToNav', { text: 'Tablero de control', to: '/', exact: true, icon: 'mdi-chart-bar' })
  }
}
</script>
