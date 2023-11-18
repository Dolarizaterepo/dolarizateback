export const menu = [
  {
    icon: 'mdi-cog',
    title: 'Configuración',
    to: '/configuration'
  },
  {
    icon: 'mdi-account-multiple-outline',
    title: 'Usuarios',
    to: '/lists/configuration/users',
    breadcrum: [
      { text: 'Configuración', to: '/configuration', exact: true, icon: 'mdi-cog' },
      { text: 'Usuarios', to: '/lists/configuration/users', exact: true, icon: 'mdi-account-multiple-outline' }
    ]
  },
  {
    icon: 'mdi-account-key-outline',
    title: 'Roles',
    to: '/lists/configuration/roles',
    breadcrum: [
      { text: 'Configuración', to: '/configuration', exact: true, icon: 'mdi-cog' },
      { text: 'Roles', to: '/lists/configuration/roles', exact: true, icon: 'mdi-account-key-outline' }
    ]
  },
  {
    icon: 'mdi-sitemap',
    title: 'Workflow',
    to: '/workflow',
    breadcrum: [
      { text: 'Configuración', to: '/configuration', exact: true, icon: 'mdi-cog' },
      { text: 'Workflow', to: '/workflow', exact: true, icon: 'mdi-sitemap' }
    ]
  }
]

export const permissions = [
  {
    entity: 'users',
    name: 'Usuarios',
    matrix: [
      { name: 'Crear', type: 'bool' },
      { name: 'Editar', type: 'bool' },
      { name: 'Borrar', type: 'bool' },
      { name: 'Asignar rol', type: 'bool' },
      { name: 'Auditar', type: 'bool' },
      { name: 'Exportar', type: 'bool' }
    ]
  },
  {
    entity: 'roles',
    name: 'Roles',
    matrix: [
      { name: 'Crear', type: 'bool' },
      { name: 'Editar', type: 'bool' },
      { name: 'Borrar', type: 'bool' },
      { name: 'Editar permisos', type: 'bool' },
      { name: 'Auditar', type: 'bool' },
      { name: 'Exportar', type: 'bool' }
    ]
  }
]
