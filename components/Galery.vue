<template>
  <div>
    <v-slide-group
      v-model="images"
      class="py-4"
      show-arrows
      v-if="loaded"
    >
      <v-slide-item>
        <v-card
          class="mx-2"
          width="200"
          height="200"
          style="cursor: pointer;"
          @click="$refs.galeryUpload.click()"
        >
          <v-card-text class="d-flex align-center justify-center" style="min-height: 100%">
            <v-icon style="font-size: 4rem; ">mdi-plus-circle</v-icon>
          </v-card-text>
        </v-card>
      </v-slide-item>
      <v-slide-item
        v-for="item in items"
        :key="'slider-' + item.id"
        v-slot="{}"
      >
        <v-card class="mx-2">
          <v-img
            height="200"
            max-width="300"
            :src="item.image"
          >
            <div class="d-flex">
              <v-spacer />
              <v-dialog
                v-model="dialog"
                width="500"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="white"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Eliminar imagen
                  </v-card-title>

                  <v-card-text>
                    ¿Está seguro que quiere eliminar esta imagen?
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      No
                    </v-btn>
                    <v-btn
                      color="red"
                      text
                      @click="removeImage(item.id)"
                    >
                      Sí
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-img>
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <input
      type="file"
      v-show="false"
      ref="galeryUpload"
      accept="image/*"
      @input="uploadPhoto()"
    />
  </div>
</template>
<script>
export default {
  props: ['item', 'editable'],
  data () {
    return {
      loaded: true,
      images: [],
      items: [],
      dialog: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      await this.$axios
        .$post(
          'documents/galery/find',
          {
            entitytype: this.item.type,
            entityid: this.item.id
          },
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then((evtResponse) => {
          this.items = evtResponse.records
        })
    },
    async uploadPhoto () {
      await this.$axios
        .$post(
          'documents/galery/save',
          {
            entitytype: this.item.type,
            entityid: this.item.id
          },
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then((evtResponse) => {
          this.uploadFile(evtResponse.data)
        })
    },
    uploadFile (galeryId) {
      const formData = new FormData()

      formData.append('file', this.$refs.galeryUpload.files[0])
      formData.append('name', this.$refs.galeryUpload.files[0].name)
      formData.append('entityid', galeryId)
      formData.append('entitytype', 'galery')

      this.$axios
        .$post(
          'documents/documents/save',
          formData,
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then((evtResponse) => {
          this.getData()
        })
    },
    async removeImage (imageId) {
      this.dialog = false
      await this.$axios
        .$post(
          'documents/galery/delete',
          {
            id: imageId
          },
          {
            validateStatus (status) {
              return status < 500 // Resolve only if the status code is less than 500
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.state.token,
              'Content-Type': 'application/json'
            }
          }
        )
        .then((evtResponse) => {
          this.getData()
        })
    }
  }
}
</script>
