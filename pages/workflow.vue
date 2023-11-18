<template>
  <div>
    <workflow
      :nodetypes="{
        api: {
          title: 'API',
          icon: 'mdi-api',
          desc: 'Conectar con API',
          group: 'conectores',
          size: {
            width: 200,
            height: 85
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'OK',
            error: 'Error'
          }
        },
        db: {
          title: 'Base de datos',
          icon: 'mdi-database',
          desc: 'Conectar con DB',
          group: 'conectores',
          size: {
            width: 200,
            height: 105
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'OK',
            empty: 'Sin registros',
            error: 'Error'
          }
        },
        ftp: {
          title: 'FTP',
          icon: 'mdi-file-cloud-outline',
          desc: 'Conectar con FTP',
          group: 'conectores',
          size: {
            width: 200,
            height: 110
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'OK',
            fnf: 'Archivo no encontrado',
            error: 'Error'
          }
        },
        file: {
          title: 'Archivo local',
          icon: 'mdi-file',
          desc: 'Leer/Escribir archivo local',
          group: 'conectores',
          size: {
            width: 200,
            height: 115
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'OK',
            fnf: 'Archivo no encontrado',
            error: 'Error'
          }
        },
        email: {
          title: 'Email',
          icon: 'mdi-email',
          desc: 'Recibir/Enviar correo',
          group: 'conectores',
          size: {
            width: 200,
            height: 105
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'OK',
            empty: 'No hay mails nuevos',
            error: 'Error'
          }
        },
        def: {
          title: 'Definir variable',
          icon: 'mdi-code-braces',
          desc: 'Definir variable',
          group: 'variables',
          size: {
            width: 200,
            height: 80
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'OK',
            error: 'Error'
          },
          fieldSet: [
            { field: 'variable', label: 'Variable', type: 'text' },
            { field: 'value', label: 'Valor', type: 'text' },
            { field: 'type', label: 'Tipo', type: 'enum', values: ['Texto', 'Número', 'Fecha', 'Lógica', 'Array'] }
          ]
        },
        validation: {
          title: 'Validación',
          icon: 'mdi-help',
          desc: 'Validar variable',
          group: 'variables',
          size: {
            width: 200,
            height: 80
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'SÍ',
            error: 'NO'
          },
          fieldSet: [
            { field: 'variable', label: 'Variable a evaluar', type: 'text' },
            { field: 'operation', label: 'Operación', type: 'enum', values: ['Igual', 'Distinto', 'Mayor', 'Menor', 'Mayor o igual', 'Menor o igual', 'Contiene', 'No contiene'] },
            { field: 'compare', label: 'Valor con el que comparar', type: 'text' },
            { field: 'type', label: 'Tipo de comparación', type: 'enum', values: ['Texto', 'Números', 'Fechas', 'Lógica'] }
          ]
        },
        switch: {
          title: 'Switch',
          icon: 'mdi-arrow-decision',
          desc: 'Validar casos',
          group: 'variables',
          size: {
            width: 200,
            height: 160
          },
          portsIn: {
            default: ''
          },
          portsOut: {
            default: 'default'
          },
          fieldSet: [
            { field: 'variable', label: 'Variable a evaluar', type: 'text' },
            { field: 'ports', label: 'Valores', type: 'list', destination: 'portsOut'}
          ]
        },
        end: {
          title: 'Fin',
          icon: 'mdi-close-circle',
          desc: 'Finalizar',
          size: {
            width: 200,
            height: 60
          },
          portsIn: {
            default: ''
          }
        }
      }"
      :groupData = "{
        conectores: { title: 'Conectores', icon: 'mdi-connection'},
        variables: { title: 'Variables', icon: 'mdi-variable'},
      }"
    />
  </div>
</template>
<script>
export default {
  mounted () {
    this.$nuxt.$emit('changelayout', { noNav: true })
  }
}
</script>
