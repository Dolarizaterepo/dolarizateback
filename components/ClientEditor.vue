<template>
    <div class="py-1 px-3">
        <v-form ref="form">
          <v-row class="align-center">
            <v-col>
              <CustomRemoteSelect
                ref="companySel"
                source = 'crm/enterprises'
                label="Empresa"
                v-model="localdata.enterprise"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn @click="newCompany = null; dialog = true">Crear</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <CustomText
                label="Nombre"
                v-model="localdata.name"
                required
              ></CustomText>
            </v-col>
            <v-col>
              <CustomText
                label="Apellido"
                v-model="localdata.lastname"
                required
              ></CustomText>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <CustomText
                label="N° Documento"
                v-model="localdata.document"
                required
              ></CustomText>
            </v-col>
            <v-col>
              <custom-date-picker
                label="Fecha de nacimiento"
                v-model="localdata.bday"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                label="Estado civil"
                v-model="localdata.mstatus"
                :items="[
                  { value: 1, text: 'Soltero/a' },
                  { value: 2, text: 'Casado/a' },
                  { value: 3, text: 'Divorciado/a' },
                  { value: 4, text: 'Viudo/a' }
                ]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Email"
                v-model="localdata.mail"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Télefono"
                v-model="localdata.phone1"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Celular"
                v-model="localdata.phone2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Alerta"
                v-model="localdata.alert"
                persistent-hint
                hint="Si se define, este mensaje aparecerá destacado cada vez que se seleccione al cliente."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Dirección
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-text-field
                label="Calle"
                v-model="localdata.address.street"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Número"
                v-model="localdata.address.number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Piso"
                v-model="localdata.address.floor"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Dpto"
                v-model="localdata.address.department"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Torre"
                v-model="localdata.address.tower"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Bloque"
                v-model="localdata.address.block"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <CustomRemoteSelect
                source = 'crm/provinces'
                label="Provincia"
                v-model="localdata.address.province"
                @input="localdata.address.city = null"
              />
            </v-col>
            <v-col>
              <CustomRemoteSelect
                source = 'crm/localities'
                label="Localidad"
                v-model="localdata.address.city"
                :queryFilter="localdata.address.province? 'province_id = ' + localdata.address.province : 'province_id = 0'"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Cod. Postal"
                v-model="localdata.address.postcode"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-dialog
          v-model="dialog"
          max-width="550"
        >
          <v-card>
            <v-card-title class="text-h5">
              Crear nueva empresa
            </v-card-title>

            <v-card-text>
              <v-text-field
                label="Nombre"
                v-model="newCompany"
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
                @click="addCompany"
              >
                Crear
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="showAlert"
          max-width="290"
        >
          <v-card>
            <v-card-title class="justify-center">
              {{ localdata.alert }}
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="green darken-1"
                text
                @click="showAlert = false"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
  props: ['initdata', 'buttons'],
  data () {
    return {
      localdata: {
        address: {
          street: null,
          number: null,
          floor: null,
          department: null,
          tower: null,
          block: null,
          province: null,
          city: null,
          postcode: null
        }
      },
      newCompany: null,
      dialog: false,
      showAlert: false
    }
  },
  mounted () {
    this.assignLocalData()
  },
  watch: {
    initdata: {
      deep: true,
      handler () {
        this.assignLocalData()
      }
    }
  },
  methods: {
    assignLocalData () {
      console.log(this.initdata)
      this.localdata = Object.assign({}, this.localdata, this.initdata)
      if (this.initdata.address) {
        this.localdata.address = Object.assign({}, this.initdata.address)
        if (this.initdata.address.city) {
          setTimeout(() => {
            this.localdata.address.city = this.initdata.address.city
          }, 1000)
        }
      }
      if (this.localdata.alert && this.localdata.alert.trim() !== '') {
        this.showAlert = true
      }
    },
    async addCompany () {
      if (this.newCompany !== null && this.newCompany !== '') {
        await this.$axios
          .$post(
            'crm/enterprises/save',
            {
              name: this.newCompany
            },
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
            this.$refs.companySel.update()
            this.localdata.enterprise = evtResponse.data
            this.dialog = false
          })
      }
    }
  }
}
</script>
