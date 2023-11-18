<template>
  <nuxt-child
    :defFile.sync="defFile"
  />
</template>
<script>
export default {
  data () {
    return {
      menu: [],
      defFile: null
    }
  },
  mounted () {
    let routePath = ''
    if (this.defFile === null) {
      routePath = this.$route.name.split('-')[1]
    } else {
      routePath = this.defFile
    }
    let definitionPath = 'modules/' + routePath + '/definitions.js'
    console.log(routePath, definitionPath)
    if (routePath === 'configuration') {
      definitionPath = 'configuration/definitions.js'
    }
    import('./' + definitionPath)
      .then((module) => {
        this.menu = module.menu
        this.$nuxt.$emit('changelayout', { moduleNav: this.menu })
        this.menu.forEach((element) => {
          if (element.to === this.$route.path) {
            if (this.$store.state.nav.length === 1 && element.breadcrum) {
              this.$store.dispatch('addToNav', [...element.breadcrum])
            } else if (this.$store.state.nav[this.$store.state.nav.length - 1].to !== element.to) {
              this.$store.dispatch('addToNav', { text: element.title, to: element.to, exact: true, icon: element.icon })
            }
          }
        })
      })
  }
}
</script>
