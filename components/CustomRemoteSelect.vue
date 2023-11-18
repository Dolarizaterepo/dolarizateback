<template>
    <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        clearable
        chips
        color="blue-grey lighten-2"
        item-text="displayname"
        item-value="id"
        :label="label"
        placeholder="Escriba para buscar"
        return-object
        v-if="withImage"
        :multiple="multiple"
        :disabled="disabled"
    >
        <template v-slot:selection="data">
        <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            @click="data.select"
        >
            <v-avatar left>
            <v-img :src="data.item.image"></v-img>
            </v-avatar>
            {{ data.item.displayname }}
        </v-chip>
        </template>
        <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
            <v-list-item-avatar>
            <img :src="data.item.image">
            </v-list-item-avatar>
            <v-list-item-content>
            <v-list-item-title v-html="data.item.displayname"></v-list-item-title>
            </v-list-item-content>
        </template>
        </template>
    </v-autocomplete>
    <v-autocomplete
        v-else
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        hide-selected
        clearable
        item-text="displayname"
        item-value="id"
        :label="label"
        placeholder="Escriba para buscar"
        return-object
        :multiple="multiple"
        :chips="multiple"
        :disabled="disabled"
    ></v-autocomplete>
</template>
<script>
export default {
  inheritAttrs: false,
  props: [
    'source',
    'label',
    'value',
    'withImage',
    'display',
    'multiple',
    'disabled',
    'filter',
    'queryFilter',
    'sourceParams'
  ],
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null
  }),

  computed: {
    items () {
      let displayValue = this.display
      if (!this.display || this.display === '') {
        displayValue = '{name}'
      }

      this.entries.forEach((element) => {
        const maskparts = displayValue.split(/({|})/g)
        element.displayname = ''
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
        element.displayname = maskparts
          .join('')
          .replace(/({|})/g, '')

        // element.id = parseInt(element.id)
      })
      return this.entries
    }
  },

  mounted () {
    this.search = ''
    /*
      if (this.multiple && typeof this.value !== 'object') {
        this.model = [this.value]
      } else {
        this.model = this.value
      }
      */
    this.model = this.value
  },

  watch: {
    value () {
      this.search = ''
      /*
      if (this.multiple && typeof this.value !== 'object') {
        this.model = [this.value]
      } else {
        this.model = this.value
      }
      */
      this.model = this.value
    },

    model () {
      if (typeof this.model === 'object' && this.model !== null) {
        if (this.multiple) {
          const returnData = []
          let update = false
          this.model.forEach((element) => {
            if (typeof element === 'object') {
              returnData.push(element.id)
              update = true
            } else {
              returnData.push(element)
            }
          })
          if (update || this.model.length !== this.value.length) {
            this.$emit('input', returnData)
          }
        } else {
          this.$emit('input', this.model.id)
        }
      } else {
        this.$emit('input', this.model)
      }
    },

    search (val) {
      // Items have already been loaded
      // if (this.items.length > 0) { return }

      // Items have already been requested
      if (this.isLoading) { return }

      this.update()
    },

    queryFilter () {
      this.update()
    }
  },

  methods: {
    update () {
      this.isLoading = true

      // Lazily load input items
      let filterquery = ''
      if (this.filter && this.search) {
        const filterElements = []
        this.filter.forEach((element) => {
          filterElements.push('`' + element + '` LIKE \'%' + this.search + '%\'')
        })
        filterquery = '(' + filterElements.join(' OR ') + ')'
      }
      if (this.queryFilter && this.queryFilter !== '') {
        if (filterquery !== '') {
          filterquery += ' AND '
        }
        filterquery += '(' + this.queryFilter + ')'
      }
      let sourceParams = { filter: filterquery, page: 1, r_page: 10 }
      if (this.sourceParams) {
        sourceParams = Object.assign(sourceParams, this.sourceParams)
      }

      this.$axios
        .$post(
          this.source + '/find',
          JSON.stringify(sourceParams),
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
            this.count = evtResponse.total
            this.entries = evtResponse.records
            this.isLoading = false
          }
        })
    }
  }
}
</script>
