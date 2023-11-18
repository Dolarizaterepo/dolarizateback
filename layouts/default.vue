<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="permanent"
      :expand-on-hover="permanent"
      :clipped="true"
      :mini-variant="true"
      app
    >
      <v-list shaped>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="navClick(i)"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
      dense
      dark
      class="d-print-none primary"
    >
      <!--
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      -->
      <v-dialog
        v-model="dialog"
        fullscreen
        transition="dialog-top-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar flat>
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Módulos</v-toolbar-title>
          </v-toolbar>
          <div class="d-flex align-stretch justify-center flex-wrap">
            <v-card dark class="d-flex flex-column pa-4 teal ma-4 moduleBtn" @click="selModule('/')">
              <v-icon size="50">mdi-chart-bar</v-icon>
              Tablero de control
            </v-card>
            <v-card dark class="d-flex flex-column pa-4 amber ma-4 moduleBtn" @click="selModule('/modules/wallets')">
              <v-icon size="50">mdi-wallet</v-icon>
              Balances
            </v-card>
            <v-card dark class="d-flex flex-column pa-4 orange ma-4 moduleBtn" @click="selModule('/configuration')">
              <v-icon size="50">mdi-cog</v-icon>
              Configuración
            </v-card>
          </div>
        </v-card>
      </v-dialog>
      <v-toolbar-title class="d-flex align-center">
        <img src="images/icono-dolarizate.svg" style="height: 2.5rem; margin-right: .5rem;" /> DOLARIZATE
      </v-toolbar-title>
      <v-spacer />
      <!--
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      -->
      <v-btn
        icon
        onclick="window.print();"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <v-menu bottom min-width="150px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar color="white" size="40">
              <img
                :src="$store.state.authUser.image"
                :alt="
                  $store.state.authUser.name +
                    ' ' +
                    $store.state.authUser.lastname
                "
              />
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="px-4">
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <h3 class="primary--text mb-4 mt-2">
                {{ $store.state.authUser.name }}
                {{ $store.state.authUser.lastname }}
              </h3>
              <v-avatar color="white" class="mb-4">
                <img
                  :src="$store.state.authUser.image"
                  :alt="
                    $store.state.authUser.name +
                      ' ' +
                      $store.state.authUser.lastname
                  "
                />
              </v-avatar>
              <p class="caption mt-1">
                {{ $store.state.authUser.usr }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                rounded
                text
                :to="'/forms/users/' + $store.state.authUser.id"
              >
                Editar cuenta
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout()">
                Salir
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <template v-slot:extension>
        <div class="d-flex align-center" style="width: 100%;">
          <div class="d-flex align-center">
            <div
              v-for="(item, index) in $store.state.nav"
              :key="'breadcrum-' + index"
              class="d-flex align-center text-caption"
            >
              <a
                class="v-breadcrumbs__item white--text"
                @click="breadcrumNav(index)"
              >
                <v-icon v-if="item.icon" v-text="item.icon" class="mr-1" style="font-size: 1rem" />
                {{ item.text }}
              </a>
              <span class="mx-2" v-if="index < $store.state.nav.length - 1">
                <v-icon class="text-caption">mdi-chevron-right</v-icon>
              </span>
            </div>
          </div>
          <!--
          <v-breadcrumbs
            divider=">"
            :items="$store.state.nav"
          >
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :href="item.href"
                :disabled="item.disabled"
                :to="item.to"
                @click="breadcrumNav(item)"
                :exact="item.exact"
              >
                <v-icon v-if="item.icon" v-text="item.icon" class="mr-1" />
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
          -->
          <v-spacer />
          <v-btn v-if="showSaveBtn" color="green lighten-1" @click="$nuxt.$emit('saveform')">Guardar</v-btn>
        </div>
      </template>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: 'auth',
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      permanent: true,
      dialog: false,
      showSaveBtn: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  watch: {
    $route () {
      this.permanent = true
      this.showSaveBtn = false
    }
  },
  created () {
    this.$nuxt.$on('changelayout', ($event) => { this.changeLayout($event) })
  },
  methods: {
    async logout () {
      await this.$store.dispatch('logout').then(() => {
        localStorage.token = ''
        this.$router.push('/login')
      })
    },
    changeLayout (params) {
      console.log(params)
      if (params.noNav !== undefined) {
        this.permanent = !params.noNav
        this.$nextTick(() => {
          this.drawer = !params.noNav
        })
      } else {
        this.permanent = true
      }
      if (params.showSaveBtn !== undefined) {
        this.showSaveBtn = params.showSaveBtn
      }
      if (params.moduleNav !== undefined) {
        this.items = params.moduleNav
      }
    },
    selModule (module) {
      this.$router.push(module)
      this.dialog = false
    },
    navClick (index) {
      const navElement = this.items[index]
      if (navElement.breadcrum) {
        this.$store.dispatch('resetNav')
        this.$store.dispatch('addToNav', [...navElement.breadcrum])
      }
      this.$router.push(navElement.to)
    },
    breadcrumNav (index) {
      const currentNav = this.$store.state.nav.slice(1, index + 1)
      console.log(index, this.$store.state.nav, currentNav)
      this.$store.dispatch('resetNav')
      this.$store.dispatch('addToNav', currentNav)
      this.$router.push(this.$store.state.nav[index].to)
    }
  }
}
</script>
