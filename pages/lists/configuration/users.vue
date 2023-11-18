<template>
  <div>
    <div class="text-h4 title mb-4">Usuarios</div>
    <custom-table
      source="users/users"
      form="users"
      audit="/audit/users"
      :fieldset = "[
        { label: 'ID', field: 'id'},
        { label: 'Imagen', field: 'image', mask: '<div class=\'v-avatar\' style=\'height: 48px; min-width: 48px; width: 48px;\'><img src=\'{image}\' /></div>'},
        { label: 'Nombre', field: 'name', mask: '{name} {lastname}', searchable: '(SELECT CONCAT(`main`.`name`, \' \', `main`.`lastname`))'},
        { label: 'Activo', field: 'active', type: 'bool', useIcons: true},
        { label: 'Admin', field: 'sa', type: 'bool', useIcons: true},
        { label: 'Rol', field: 'rol_name', searchable: '`roles`.`name`'},
        { label: 'Actualizado', field: 'updated'}
      ]"
    />
  </div>
</template>
