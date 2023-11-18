export const menu = [
  {
    icon: 'mdi-list-status',
    title: 'Tareas',
    to: '/modules/tasks'
  },
  {
    icon: 'mdi-playlist-edit',
    title: 'Lista',
    to: '/lists/tasks',
    breadcrum: [
      { text: 'Tareas', to: '/modules/tasks', exact: true, icon: 'mdi-list-status' },
      { text: 'Lista', to: '/lists/tasks', exact: true, icon: 'mdi-playlist-edit' }
    ]
  },
  {
    icon: 'mdi-tag-multiple',
    title: 'Tipos',
    to: '/lists/tasktypes'
  }
]
