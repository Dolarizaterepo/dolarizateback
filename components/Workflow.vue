<template>
  <div>
    <v-row>
      <v-col cols="9">
        <VueDiagramEditor
          ref="diagram"
          :node-deletable="nodeDeletable"
          :portAvailable="portAvailable"
          @deleted-node="setnodeToDelete"
          @select-node="selectNode"
        >
          <template slot="node" slot-scope="{node, height}">
            <div :style="'max-height: calc(' + height + 'px - 1.5rem)'">
              <div class="d-flex align-center">
                <v-icon style="font-size: 1rem" v-text="node.data.icon"></v-icon>
                <div class="ml-1">{{ node.data.desc }}</div>
              </div>
            </div>
          </template>
        </VueDiagramEditor>
      </v-col>
      <v-col>
        <v-card>
          <v-list>
            <v-subheader>BLOQUES</v-subheader>
            <v-list-group
              v-for="(groupData, name) in addNodeTree.groups"
              :key="'group-' + name"
              :prepend-icon="groupData.icon"
            >
              <template v-slot:activator>
                <v-list-item-title>{{ groupData.title }}</v-list-item-title>
              </template>
              <v-list-item
                v-for="(itemData, itemType) in groupData.childs"
                :key="'addNode-' + itemType"
                link
                @click="addNode(itemType)"
              >
                <v-list-item-title>{{ itemData.title }}</v-list-item-title>
                <v-list-item-icon>
                  <v-icon v-text="itemData.icon"></v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-group>
            <template v-for="(itemData, itemType) in addNodeTree">
              <v-list-item
                v-if="itemType !== 'groups'"
                :key="'addNode-' + itemType"
                link
                @click="addNode(itemType)"
              >
                <v-list-item-icon>
                  <v-icon v-text="itemData.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ itemData.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="displayData"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5" v-if="selNode !== null">
          {{ selNode.title }}
        </v-card-title>

        <v-card-text v-if="selNode !== null">
          <v-text-field
            label="Nombre"
            v-model="selNode.data.desc"
          ></v-text-field>
          <template v-for="(fieldData, index) in selNode.data.fieldSet">
            <v-autocomplete
              :key="selNode.id + '-field-' + index"
              v-if="fieldData.type == 'enum' && validateFieldVis(index)"
              :items="fieldData.values"
              :label="fieldData.label"
              v-model="selNode.data[fieldData.field]"
              @input="fieldChange(index)"
            ></v-autocomplete>
            <v-text-field
              :key="selNode.id + '-field-' + index"
              v-if="fieldData.type == 'text' && validateFieldVis(index)"
              :label="fieldData.label"
              v-model="selNode.data[fieldData.field]"
              @input="fieldChange(index)"
            />
            <CustomDatePicker
              :key="selNode.id + '-field-' + index"
              v-if="fieldData.type == 'cron' && validateFieldVis(index)"
              :label="fieldData.label"
              v-model="selNode.data[fieldData.field]"
              @input="fieldChange(index)"
            />
            <v-combobox
              :key="selNode.id + '-field-' + index"
              v-if="fieldData.type == 'list' && validateFieldVis(index)"
              :label="fieldData.label"
              v-model="selNode.data[fieldData.field]"
              @input="fieldChange(index)"
              multiple
              small-chips
            ></v-combobox>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            text
            @click="displayData = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="updateNode"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueDiagramEditor from 'vue-diagram-editor'
import 'vue-diagram-editor/dist/vue-diagram-editor.css'

export default {
  components: {
    VueDiagramEditor
  },
  props: ['nodetypes', 'groupData'],
  data () {
    return {
      nodes: {
        1: {
          id: 1,
          title: 'Inicio',
          size: {
            width: 200,
            height: 50
          },
          portsOut: {
            default: 'Iniciar'
          },
          data: {
            desc: 'Endpoint',
            icon: 'mdi-access-point-network',
            type: 'Endpoint',
            path: null,
            timer: null,
            fieldSet: [
              { field: 'type', label: 'Tipo', type: 'enum', values: ['Endpoint', 'Programado', 'Formulario'], eventType: 'internal', enventName: 'setType' },
              { field: 'path', label: 'Ruta', type: 'text', validations: { type: ['Endpoint', 'Formulario'] } },
              { field: 'timer', label: 'Fecha/Hora', type: 'cron', validations: { type: ['Programado'] } }
            ]
          }
        }
      },
      links: {},
      lastId: 1,
      selNode: null,
      displayData: false,
      nodeToDelete: null
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    addNodeTree () {
      const nodeTree = {
        groups: {}
      }
      for (const type in this.nodetypes) {
        const element = this.nodetypes[type]
        if (element.group) {
          if (nodeTree.groups[element.group] === undefined) {
            nodeTree.groups[element.group] = {
              title: this.groupData[element.group].title,
              icon: this.groupData[element.group].icon,
              childs: {}
            }
          }
          nodeTree.groups[element.group].childs[type] = {
            title: element.title,
            icon: element.icon
          }
        } else {
          nodeTree[type] = {
            title: element.title,
            icon: element.icon
          }
        }
      }
      return nodeTree
    }
  },
  methods: {
    init () {
      this.$refs.diagram.setModel({
        nodes: this.nodes,
        links: this.links
      })
      this.$refs.diagram.disableDblClickZoom()
    },
    format (node) {
      return JSON.stringify(node, null, 2)
    },

    portAvailable ({ id, type, port, activePort }) {
      if (type === 'out' || activePort.type === 'in') {
        return false
      } else {
        return true
      }
    },
    nodeDeletable (node) {
      if (node.id === 1) {
        return false
      } else {
        return true
      }
    },
    addNode (type) {
      this.lastId++
      let nodedata = {}
      nodedata = {
        id: this.lastId,
        title: this.nodetypes[type].title,
        size: this.nodetypes[type].size,
        data: {
          desc: this.nodetypes[type].desc,
          icon: this.nodetypes[type].icon,
          type
        }
      }
      if (this.nodetypes[type].portsIn) {
        nodedata.portsIn = this.nodetypes[type].portsIn
      }
      if (this.nodetypes[type].portsOut) {
        nodedata.portsOut = this.nodetypes[type].portsOut
      }
      if (this.nodetypes[type].fieldSet) {
        nodedata.data.fieldSet = this.nodetypes[type].fieldSet
        this.nodetypes[type].fieldSet.forEach((element) => {
          nodedata.data[element.field] = null
        })
      }
      this.$refs.diagram.addNode(nodedata)
    },
    setnodeToDelete (node) {
      this.nodeToDelete = node
      return true
    },
    selectNode (node) {
      setTimeout(() => {
        if (node === this.nodeToDelete) {
          return false
        }
        const currentData = this.$refs.diagram.serialize()
        currentData.nodes.forEach((element) => {
          if (element.id === node) {
            this.selNode = {
              id: element.id,
              title: element.title,
              data: Object.assign({}, element.data)
            }
          }
        })
        console.log(this.selNode, currentData)
        this.displayData = true
      }, 100)
    },
    updateNode () {
      this.$refs.diagram.updateNode({ id: this.selNode.id, name: 'data', value: this.selNode.data })
      if (this.selNode.portsOut) {
        this.$refs.diagram.updateNode({ id: this.selNode.id, name: 'portsOut', value: this.selNode.portsOut })
      }
      this.displayData = false
    },
    validateFieldVis (fieldIndex) {
      const validationConditions = this.selNode.data.fieldSet[fieldIndex].validations
      if (validationConditions === undefined) {
        return true
      }
      let result = true
      for (const validation in validationConditions) {
        if (!validationConditions[validation].includes(this.selNode.data[validation])) {
          result = false
        }
      }
      return result
    },
    fieldChange (fieldIndex) {
      if (this.selNode.data.fieldSet[fieldIndex].eventType) {
        if (this.selNode.data.fieldSet[fieldIndex].eventType === 'internal') {
          this[this.selNode.data.fieldSet[fieldIndex].enventName]()
        } else {
          this.$emit(this.selNode.data.fieldSet[fieldIndex].enventName, this.selNode)
        }
      }
      if (this.selNode.data.fieldSet[fieldIndex].destination === 'portsOut') {
        const portsOut = {}
        this.selNode.data[this.selNode.data.fieldSet[fieldIndex].field].forEach((element) => {
          portsOut[element] = element
        })
        portsOut.default = 'default'
        this.selNode.portsOut = portsOut
      }
    },
    setType () {
      if (this.selNode.data.type === 'Endpoint') {
        this.selNode.data.icon = 'mdi-access-point-network'
      } else if (this.selNode.data.type === 'Programado') {
        this.selNode.data.icon = 'mdi-clock-outline'
      } else if (this.selNode.data.type === 'Formulario') {
        this.selNode.data.icon = 'mdi-form-select'
      }
    }
  }
}
</script>
