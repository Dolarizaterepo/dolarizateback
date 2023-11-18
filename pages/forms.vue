<template>
    <div style="margin: -12px;">
        <v-sheet
          class="d-flex align-center px-3 mb-2 py-2"
          style="width: 100%; z-index: 200;"
        >
            <div>
              <v-btn
              icon
              @click="cancelForm()"
              >
                <v-icon class="text-h4">mdi-arrow-left-bold-circle-outline</v-icon>
              </v-btn>
            </div>
            <div class="text-h4 ml-4">{{ formTitle }}</div>
            <v-spacer></v-spacer>
            <!--
            <v-btn
                class="mr-2"
                :loading="loading"
                :disabled="loading"
                color="success"
                @click="save()"
                v-if="!hideButtons"
                >
                {{ textButtons.save }}
            </v-btn>
            <v-btn
                color="error"
                :to="fullReturnPath"
                :disabled="loading"
                v-if="!hideButtons"
            >
                {{ textButtons.cancel }}
            </v-btn>
            -->
        </v-sheet>
      <div style="padding: 12px;">
        <nuxt-child
          :returnPath.sync="returnPath"
          :title.sync="title"
          :sourcepath.sync="sourcepath"
          :initdata="initdata"
          :hideButtons.sync="hideButtons"
          :textButtons.sync="textButtons"
          :configForm.sync="configForm"
          :defFile.sync="defFile"
          ref="child-form"
        />
      </div>
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
    </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      returnPath: null,
      title: null,
      sourcepath: null,
      initdata: {},
      addSnack: false,
      hideButtons: false,
      textButtons: {
        save: 'Guardar',
        cancel: 'Cancelar'
      },
      configForm: false,
      defFile: null
    }
  },
  computed: {
    formTitle () {
      if (this.$route.params.id === 'new') {
        return 'Crear ' + this.title
      } else {
        return 'Editar ' + this.title
      }
    },
    fullReturnPath () {
      if (this.returnPath === null || this.returnPath.includes('/')) {
        return this.returnPath
      } else {
        return '/lists/' + this.returnPath
      }
    }
  },
  watch: {
    sourcepath () {
      this.loadData(false)
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === from.name) {
      this.$route.params.id = to.params.id
      this.loadData(true)
    }
    next()
  },
  mounted () {
    let routePath = ''
    if (this.defFile === null) {
      routePath = this.$route.name.split('-')[1]
    } else {
      routePath = this.defFile
    }
    let definitionPath = 'modules/' + routePath + '/definitions.js'
    if (this.configForm) {
      definitionPath = 'configuration/definitions.js'
    }
    import('./' + definitionPath)
      .then((module) => {
        this.menu = module.menu
        this.$nuxt.$emit('changelayout', { moduleNav: this.menu, showSaveBtn: true })
      })
    this.$nuxt.$off('saveform')
    this.$nuxt.$on('saveform', () => {
      this.save()
    })
  },
  methods: {
    cancelForm () {
      const currentNav = this.$store.state.nav.slice(1, -1)
      this.$store.dispatch('resetNav')
      this.$store.dispatch('addToNav', currentNav)
      this.$router.push(this.fullReturnPath)
    },
    loadData (removePath) {
      console.log(this.$route.params.id)
      if (removePath) {
        this.$store.dispatch('removeLastFromNav')
      }
      if (this.sourcepath !== null && this.$route.params.id !== 'new') {
        this.$axios
          .$get(this.sourcepath + '/getOne?id=' + this.$route.params.id, {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'application/json'
            }
          })
          .then((evtResponse) => {
            console.log(evtResponse)
            this.initdata = evtResponse.records[0]
            if (this.$store.state.nav[this.$store.state.nav.length - 1].to !== this.$route.path) {
              this.$store.dispatch('addToNav', { text: this.initdata.name, to: this.$route.path, exact: true, icon: 'mdi-note-edit-outline' })
            }
          })
      } else if (this.$store.state.nav[this.$store.state.nav.length - 1].to !== this.$route.path) {
        this.$store.dispatch('addToNav', { text: this.formTitle, to: this.$route.path, exact: true, icon: 'mdi-note-edit-outline' })
      }
      if (this.$route.params.id === 'new' && this.$route.query) {
        this.initdata = Object.assign({}, this.initdata, this.$route.query)
      }
    },
    save () {
      if (this.$refs['child-form'].$refs.form.validate() && this.sourcepath !== null) {
        if (typeof this.$refs['child-form'].beforeSave === 'function') {
          if (!this.$refs['child-form'].beforeSave()) {
            return false
          }
        }
        this.loading = true
        console.log(JSON.stringify(this.$refs['child-form'].localdata))
        this.$axios
          .$post(this.sourcepath + '/save',
            JSON.stringify(this.$refs['child-form'].localdata),
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
            if (typeof this.$refs['child-form'].afterSave === 'function') {
              if (!this.$refs['child-form'].afterSave(evtResponse)) {
                return false
              }
            }
            if (this.$route.params.id === 'new') {
              this.addSnack = true
              const pathParts = this.$route.path.split('/')
              this.$router.push('/forms/' + pathParts[2] + '/' + evtResponse.data)
              // this.$router.push('/forms/' + pathParts[2] + '/' + evtResponse.data, this.$router.go())
            } else {
              this.loading = false
              this.addSnack = true
            }
          })
      }
    }
  }
}
</script>
