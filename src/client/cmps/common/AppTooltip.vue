<template>
  <section class="app-tooltip">
    <!-- <img  :src="require('@/assets/tooltip.svg')" alt="" /> -->
    <div ref="elImg" @click="handleHover($event)">
      <slot name="preview"></slot>
    </div>
    <!-- <div ref="elMsg" class="msg">{{ $t(msg) }}</div> -->
    <div v-show="isShown" ref="elMsg" class="msg">
      <div @click="toggleClose" class="close-btn-tooltip">
        <close-icon class="black" :size="16" title="" />
      </div>

      <slot name="content"></slot>
    </div>
  </section>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close';
import { eventBus } from '@/cms/services/eventBus.service';

import { utilService } from '@/cms/services/util.service';

export default {
  name: 'Tooltip',
  props: {
    attachToElement: {
      type: String,
      required: false,
      default: 'body'
    }
  },
  data() {
    return {
      isShown: false
    };
  },
  components: {
    CloseIcon
  },
  created() {
    eventBus.$on('tooltip-open', () => {
      this.isShown = false;
    });
  },
  methods: {
    toggleClose() {
      this.isShown = false;
    },
    // handleHover(ev) {
    //   eventBus.$emit('tooltip-open');
    //   this.isShown = true;
    //   const { elMsg } = this.$refs;
    //   // const { offsetWidth: imgWidth, offsetHeight: imgHeight } = elImg;
    //   const { offsetWidth: msgWidth, offsetHeight: msgHeight } = elMsg;
    //   const { offsetWidth: windowWidth, offsetHeight: windowHeight } = document.querySelector(this.attachToElement);

    //   const { clientX, clientY } = ev;

    //   let pos = ev.offsetX ? { x: ev.pageX, y: ev.pageY } : { x: ev.changedTouches[0].pageX, y: ev.changedTouches[0].pageY };

    //   let posXStyleProp = this.isMobile ? 'left' : windowWidth - clientX < msgWidth ? 'right' : 'left';

    //   let posYStyleProp = windowHeight - clientY < msgHeight ? 'bottom' : 'top';

    //   const { style } = elMsg;
    //   style.left = style.right = style.bottom = style.top = '';

    //   if (!this.isMobile) style[posXStyleProp] = pos.x + 'px';
    //   else {
    //     style[posXStyleProp] = '50%';
    //     style.transform = 'translateX(-50%)';
    //   }

    //   style[posYStyleProp] = pos.y + 'px';
    // },
    handleHover(ev) {
      eventBus.$emit('tooltip-open');
      this.isShown = true;

      const { elImg, elMsg } = this.$refs;
      const { offsetWidth: imgWidth, offsetHeight: imgHeight } = elImg;
      const { offsetWidth: msgWidth, offsetHeight: msgHeight } = elMsg;
      const { offsetWidth: windowWidth, offsetHeight: windowHeight } = document.querySelector(this.attachToElement);

      const { clientX, clientY } = ev;
      let posXStyleProp = this.isMobile ? 'left' : windowWidth - clientX < msgWidth ? 'right' : 'left';

      let posYStyleProp = windowHeight - clientY < msgHeight ? 'bottom' : 'top';

      const { style } = elMsg;
      style.left = style.right = style.bottom = style.top = '';

      style[posYStyleProp] = imgHeight / 2 + 'px';

      if (!this.isMobile) {
        style[posXStyleProp] = imgWidth / 2 + 'px';
      } else {
        const screenWidth = window.innerWidth;
        const elImgPos = utilService.getElPosOnScreen(elImg);
        // let diff = screenWidth - elImgPos.x;
        style[posXStyleProp] = screenWidth / 2 - elImgPos.x + 'px';
        // style[posXStyleProp] = imgWidth / 2 + (screenWidth / 2 - elImgPos.x) + 'px';
        // style[posXStyleProp] = screenWidth / 2 - diff + imgWidth / 2 + 'px';

        style.transform = 'translateX(-50%)';
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.isScreenNarrow;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-tooltip {
  position: relative;
  width: 50%;

  .close-btn-tooltip {
    position: absolute;
    // top: 24px;
    // right: 20px;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 5;
  }

  .msg {
    position: absolute;
    line-height: 1.3;
    background-color: white;
    z-index: 5;
  }
}
</style>
