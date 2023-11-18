<template>
  <div>
    <div class="text-h4 title mb-4">Balance</div>
    <custom-table
      source="exchange/balance"
      audit="/audit/balance"
      :noAdd="true"
      :noactions="true"
      :filter="'`wallet` = \'' + $route.query.wallet + '\''"
      :sortBy="{ created: 'DESC' }"
      :fieldset = "[
            { label: 'Fecha', field: 'created', type: 'datetime'},
            { label: 'Tipo', field: 'type', type: 'enum', list: ['Ingreso', 'Egreso', 'Cambio', 'Tarjeta'], filter: { type: 'enum' } },
            { label: 'Descripción', field: 'description' },
            { label: 'ARS', field: 'ars' },
            { label: 'USD', field: 'usd' },
            { label: '', field: 'bars', mask: '{bars} ARS' },
            { label: '', field: 'busd', mask: '{busd} USD' }
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
