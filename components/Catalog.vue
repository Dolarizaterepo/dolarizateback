<template>
  <div>
    <v-row>
      <v-col cols="4">
        <b>Líneas</b>
        <v-list>
          <v-list-item-group v-model="lineSel">
            <v-list-item
              v-for="(item, i) in lines"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col></v-col>
          <v-col cols="12" md="6">
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
          </v-col>
        </v-row>
        <v-data-iterator
          :items="catalog"
          :items-per-page="10"
          item-key="id"
          no-data-text="No se encontraron modelos"
          @update:options="getDataFromApi"
          :options.sync="options"
        >
          <template v-slot:default="{ items }">
            <v-row>
              <v-col
                v-for="item in items"
                :key="item.name"
                cols="12"
                sm="6"
                md="6"
                lg="6"
              >
                <v-card @click="$emit('input', item)">
                  <v-img
                    height="250"
                    max-width="100%"
                    :src="item.image"
                    contain
                  ></v-img>
                  <v-card-title>
                    <div class="text-h4">{{ item.model }}</div>
                  </v-card-title>
                  <v-card-text>
                    <div class="text-h5">$ {{ $formatCurrency(item.price_lepic) }}</div>
                    {{ item.stock }} unidades en stock
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      search: '',
      lines: [],
      lineSel: null,
      catalog: [],
      options: {}
    }
  },
  watch: {
    lineSel () {
      this.getDataFromApi()
    }
  },
  mounted () {
    this.getLines()
    this.getDataFromApi()
  },
  methods: {
    async getDataFromApi () {
      const { page, itemsPerPage } = this.options
      const ajaxParams = { page, r_page: itemsPerPage, withImg: true }
      if (this.lineSel !== null && this.lineSel !== undefined) {
        ajaxParams.line = this.lineSel
      }
      if (this.search !== '') {
        const fieldArray = []
        fieldArray.push('`model` LIKE \'%' + this.search + '%\'')
        ajaxParams.filter = '(' + fieldArray.join(' OR ') + ')'
      }
      ajaxParams.subqueries = [
        {
          field: 'model',
          table: 'vehicles',
          alias: 'stock'
        }
      ]
      await this.$axios
        .$post(
          'cars/catalog/find',
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
          this.catalog = evtResponse.records
        })
    },
    async getLines () {
      await this.$axios
        .$post(
          'cars/clines/find',
          {},
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
          this.lines = evtResponse.records
        })
    }
  }
}
</script>
