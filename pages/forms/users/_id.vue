<template>
  <div class="py-1 px-3">
    <v-form ref="form">
        <v-row>
            <v-col cols="2">
                <custom-img-upload :imagen="localdata.image" @input="localdata.image = $event.fileBase64" />
            </v-col>
            <v-col>
                <v-row v-if="$store.state.authUser.sa === '1'">
                    <v-col class="d-flex justify-end">
                        <v-switch
                        v-model="localdata.sa"
                        label="Administrador"
                        class="mr-2"
                        ></v-switch>
                        <v-switch
                        v-model="localdata.active"
                        label="Activo"
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <custom-text
                      v-model="localdata.usr"
                      label="Email"
                      type="email"
                      required
                      :max="255"
                      :readonly="localdata.id !== undefined"
                    />
                  </v-col>
                  <v-col class="d-flex align-center">
                    <v-btn color="amber" block v-if="!displayPassword" @click="hidepassword = false">Cambiar contraseña</v-btn>
                    <custom-text
                      v-if="displayPassword"
                      v-model="localdata.password"
                      label="Contraseña"
                      type="password"
                      required
                      :max="255"
                      :min="8"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <custom-text
                      v-model="localdata.name"
                      label="Nombre"
                      type="text"
                      required
                      :max="255"
                    />
                  </v-col>
                  <v-col>
                    <custom-text
                      v-model="localdata.lastname"
                      label="Apellido"
                      type="text"
                      :max="255"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <custom-remote-select
                      source="users/roles"
                      label="Rol"
                      v-model="localdata.rol
                    "/>
                  </v-col>
                  <v-col></v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-form>
  </div>
</template>
<script>
export default {
  props: ['initdata'],
  data () {
    return {
      localdata: {},
      hidepassword: true
    }
  },
  mounted () {
    if (this.$store.state.authUser.sa === '1') {
      this.$emit('update:returnPath', '/lists/configuration/users')
    } else {
      this.$emit('update:returnPath', '/')
    }
    this.$emit('update:title', 'Usuario')
    this.$emit('update:sourcepath', 'users/users')
    this.$emit('update:configForm', true)
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
  computed: {
    displayPassword () {
      if (this.localdata.id) {
        return !this.hidepassword
      } else {
        return true
      }
    }
  },
  methods: {
    assignLocalData () {
      console.log(this.initdata)
      this.localdata = Object.assign({}, this.localdata, this.initdata)
      if (this.localdata.active) {
        this.localdata.active = parseInt(this.localdata.active)
      }
      if (this.localdata.sa) {
        this.localdata.sa = parseInt(this.localdata.sa)
      }
      if (this.$route.params.id === 'new') {
        this.localdata.image = 'data:image/png;base64,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'
      }
    },
    afterSave (evtResponse) {
      if (this.$store.state.authUser.id === this.localdata.id) {
        this.$store.dispatch('getUserInfo', this.localdata.id)
      }
      return true
    }
  }
}
</script>
