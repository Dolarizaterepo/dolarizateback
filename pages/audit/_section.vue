<template>
  <div>
    <div class="text-h4 title mb-4">Registro de auditoría</div>
    <custom-table
      source="audit/audit"
      :filter="'`main`.`modiftable` = \'' + $route.params.section + '\''"
      :noactions="true"
      :noAdd="true"
      @changes="showMore"
      :joins="[
                {
                  field: ['name', 'lastname'],
                  alias: ['username', 'userlastname'],
                  table: 'users',
                  on: ['id', 'user']
                }
              ]"
      :fieldset = "[
            { label: 'Fecha', field: 'created', type: 'datetime'},
            { label: 'Acción', field: 'action', searchable: '`main`.`action`'},
            { label: 'Usuario', field: 'username', mask: '{username} {userlastname}', searchable: '(SELECT CONCAT(`users`.`name`, \' \', `users`.`lastname`))'},
            { label: 'Cambios', field: 'changes', type: 'button', eventName: 'changes', buttonLabel: 'Ver detalle', buttonColor: 'info'},
          ]"
    />
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Registro de cambios
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <b>Acción: </b> {{ action }}
            </v-col>
            <v-col>
              <b>Usuario: </b> {{ user }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-if="action === 'update'">
          <v-row
            v-for="(record, field, index) in changes"
            :key="index"
            class="elevation-4 mb-4 pa-2"
          >
            <v-col cols="12">
              <b>Campo modificado: </b> {{ field }}
            </v-col>
            <v-col cols="12" class="error white--text">
              <b>Valor anterior: </b> {{ record.pre }}
            </v-col>
            <v-col cols="12" class="success white--text">
              <b>Valor nuevo: </b> {{ record.post }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-if="action === 'insert'">
          <v-row>
            <v-col>
              <b>Campos agregados:</b>
            </v-col>
          </v-row>
          <v-row
            v-for="(record, field, index) in changes.insertedData"
            :key="index"
             class="success white--text"
          >
            <v-col><b>{{ field }}</b></v-col>
            <v-col>{{ record }}</v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-if="action === 'delete'">
          <v-row>
            <v-col>
              <b>Campos eliminados:</b>
            </v-col>
          </v-row>
          <v-row
            v-for="(record, field, index) in changes.deletedData"
            :key="index"
             class="error white--text"
          >
            <v-col><b>{{ field }}</b></v-col>
            <v-col>{{ record }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialog: false,
      action: null,
      user: null,
      changes: {}
    }
  },
  mounted () {
    this.$nuxt.$emit('changelayout', { noNav: true })
  },
  methods: {
    showMore (data) {
      this.action = data.action
      this.user = data.username
      this.changes = JSON.parse(data.changes)
      this.dialog = true
    }
  }
}
</script>
