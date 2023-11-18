<template>
  <div>
    <div class="text-h4 title">Tareas</div>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-card-title>Tareas pendientes</v-card-title>
          <v-list class="transparent">
            <v-list-item two-line>
              <div class="statusbar warning"></div>
              <v-list-item-content :class="taskCheck[0] ? 'text-decoration-line-through': ''">
                <v-list-item-title>Tarea de prueba 1</v-list-item-title>
                <v-list-item-subtitle>Vencimiento: 27-06-2022</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox v-model="taskCheck[0]"></v-checkbox>
              </v-list-item-action>
            </v-list-item>
            <v-list-item two-line>
              <div class="statusbar error"></div>
              <v-list-item-content :class="taskCheck[1] ? 'text-decoration-line-through': ''">
                <v-list-item-title>Tarea de prueba 2</v-list-item-title>
                <v-list-item-subtitle>Vencimiento: 18-06-2022</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox v-model="taskCheck[1]"></v-checkbox>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>Info de muestra</v-card-title>
          <GChart
            type="Timeline"
            :data="chartDataTimeline"
            :options="chartOptionsTimeline"
            :settings="{ packages: ['timeline'] }"
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
  name: 'TasksHome',
  components: {
    GChart
  },
  data () {
    return {
      chartDataTimeline: [
        [
          { type: 'string', id: 'Task' },
          { type: 'string', id: 'Status' },
          { type: 'date', id: 'Start' },
          { type: 'date', id: 'End' }
        ],
        ...[
          ['Tarea de prueba 1', 'En curso', new Date(2022, 6, 20), new Date(2022, 6, 27)],
          ['Tarea de prueba 2', 'Vencida', new Date(2022, 6, 15), new Date(2022, 6, 18)],
          ['Tarea de prueba 3', 'Completada', new Date(2022, 6, 4), new Date(2022, 6, 15)]
        ]
      ],
      chartOptionsTimeline: {
        colors: ['#FFC107', '#F44336', '#1B5E20']
      },
      taskCheck: [
        false,
        false
      ]
    }
  },
  mounted () {
    this.$nuxt.$emit('changelayout', { moduleNav: menu })
    this.$store.dispatch('resetNav')
    this.$store.dispatch('addToNav', { text: 'Tareas', to: '/modules/tasks', exact: true, icon: 'mdi-list-status' })
  }
}
</script>
