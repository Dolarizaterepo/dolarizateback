<template>
  <div>
    <div class="text-h4 title mb-4">Roles</div>
    <custom-table
      source="users/roles"
      audit="/audit/roles"
      form="roles"
      :subqueries="[
            {
              field: 'rol',
              table: 'users',
              alias: 'users'
            }
          ]"
      :fieldset = "[
        { label: 'ID', field: 'id'},
        { label: 'Nombre', field: 'name', searchable: 'name'},
        { label: 'Usuarios', field: 'users'},
        { label: 'Predeterminado', field: 'defaultrol', type: 'bool', useIcons: true},
        { label: 'Actualizado', field: 'updated'}
      ]"
    />
  </div>
</template>
<script>
export default {
}
</script>
