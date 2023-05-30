<template>
  <div class="modal-container" @click.stop="">
    <div class="blure" @touchstart.stop="" @touchend.stop=""></div>
    <div class="modal">
      <!-- <img class="preview" :src="require('@/assets/images/loader.gif')"> -->
      <Loader class="preview"/>
    </div>
  </div>
</template>

<script>
import Loader from './icons/Loader.vue'
export default {
  components: { Loader },
  name: 'BluredLoader'
}
</script>

<style lang="scss" scoped>
.modal-container {
  position: fixed;
  z-index: 30;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  .blure {
    position: absolute;
    z-index: 30;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0.1);
  }
  .modal {
    position: absolute;
    z-index: 30;
    top: 50%;
    left: 50%;
    width: fit-content;
    height: fit-content;
    transform: translate(-50%, -50%);
  }
  &:hover {
    pointer-events: none;
  }
  .preview {
    text-align: center;
    width: 150px;
    height: 150px;
    &.width-all {
      width: 100%;
      width: 100vw;
      height: auto;
      line-height: 2rem;
      .inner-loader {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>