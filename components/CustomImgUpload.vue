<template>
    <div>
        <v-img
          :src="displayImg"
          aspect-ratio="1"
          :width="imgWidth"
          :height="imgHeight"
          contain
        />
        <v-file-input
            v-model="uploadedFile"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="Cargar imagen"
            type="file"
        ></v-file-input>
    </div>
</template>
<script>
export default {
  props: ['imagen', 'size'],
  data () {
    return {
      uploadedFile: null,
      fileBase64: null,
      imgWidth: 180,
      imgHeight: 180
    }
  },
  computed: {
    displayImg () {
      if (this.fileBase64 === null) {
        return this.imagen
      } else {
        return this.fileBase64
      }
    }
  },
  mounted () {
    if (this.size) {
      if (this.size.width) {
        this.imgWidth = this.size.width
      }
      if (this.size.height) {
        this.imgHeight = this.size.height
      }
    }
  },
  watch: {
    uploadedFile () {
      if (this.uploadedFile === null) {
        return null
      }

      const reader = new FileReader()

      reader.onload = function (e) {
        const canvas = document.createElement('CANVAS')
        canvas.width = this.imgWidth
        canvas.height = this.imgHeight
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, this.imgWidth, this.imgHeight)
        const img = new Image()
        img.addEventListener(
          'load',
          function () {
            let ratio = 0
            if (img.width < img.height) {
              if (img.height > this.imgHeight) {
                ratio = this.imgHeight / img.height
              }
            } else if (img.width > this.imgWidth) {
              ratio = this.imgWidth / img.width
            }

            context.drawImage(
              img,
              (this.imgWidth - img.width * ratio) / 2,
              (this.imgHeight - img.height * ratio) / 2,
              img.width * ratio,
              img.height * ratio
            )
            this.fileBase64 = canvas.toDataURL()
            this.imgSrc = canvas.toDataURL()
            const value = {
              fileName: this.uploadedFile.name,
              fileBase64: this.fileBase64,
              formField: 'uploadimg' + this._uid,
              file: this.uploadedFile
            }
            this.$emit('input', value)
            this.uploadedFile = null
          }.bind(this)
        )
        img.src = e.target.result
      }.bind(this)

      reader.readAsDataURL(this.uploadedFile)
    }
  }
}
</script>
