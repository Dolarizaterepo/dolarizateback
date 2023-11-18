<template>
    <v-text-field
        v-if="type === 'password'"
        v-bind:value="value"
        v-on:input="$emit('input', $event)"
        :label="label"
        :rules="rules"
        :counter="localcounter"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        :hint="hint"
        :prefix="prefix"
        :suffix="suffix"
        :disabled="readonly"
        @click:append="show = !show"
    ></v-text-field>
    <v-text-field
      v-else
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
      :label="label"
      :rules="rules"
      :counter="localcounter"
      :type="type"
      :hint="hint"
      :prefix="prefix"
      :suffix="suffix"
      :disabled="readonly"
    ></v-text-field>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['type', 'max', 'min', 'required', 'label', 'counter', 'value', 'hint', 'prefix', 'suffix', 'readonly'],
  data () {
    return {
      show: false
    }
  },
  computed: {
    rules () {
      const rules = []
      if (this.required !== undefined) {
        rules.push(v => !!v || 'Requerido')
      }
      if (this.max) {
        const rule =
            v => (v || '').length <= this.max ||
              `Máximo ${this.max} caracteres`
        rules.push(rule)
      }
      if (this.min) {
        const rule =
            v => (v || '').length >= this.min ||
              `Mínimo ${this.min} caracteres`
        rules.push(rule)
      }
      if (this.type === 'email') {
        const rule = (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail inválido.'
        }
        rules.push(rule)
      }
      return rules
    },
    localcounter () {
      if (this.counter) {
        return this.counter
      }
      if (this.max) {
        return this.max
      }
      if (this.min) {
        return true
      }
      return null
    }
  }
}
</script>
