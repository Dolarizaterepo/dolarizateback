<template>
    <div>
        <v-sheet elevation="2" class="mt-3 px-5">
          <v-row class="align-end mb-3">
              <v-col cols="6" md="4" class="d-flex">
                  <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Buscar"
                      single-line
                      hide-details
                      outlined
                      dense
                      @blur="getDataFromApi()"
                      @keyup.enter="getDataFromApi()"
                  ></v-text-field>
                  <v-btn
                    icon
                    @click="filterDrawer = !filterDrawer"
                    v-if="filters.length > 0"
                    :color="appyFilters ? 'primary': ''"
                  >
                    <v-icon>mdi-filter</v-icon>
                  </v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="4" class="text-right">
                <v-btn
                  color="primary"
                  @click="createNew()"
                  v-if="noAdd !== true"
                >
                Agregar
                </v-btn>
                <v-menu
                  bottom
                  left
                  offset-y
                  v-if="(tableActions && tableActions.length > 0) || noExport !== true"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item v-if="noExport !== true" @click="exportData()">
                      <v-list-item-title>Exportar a Excel</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="selected !== null && selected.length > 0" @click="deleteMasive()">
                      <v-list-item-title>Borrar selecionados</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="audit" :to="audit">
                      <v-list-item-title>Auditar</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-for="(item, i) in tableActions"
                      :key="i"
                      @click="$emit(item.action)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
          </v-row>
        </v-sheet>
        <v-alert
          color="primary"
          dense
          text
          type="info"
          v-if="appyFilters"
        >
          Resultados filtrados
        </v-alert>
        <v-data-table
        :headers="headers"
        :items="records"
        :options.sync="options"
        :server-items-length="totalrecords"
        :loading="loading"
        :search="filter"
        :sort-by="sortedByCalc.fields"
        :sort-desc="sortedByCalc.direction"
        :footer-props="{
          itemsPerPageText: 'Ítems por página'
        }"
        :show-select="showSelect"
        class="elevation-2"
        v-model="selected"
        @input="$emit('input', selected)"
        >
          <template v-slot:item = "{ item, index, isSelected, select }">
            <tr>
              <td v-if="showSelect === true">
                <v-simple-checkbox
                  :value="isSelected"
                  @input="select($event)"
                ></v-simple-checkbox>
              </td>
              <template v-for="(record, field, itemIndex) in item">
                <td :key="index + '-' + field" class="text-start" :style="field == '_actions' && (noactions == undefined || noactions == false)?'width: 7rem;':''" v-if="headers.some( (header) => header.value === field)">
                  <div v-if="field == '_actions' && (noactions == undefined || noactions == false)" class="text-right">
                      <template v-if="customActions">
                        <template v-for="(customAction, index) in customActions">
                          <v-icon
                            small
                            class="mr-2"
                            :key="index"
                            v-if="customAction.type === undefined"
                            @click="$emit(customAction.action, item)"
                          >
                              {{customAction.icon}}
                          </v-icon>
                        </template>
                      </template>
                      <v-icon
                          small
                          class="mr-2"
                          @click="editItem(item)"
                          v-if="editValidation"
                      >
                          {{ editiconCalc }}
                      </v-icon>
                      <v-icon
                          small
                          @click="deleteItem(item)"
                          v-if="deleteValidation"
                      >
                          mdi-delete
                      </v-icon>
                      <template v-if="customActions">
                        <template v-for="(customAction, index) in customActions">
                          <v-icon
                            small
                            class="mr-2"
                            :key="index"
                            v-if="customAction.type === 'more'"
                            @click="displayMore(customAction.action, item)"
                            v-text="item.moreData.display ? customAction.iconCollapse: customAction.iconExpand"
                          />
                        </template>
                      </template>
                  </div>
                  <div class="d-flex" v-else-if="componentFields.main[field] && componentFields.main[field] === 'avatars'">
                    <v-tooltip
                      bottom
                      v-for="(pitem, pindex) in record"
                      :key="'dialogCellAvatars-' + pindex"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-avatar
                          color="grey darken-2"
                          size="32"
                          class="mx-1"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <img :src="pitem.image" />
                        </v-avatar>
                      </template>
                      <span>{{pitem.name}} {{pitem.lastname}}</span>
                    </v-tooltip>
                  </div>
                  <div class="d-flex" v-else-if="componentFields.main[field] && componentFields.main[field].substring(0,5) === 'more-'">
                    <span
                      class="d-inline-block text-truncate"
                      style="max-width: 300px;"
                    >
                      {{ record }}
                    </span>
                    <span class="ml-2" v-if="componentFields.main[field] === 'more-tooltip'">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            v-on="on"
                          ><a href="" @click.prevent>(ver más)</a></span>
                        </template>
                        <span>{{ record }}</span>
                      </v-tooltip>
                    </span>
                    <span class="ml-2" v-else-if="componentFields.main[field] === 'more-popup'">
                      <v-dialog
                        width="500"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                          >
                            Ver más
                          </v-btn>
                        </template>

                        <v-card class="pa-5">
                            {{ record }}
                        </v-card>
                      </v-dialog>
                    </span>
                    <span class="ml-2" v-else-if="componentFields.main[field] === 'more-event'">
                      <v-btn
                        color="primary"
                        dark
                        @click="processEvent(item, field)"
                      >
                        Ver más
                      </v-btn>
                    </span>
                  </div>
                  <div class="d-flex" v-else-if="componentFields.main[field] && componentFields.main[field] === 'button'">
                    <v-btn
                      :color="getComponentProperties(field).buttonColor ? getComponentProperties(field).buttonColor: 'primary'"
                      dark
                      @click="processEvent(item, field)"
                    >
                      {{ getComponentProperties(field).buttonLabel ? getComponentProperties(field).buttonLabel: 'Botón' }}
                    </v-btn>
                  </div>
                  <div class="d-flex" v-else>
                    <span v-html="record"></span>
                    <v-badge
                      v-if="
                        highlight !== undefined &&
                        itemIndex === 0 &&
                        highlight.includes(record)
                      "
                      dot
                      color="green"
                    ></v-badge>
                  </div>
                </td>
              </template>
            </tr>
            <tr v-if="item.moreData.display">
              <td :colspan="headers.length">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th
                          v-for="(morefield, moreIndex) in item.moreData.data.fieldset"
                          :key="'moreDataField-' + item.id + '-' + moreIndex"
                          class="text-left"
                        >
                          {{ morefield.label}}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="moreRecord in item.moreData.data.records"
                        :key="moreRecord.id"
                      >
                        <td
                          v-for="(moreDatafield, moreDataIndex) in item.moreData.data.fieldset"
                          :key="'moreData-' + moreRecord.id + '-' + moreDataIndex"
                          class="text-left"
                        >
                          {{ moreRecord[moreDatafield.field] }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-dialog v-model="deleteDialog" max-width="550">
          <v-card>
            <v-card-title v-if="typeof deleteIndex == 'string'" class="headline">¿Está seguro que quiere borrar este objeto?</v-card-title>
            <v-card-title v-else class="headline">¿Está seguro que quiere borrar estos objetos?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteDialog = false">NO</v-btn>
              <v-btn color="red darken-1" text @click="deleteItemConfirm">SÍ</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-snackbar
            v-model="deleteSnack"
            :timeout="1000"
            color="red darken-1"
            >
            Elemento borrado

            <template v-slot:action="{ attrs }">
                <v-btn
                color="white"
                icon
                v-bind="attrs"
                @click="deleteSnack = false"
                >
                &times;
                </v-btn>
            </template>
        </v-snackbar>
        <v-navigation-drawer
          v-model="filterDrawer"
          :right="true"
          temporary
          fixed
        >
          <template v-slot:prepend>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-filter</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  Filtrar resultados
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider></v-divider>
          <v-list two-line>
            <v-list-item
              v-for="(item, index) in filters"
              :key="'filter-' + index"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <custom-remote-select
                    v-if="item.type === 'remote'"
                    :source="item.table"
                    :withImage="item.withImage ? item.withImage : undefined"
                    :display="item.display ? item.display : undefined"
                    v-model="filters[index].value"
                  />
                  <custom-date-picker
                    v-if="item.type === 'date'"
                    v-model="filters[index].value"
                    :clearable="true"
                  />
                  <v-switch
                    v-model="filters[index].value"
                    v-if="item.type === 'bool'"
                  ></v-switch>
                  <v-btn
                    icon
                    v-if="item.type === 'bool' && filters[index].value !== null"
                    @click="filters[index].value = null"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-autocomplete
                    v-if="item.type === 'enum'"
                    :items="filters[index].list"
                    v-model="filters[index].value"
                    :clearable="true"
                  />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
    </div>
</template>
<script>
export default {
  props: [
    'fieldset',
    'source',
    'subqueries',
    'joins',
    'deletepath',
    'deleterules',
    'editrules',
    'form',
    'noAdd',
    'noactions',
    'noExport',
    'sortBy',
    'filter',
    'customActions',
    'tableActions',
    'editicon',
    'highlight',
    'showSelect',
    'audit'
  ],
  data () {
    return {
      totalrecords: 0,
      records: [],
      loading: true,
      search: '',
      options: {},
      headers: [],
      deleteIndex: null,
      deleteDialog: false,
      deleteSnack: false,
      selected: [],
      componentFields: {
        main: {}
      },
      filters: [],
      filterDrawer: false,
      appyFilters: false
    }
  },
  watch: {
    options: {
      handler () {
        this.getDataFromApi()
      },
      deep: true
    },
    filterDrawer (filterState) {
      if (!filterState) {
        this.getDataFromApi()
      }
    }
  },
  computed: {
    deleteValidation () {
      if (this.deleterules !== undefined) {
        return eval(this.deleterules)
      } else {
        return true
      }
    },
    editValidation () {
      if (this.editrules !== undefined) {
        return eval(this.editrules)
      } else {
        return true
      }
    },
    sortedByCalc () {
      if (this.sortBy) {
        const fields = []
        const direction = []
        const sortByKeys = Object.keys(this.sortBy)
        sortByKeys.forEach((element) => {
          fields.push(element)
          direction.push(this.sortBy[element])
        })
        return {
          fields,
          direction
        }
      } else {
        return {
          fields: [],
          direction: []
        }
      }
    },
    editiconCalc () {
      if (this.editicon) {
        return this.editicon
      } else {
        return 'mdi-pencil'
      }
    }
  },
  mounted () {
    this.headers = []
    if (this.fieldset) {
      this.fieldset.forEach((element) => {
        let headerValues = {}
        headerValues = {
          text: element.label,
          value: element.field
        }
        if (element.sortable) {
          headerValues.sortable = element.sortable
        }
        this.headers.push(headerValues)
        if (element.filter) {
          const filterData = Object.assign({ field: element.field, label: element.label, value: null }, element.filter)
          if (element.filter.type === 'enum') {
            filterData.list = element.list
          }
          this.filters.push(filterData)
        }
      })
      this.addHeaderActions()
    }
    if (this.$route.query && this.$route.query.search !== undefined) {
      this.search = this.$route.query.search
    }
    this.getDataFromApi()
  },
  methods: {
    prepareRequest () {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const ajaxParams = { page, r_page: itemsPerPage }
      if (sortBy.length > 0) {
        ajaxParams.order = []
        sortBy.forEach((element, index) => {
          if (sortDesc[index]) {
            ajaxParams.order.push([element, 'DESC'])
          } else {
            ajaxParams.order.push([element, 'ASC'])
          }
        })
      }
      if (this.search !== '') {
        const fieldArray = []
        if (this.fieldset) {
          this.fieldset.forEach((element) => {
            if (element.searchable !== false && element.searchable !== undefined) {
              fieldArray.push(element.searchable + ' LIKE \'%' + this.search + '%\'')
            }
          })
        } else if (this.headers.length > 0) {
          this.headers.forEach((element) => {
            if (element.value !== '_actions') {
              fieldArray.push('`' + element.value + '` LIKE \'%' + this.search + '%\'')
            }
          })
        }
        if (fieldArray.length > 0) {
          ajaxParams.filter = '(' + fieldArray.join(' OR ') + ')'
        }
      }
      if (this.subqueries) {
        ajaxParams.subqueries = this.subqueries
      }
      if (this.joins) {
        ajaxParams.joins = this.joins
      }
      if (this.filter) {
        if (ajaxParams.filter) {
          ajaxParams.filter += ' AND ' + this.filter
        } else {
          ajaxParams.filter = this.filter
        }
      }
      this.appyFilters = false
      this.filters.forEach((filterValue) => {
        if (filterValue.value !== null) {
          let condition = ''
          let value = filterValue.value
          let field = filterValue.field
          if (filterValue.direction && filterValue.direction === 'start') {
            condition = '>'
          }
          if (filterValue.direction && filterValue.direction === 'startinclude') {
            condition = '>='
          }
          if (filterValue.direction && filterValue.direction === 'end') {
            condition = '<'
          }
          if (filterValue.direction && filterValue.direction === 'endinclude') {
            condition = '<='
          }
          if (filterValue.type === 'bool' && filterValue.value === true) {
            value = '1'
          } else if (filterValue.type === 'bool' && filterValue.value === false) {
            value = '0'
          }
          if (filterValue.type === 'enum') {
            value = filterValue.list.indexOf(filterValue.value)
          }
          if (filterValue.customfield) {
            field = filterValue.customfield
          }
          ajaxParams[field + condition] = value
          this.appyFilters = true
        }
      })

      return ajaxParams
    },

    processResponse (fieldSet, element, table) {
      if (fieldSet) {
        fieldSet.forEach((fieldData) => {
          if (fieldData.type === 'bool' && fieldData.useIcons) {
            if (element[fieldData.field] === '0') {
              element[fieldData.field] = '<i class="v-icon mdi mdi-close-circle-outline" />'
            } else {
              element[fieldData.field] = '<i class="v-icon mdi mdi-check-circle-outline" />'
            }
          } else if (fieldData.type === 'bool') {
            if (element[fieldData.field] === '0') {
              element[fieldData.field] = 'No'
            } else {
              element[fieldData.field] = 'Sí'
            }
          }
          if (fieldData.type === 'currency') {
            element[fieldData.field] = '$ ' + element[fieldData.field]
          }
          if (fieldData.type === 'date') {
            if (element[fieldData.field] !== '' && element[fieldData.field] !== null) {
              if (element[fieldData.field].split(':').length === 1) {
                element[fieldData.field] += ' 00:00:00'
              }
              const elementDate = new Date(element[fieldData.field])
              element[fieldData.field] = elementDate.toLocaleDateString()
            }
          }
          if (fieldData.type === 'datetime') {
            if (element[fieldData.field] !== '' && element[fieldData.field] !== null) {
              if (element[fieldData.field].split(':').length === 1) {
                element[fieldData.field] += ' 00:00:00'
              }
              const elementDate = new Date(element[fieldData.field])
              element[fieldData.field] = elementDate.toLocaleDateString() + ' ' + elementDate.toLocaleTimeString()
            }
          }
          if (fieldData.type === 'enum') {
            element[fieldData.field] =
                fieldData.list[element[fieldData.field]]
          }
          if (fieldData.type === 'avatars') {
            this.componentFields[table][fieldData.field] = 'avatars'
          }
          if (fieldData.type === 'more') {
            let moretype = 'tooltip'
            if (fieldData.moretype) {
              moretype = fieldData.moretype
            }
            this.componentFields[table][fieldData.field] = 'more-' + moretype
          }
          if (fieldData.type === 'button') {
            this.componentFields[table][fieldData.field] = 'button'
          }
          if (fieldData.mask) {
            const mask = fieldData.mask
            const maskparts = mask.split(/({|})/g)
            if (maskparts.length === 1) {
              element[fieldData.field] = mask
            } else {
              for (
                let maskpartsindex = 0;
                maskpartsindex < maskparts.length;
                maskpartsindex++
              ) {
                if (maskparts[maskpartsindex] === '{') {
                  maskparts[maskpartsindex + 1] =
                  element[maskparts[maskpartsindex + 1]]
                }
              }
              element[fieldData.field] = maskparts
                .join('')
                .replace(/({|})/g, '')
            }
            console.log(mask)
          }
        })
      }
      const insertRecord = {}
      if (table === 'main') {
        this.headers.forEach((headerItem) => {
          insertRecord[headerItem.value] = element[headerItem.value]
        })
      } else {
        fieldSet.forEach((headerItem) => {
          insertRecord[headerItem.field] = element[headerItem.field]
        })
      }
      insertRecord.id = element.id
      insertRecord.moreData = { display: false, data: null }
      return insertRecord
    },

    async getDataFromApi () {
      this.loading = true
      const ajaxParams = this.prepareRequest()
      let apiSource = this.source + '/find'
      if (this.source.split('/').length >= 3) {
        apiSource = this.source
      }

      await this.$axios
        .$post(
          apiSource,
          JSON.stringify(ajaxParams),
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
          if (evtResponse.status === 400 && evtResponse.result === -1) {
            this.$router.push('/login')
          } else {
            if (this.headers.length === 0) {
              const tableHeads = Object.keys(evtResponse.records[0])
              tableHeads.forEach((element) => {
                this.headers.push({
                  text: element,
                  value: element
                })
              })
              this.addHeaderActions()
            }
            this.records = []
            evtResponse.records.forEach((element) => {
              this.records.push(this.processResponse(this.fieldset, element, 'main'))
            })
            this.totalrecords = parseInt(evtResponse.total)
            this.loading = false
          }
        })
    },
    addHeaderActions () {
      this.headers.push({
        text: '',
        value: '_actions'
      })
    },
    deleteItem (item) {
      this.deleteIndex = item.id
      this.deleteDialog = true
    },

    async deleteItemConfirm () {
      this.deleteDialog = false
      let deleteAPI = this.source + '/delete'
      if (this.deletepath) {
        deleteAPI = this.deletepath
      }
      await this.$axios
        .$post(
          deleteAPI,
          JSON.stringify({ id: this.deleteIndex }),
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
        .then(() => {
          this.deleteSnack = true
          this.getDataFromApi()
        })
    },

    createNew () {
      if (this.form) {
        this.$router.push('/forms/' + this.form + '/new')
      } else {
        this.$emit('add')
      }
    },

    editItem (item) {
      if (this.form) {
        this.$router.push('/forms/' + this.form + '/' + item.id)
      } else {
        this.$emit('edit', item)
      }
    },

    async exportData () {
      const ajaxParams = this.prepareRequest()
      ajaxParams.page = undefined
      ajaxParams.r_page = undefined
      let apiSource = this.source + '/exportToExcel'
      if (this.source.split('/').length >= 3) {
        apiSource = this.source
      }

      await this.$axios
        .$post(
          apiSource,
          JSON.stringify({ find: ajaxParams, fields: this.fieldset, json: true }),
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
          window.open(evtResponse.data, '_blank')
        })
    },

    deleteMasive () {
      const deleteItems = []
      this.selected.forEach((element) => {
        deleteItems.push(element.id)
      })
      this.deleteIndex = deleteItems
      this.deleteDialog = true
    },

    processEvent (item, field) {
      let eventName = field
      if (this.fieldset) {
        this.fieldset.forEach((fieldData) => {
          if (fieldData.field === field && fieldData.eventName) {
            eventName = fieldData.eventName
          }
        })
      }
      this.$emit(eventName, item)
    },

    getComponentProperties (field) {
      let result = null
      if (this.fieldset) {
        this.fieldset.forEach((fieldData) => {
          if (fieldData.field === field) {
            result = fieldData
          }
        })
      }
      return result
    },

    async displayMore (action, item) {
      if (item.moreData.display) {
        item.moreData.display = false
        return
      }
      let actionData = null
      this.customActions.forEach((element) => {
        if (element.action === action) {
          actionData = Object.assign({}, element)
        }
      })
      let ajaxParams = null
      if (actionData.queryParams) {
        for (const queryField in actionData.queryParams) {
          const mask = actionData.queryParams[queryField]
          const maskparts = actionData.queryParams[queryField].split(/({|})/g)
          if (maskparts.length === 1) {
            actionData.queryParams[queryField] = mask
          } else {
            for (
              let maskpartsindex = 0;
              maskpartsindex < maskparts.length;
              maskpartsindex++
            ) {
              if (maskparts[maskpartsindex] === '{') {
                maskparts[maskpartsindex + 1] =
                item[maskparts[maskpartsindex + 1]]
              }
            }
            actionData.queryParams[queryField] = maskparts
              .join('')
              .replace(/({|})/g, '')
          }
        }
        ajaxParams = actionData.queryParams
      }
      if (this.componentFields[action] === undefined) {
        this.componentFields[action] = {}
      }
      await this.$axios
        .$post(
          actionData.query,
          JSON.stringify(ajaxParams),
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
          if (evtResponse.status === 400 && evtResponse.result === -1) {
            this.$router.push('/login')
          } else {
            item.moreData.data = {
              fieldset: actionData.fieldset,
              records: []
            }
            evtResponse.records.forEach((element) => {
              item.moreData.data.records.push(this.processResponse(actionData.fieldset, element, action))
            })
            item.moreData.display = true
          }
        })
    }

  }
}
</script>
