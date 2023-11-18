<template>
    <div class="py-1 px-3">
        <v-form ref="form">
          <v-row>
            <v-col>
              <v-text-field
                label="Nombre"
                v-model="localdata.name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                label="Descipción"
                v-model="localdata.description"
                height="210"
              ></v-textarea>
            </v-col>
            <v-col cols="auto">
              <custom-img-upload
                :size="{width: 360, height: 180}"
                :imagen="localdata.image"
                @input="image = $event" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <custom-date-picker
                label="Inicio"
                v-model="localdata.startdate"
              />
            </v-col>
            <v-col>
              <custom-date-picker
                label="Fin"
                v-model="localdata.enddate"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <CustomRemoteSelect
                source = 'users/users'
                label="Usuarios asignados"
                v-model="localdata.responsibles"
                :withImage="true"
                :multiple="true"
                display="{name} {lastname}"
              />
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
      image: null
    }
  },
  mounted () {
    this.$emit('update:returnPath', 'tasks')
    this.$emit('update:title', 'Tarea')
    this.$emit('update:sourcepath', 'tasks/tasks')
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
    },
    beforeSave () {
      if (!this.localdata.creator) {
        this.localdata.creator = '_ME'
      }
      this.localdata.relations = [
        {
          rtable: 'users',
          data: {
            task: '_id',
            user: this.localdata.responsibles
          }
        }
      ]
      return true
    },
    afterSave (evtResponse) {
      if (evtResponse.result === '1' && this.image !== null) {
        const formData = new FormData()

        formData.append('file', this.image.file)
        formData.append('name', this.image.fileName)
        formData.append('entityid', evtResponse.data)
        formData.append('entitytype', 'tasks')

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
          .then((uploadResponse) => {
            return true
          })
      }
      return true
    }
  }
}
</script>
