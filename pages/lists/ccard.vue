<template>
  <div>
    <div class="text-h4 title mb-4">Pagos de tarjeta</div>
    <v-sheet elevation="1" class="mb-6 pa-2">
      <div class="text-h6">Registrar pago</div>
      <v-form ref="form">
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Monto pagado"
              prefix="$"
              type="number"
              min="1"
              :rules="rules"
              v-model="ammount"
            />
          </v-col>
          <v-col cols="4">
            <v-file-input
              label="Comprobante"
              show-size
              :rules="rules"
              v-model="document"
            />
          </v-col>
          <v-col>
            <v-btn color="primary" @click="sendRecord">Guardar</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
    <custom-table
      source="exchange/ccard"
      audit="/audit/ccard"
      ref="table"
      :noAdd="true"
      :deleterules="false"
      :editrules="false"
      :customActions="[
        {action: 'document', icon: 'mdi-file-table-outline'},
      ]"
      @document="getDocument($event.id)"
      :joins="[
                {
                  field: ['name', 'lastname'],
                  alias: ['username', 'userlastname'],
                  table: 'users',
                  on: ['id', 'user']
                }
              ]"
      :fieldset = "[
            { label: 'Fecha de pago', field: 'updated' },
            { label: 'Monto', field: 'amount', type: 'currency' },
            { label: 'Usuario', field: 'user', mask: '{username} {userlastname}', searchable: '(SELECT CONCAT(`users`.`name`, \' \', `users`.`lastname`))', filter: { type: 'remote', table: 'users/users', withImage: true, display: '{name} {lastname}'}}
          ]"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      ammount: null,
      document: null,
      rules: [
        v => !!v || 'Valor requerido'
      ]
    }
  },
  mounted () {
    this.$emit('update:defFile', 'wallets')
  },
  methods: {
    async sendRecord () {
      if (!this.$refs.form.validate()) {
        return
      }
      await this.$axios
        .$post('exchange/ccard/save',
          {
            amount: this.ammount,
            user: '_ME',
            status: 1
          },
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
          this.$refs.table.getDataFromApi()
          if (evtResponse.result === '1') {
            this.addDocument(evtResponse.data)
          }
        })
    },
    addDocument (id) {
      const formData = new FormData()
      formData.append('file', this.document)
      formData.append('name', this.document.fileName)
      formData.append('entityid', id)
      formData.append('entitytype', 'ccard')

      this.$axios
        .$post(
          'documents/documents/save',
          formData,
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then((evtResponse) => {
          this.ammount = null
          this.document = null
        })
    },
    getDocument (documentId) {
      this.$axios
        .post(
          'documents/documents/getFilePath',
          JSON.stringify(
            {
              entityid: documentId,
              entitytype: 'ccard'
            }
          ),
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
          // const blobUrl = window.URL.createObjectURL(evtResponse.data)
          const $a = document.createElement('a')
          $a.href = this.$store.state.info.location + evtResponse.data.data
          document.body.append($a)
          $a.download = 'comprobante_operacion'
          $a.target = '_blank'
          $a.click()
          $a.remove()
        })
    }
  }
}
</script>
