import axios from 'axios'
/*
export default function ({ store, redirect, route }) {
*/
export default async function ({ store, redirect, route, $axios }) {
  let info = {}
  await axios.get('conf/main.json').then((response) => {
    info = response.data
  })
  $axios.setBaseURL(info.api.location)
  console.log(info)
  store.commit('SET_INFO', info.api)

  if (localStorage.token && localStorage.token !== '') {
    store.commit('SET_TOKEN', localStorage.token)

    try {
      let data = null
      await store.dispatch('validate_token').then((result) => {
        data = result
      })
      if (data === 1) {
        // store.commit('SET_TOKEN', localStorage.token)
        await store.dispatch('getUserInfo')
        console.log('Ruta', route)
        if (localStorage.lastpath) {
          return redirect(localStorage.lastpath)
        } else if (route.path !== '/login') {
          return redirect(route.path)
        } else {
          return redirect('/')
        }
      }
    } catch (error) {
      console.log(error)
      localStorage.token = ''
      return redirect('/login')
    }
  } else {
    return redirect('/login')
  }
}
