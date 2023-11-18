<template>
  <div>
    <div class="text-h4 title mb-4">Lista de tareas</div>
    <custom-table
      source="tasks/tasks"
      form="tasks"
      audit="/audit/tasks"
      :showSelect="true"
      :joins="[
                {
                  field: ['name', 'lastname'],
                  alias: ['creatorname', 'creatorlastname'],
                  table: 'users',
                  on: ['id', 'creator']
                }
              ]"
      :fieldset = "[
            { label: 'Nombre', field: 'name', searchable: '`main`.`name`'},
            { label: 'Creador', field: 'creator', mask: '{creatorname} {creatorlastname}', searchable: '(SELECT CONCAT(`users`.`name`, \' \', `users`.`lastname`))', filter: { type: 'remote', table: 'users/users', withImage: true, display: '{name} {lastname}'}},
            { label: 'Responsables', field: 'responsibles', type: 'avatars'},
            { label: 'Inicio', field: 'startdate', type: 'date', filter: { type: 'date', direction: 'startinclude'}},
            { label: 'Fin', field: 'enddate', type: 'date', filter: { type: 'date', direction: 'endinclude'}},
            { label: 'Finalizado', field: 'ended', type: 'bool', useIcons: true, filter: { type: 'bool'}},
            { label: 'Actualizado', field: 'updated', type: 'datetime'}
          ]"
    />
  </div>
</template>
