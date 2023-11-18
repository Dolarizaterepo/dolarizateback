<template>
  <v-menu
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        v-model="menu2"
    >
        <template v-slot:activator="{ on, attrs }">
        <v-text-field
            v-model="dateFormatted"
            :label="label"
            prepend-icon="mdi-calendar"
            :clearable="clearable"
            @click:clear="date = null"
            readonly
            v-bind="attrs"
            v-on="on"
            @blur="date = parseDate(dateFormatted)"
        ></v-text-field>
        </template>
        <v-date-picker
        v-model="date"
        @input="menu2 = false"
        ></v-date-picker>
    </v-menu>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['value', 'label', 'setnow', 'clearable'],

  data () {
    return {
      date: null,
      dateFormatted: null,
      menu2: false
    }
  },

  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },

  mounted () {
    if (this.setnow && this.setnow === true) {
      this.date = new Date().toISOString().substr(0, 10)
      this.dateFormatted = this.formatDate(this.date)
    }
  },

  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
      this.$emit('input', this.date)
    },
    value () {
      this.date = this.value
    }
  },

  methods: {
    formatDate (date) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) { return null }
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>
