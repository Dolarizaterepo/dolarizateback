<template>
  <div>
    <!-- TODO CAMBIAR

    <div class="text-h4 title mb-4">Roles</div>
    <custom-table
      source="users/roles"
      audit="/audit/roles"
      ref="table"
      @add="displayForm('add', null)"
      @edit="displayForm('edit', $event)"
      :subqueries="[
            {
              field: 'rol',
              table: 'users',
              alias: 'users'
            }
          ]"
      :fieldset = "[
        { label: 'ID', field: 'id'},
        { label: 'Nombre', field: 'name', searchable: 'name'},
        { label: 'Usuarios', field: 'users'},
        { label: 'Actualizado', field: 'updated'}
      ]"
    />
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{dialogTitle}}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Nombre"
            required
            v-model="dialogValue"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="saveData()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        v-model="addSnack"
        :timeout="1000"
        color="success"
        >
        Cambios guardados

        <template v-slot:action="{ attrs }">
            <v-btn
            color="white"
            icon
            v-bind="attrs"
            @click="addSnack = false"
            >
            &times;
            </v-btn>
        </template>
    </v-snackbar>
    -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialog: false,
      dialogTitle: null,
      dialogValue: null,
      dialogId: null,
      addSnack: false
    }
  },
  methods: {
    displayForm (type, item) {
      if (type === 'add') {
        this.dialogTitle = 'Agregar rol'
        this.dialogValue = null
        this.dialogId = null
      } else {
        this.dialogTitle = 'Editar rol'
        this.dialogValue = item.name
        this.dialogId = item.id
      }
      this.dialog = true
    },
    saveData () {
      this.$axios
        .$post('users/roles/save',
          JSON.stringify({ name: this.dialogValue, id: this.dialogId }),
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'application/json'
            }
          })
        .then((evtResponse) => {
          this.dialog = false
          this.$refs.table.getDataFromApi()
          this.addSnack = true
        })
    }
  }
}
</script>
