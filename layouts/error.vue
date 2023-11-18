<template>
  <div class="d-flex flex-column align-center justify-center" style="height: calc(100vh - 24px);">
    <div v-if="error.statusCode === 404">
      <div class="d-flex align-center justify-center mb-8" style="max-width: 100%; font-size: 1.5rem;">
        <img src="/images/logo.png" style="height: 2rem; width: 2rem; margin-right: .5rem;" />
        La página que estás buscando no existe
      </div>
      <v-img src="images/undraw_page_not_found_re_e9o6.svg" max-width="60%" style="margin-left: 20%" />
    </div>
    <div v-else>
      <div class="d-flex align-center justify-center mb-8" style="max-width: 100%; font-size: 1.5rem;">
        <img src="/images/logo.png" style="height: 2rem; width: 2rem; margin-right: .5rem;" />
        {{ otherError }}
      </div>
      <v-img src="images/undraw_bug_fixing_oc-7-a.svg" max-width="60%" style="margin-left: 20%" />
    </div>
    <NuxtLink to="/" class="mt-8">
      Ir a la página de inicio
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'Ups! Ocurrió un error'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
