<template>
  <div>
    <div class="text-h4 title">Configuración</div>
  </div>
</template>
<script>
import { menu } from './definitions'

export default {
  mounted () {
    this.$nuxt.$emit('changelayout', { moduleNav: menu })
    this.$store.dispatch('resetNav')
    this.$store.dispatch('addToNav', { text: 'Configuración', to: '/configuration', exact: true, icon: 'mdi-cog' })
  }
}
</script>
