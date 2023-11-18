<template>
  <div class="py-1 px-3">
    <v-form ref="form">
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
        <v-col cols="2">
          <v-switch
            v-model="localdata.defaultrol"
            label="Predeterminado"
          ></v-switch>
        </v-col>
      </v-row>
      <div class="text-h5 my-4">Permisos</div>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(record, index) in localPermissions"
          :key="index"
        >
          <v-expansion-panel-header>
              <b>{{ record.name }} </b>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col
                v-for="(permission, pindex) in record.matrix"
                :key="index + '-' + pindex"
              >
                <v-switch
                  v-model="localdata.permissions[record.entity][pindex]"
                  :label="permission.name"
                  v-if="permission.type == 'bool'"
                ></v-switch>
                <v-autocomplete
                  v-model="localdata.permissions[record.entity][pindex]"
                  :label="permission.name"
                  :items="permission.values"
                  v-else-if="permission.type == 'enum'"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
  </div>
</template>
<script>
import { permissions } from '../../configuration/definitions'

export default {
  props: ['initdata'],
  data () {
    return {
      localdata: {},
      localPermissions: []
    }
  },
  mounted () {
    this.$emit('update:returnPath', '/lists/configuration/roles')
    this.$emit('update:title', 'Rol')
    this.$emit('update:sourcepath', 'users/roles')
    this.$emit('update:configForm', true)
    console.log(permissions)
    this.localPermissions = permissions
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
      if (this.localdata.defaultrol) {
        this.localdata.defaultrol = parseInt(this.localdata.defaultrol)
      }
      this.localdata.permissions = {}
      let initPermissions = {}
      if (this.initdata.permissions && this.initdata.permissions.constructor !== Array) {
        initPermissions = Object.assign({}, this.initdata.permissions)
      }
      this.localPermissions.forEach((entity) => {
        this.$set(this.localdata.permissions, entity.entity, [])
        entity.matrix.forEach((matrixitem, index) => {
          if (matrixitem.type === 'bool') {
            if (
              initPermissions[entity.entity] &&
              initPermissions[entity.entity][index] &&
              initPermissions[entity.entity][index] === '1'
            ) {
              this.localdata.permissions[entity.entity][index] = true
            } else {
              this.localdata.permissions[entity.entity][index] = false
            }
          } else if (initPermissions[entity.entity] && initPermissions[entity.entity][index]) {
            this.localdata.permissions[entity.entity][index] = parseInt(initPermissions[entity.entity][index])
          } else {
            this.localdata.permissions[entity.entity][index] = 0
          }
        })
      })
    },
    afterSave (evtResponse) {
      if (this.$store.state.authUser.rol === this.localdata.id) {
        this.$store.dispatch('getUserInfo', this.localdata.id)
      }
      return true
    }
  }
}
</script>
