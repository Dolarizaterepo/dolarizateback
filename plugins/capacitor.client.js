import { Camera, CameraResultType } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Filesystem } from '@capacitor/filesystem';

export default function ({ app }, inject) {
  inject('CapacitorCamera', Camera);
  inject('CapacitorCameraResultType', CameraResultType);
  inject('CapacitorFileSystem', Filesystem);
  defineCustomElements(window);
}
