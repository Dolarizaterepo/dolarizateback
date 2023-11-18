<template>
  <v-row style="background: linear-gradient(45deg, rgba(255,255,255,0.5), transparent), url('images/franklin gaucho-fondo-color.png');background-size: contain;background-position: center center;">
    <v-col class="d-none d-md-block white" cols="4">
      <div class="d-flex flex-column align-center justify-space-between" style="height: calc(100vh - 24px);">
        <div class="d-flex align-center justify-center mt-8" style="max-width: 100%; font-size: 2.5rem;">
          <v-img src="images/logo-dolarizate.svg" contain style="height: 5rem;" />
        </div>
        <v-img src="images/undraw_Coding_re_iv62.svg" contain style="max-height: 50%;" />
      </div>
    </v-col>
    <v-col class="col-12 col-md-8">
      <div class="d-flex align-center justify-center" style="height: calc(100vh - 24px);">
          <v-card class="text-center" style="min-width:50%;">
              <div style="margin: -40px 0px -50px;">
                <div class="d-inline-block elevation-3 rounded-circle py-2 px-4 white" style="overflow: hidden; width: 120px; height: 120px;">
                  <img
                      src="images/icono-dolarizate.svg"
                      style="width: 100px;"
                  />
                </div>
              </div>
              <v-card-title class="text-h2 justify-center mt-8">Bienvenido</v-card-title>
              <v-card-subtitle>Ingrese sus credenciales</v-card-subtitle>
              <v-card-text class="my-8">
                  <v-alert
                  border="left"
                  color="orange"
                  type="warning"
                  v-if="error !== ''"
                  >
                  {{ error }}
                  </v-alert>
                  <v-form ref="form">
                      <v-text-field
                          v-model="email"
                          :rules="[rules.required, rules.email]"
                          label="E-mail"
                          type="mail"
                          outlined
                          @keyup.enter="login"
                      ></v-text-field>
                      <v-text-field
                          v-model="password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show1 ? 'text' : 'password'"
                          label="Password"
                          hint="Mínimo 8 caracteres"
                          counter
                          @click:append="show1 = !show1"
                          outlined
                          @keyup.enter="login"
                      ></v-text-field>
                      <v-btn block color="primary" @click="login()">
                          Ingresar
                      </v-btn>
                  </v-form>
              </v-card-text>
          </v-card>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'public',
  data () {
    return {
      email: '',
      password: '',
      error: '',
      show1: false,
      rules: {
        required: value => !!value || 'Requerido.',
        min: value => value.length >= 8 || 'Mínimo 8 caracteres',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail inválido.'
        }
      }
    }
  },
  methods: {
    async login () {
      if (this.$refs.form.validate()) {
        try {
          await this.$store
            .dispatch('login', {
              username: this.email,
              password: this.password
            })
            .then(() => {
              if (localStorage.lastpath) {
                this.$router.push({ path: localStorage.lastpath })
              } else {
                this.$router.push({ path: '/' })
              }
            })
        } catch (e) {
          this.error = e.message
        }
      }
    }
  }
}
</script>
