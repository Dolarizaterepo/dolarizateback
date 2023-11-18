<template>
  <div>
    <div class="text-h4 title mb-4">Billeteras</div>
    <custom-table
      source="exchange/wallet"
      audit="/audit/wallet"
      :noAdd="true"
      :deleterules="false"
      :editrules="false"
      :customActions="[
        {action: 'balance', icon: 'mdi-note-text-outline'},
      ]"
      @balance="$router.push('/lists/balancedetail?wallet='+ $event.id)"
      :joins="[
                {
                  field: ['name', 'lastname', 'kyclevel', 'validmail'],
                  alias: ['username', 'userlastname', 'kyclevel', 'validmail'],
                  table: 'users',
                  on: ['id', 'user']
                }
              ]"
      :fieldset = "[
            { label: 'Usuario', field: 'user', mask: '{username} {userlastname}', searchable: '(SELECT CONCAT(`users`.`name`, \' \', `users`.`lastname`))', filter: { type: 'remote', table: 'users/users', withImage: true, display: '{name} {lastname}'}},
            { label: 'CVU', field: 'cvu', searchable: '`main`.`cvu`' },
            { label: 'KYC', field: 'kyclevel', type: 'enum', list: ['No generado', 'Observado', 'Aprobado'], filter: { type: 'enum' } },
            { label: 'Validado', field: 'validmail', type: 'bool', useIcons: true },
            { label: 'ARS', field: 'ars' },
            { label: 'USD', field: 'usd' }
          ]"
    />
  </div>
</template>
<script>
export default {
  mounted () {
    this.$emit('update:defFile', 'wallets')
  }
}
</script>
