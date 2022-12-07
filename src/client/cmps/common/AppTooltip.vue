<template>
  <section class="app-tooltip">
    <!-- <img  :src="require('@/assets/tooltip.svg')" alt="" /> -->
    <div ref="elImg" @click="handleHover($event)">
      <slot name="preview"></slot>
    </div>
    <!-- <div ref="elMsg" class="msg">{{ $t(msg) }}</div> -->
    <div v-show="isShown" ref="elMsg" class="msg">
      <div @click="toggleClose" class="close-btn">
        <close-icon class="black" :size="16" title="" />
      </div>

      <slot name="content"></slot>
    </div>
  </section>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close';
// import { eventBus } from '@/cms/services/eventBus.service';

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
    // eventBus.$on('tooltip-open', () => {
    //   this.isShown = false;
    //   console.log('WTF', this.isShown);
    // });
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
    //   console.log('isMobile', this.isMobile);

    //   if (!this.isMobile) style[posXStyleProp] = pos.x + 'px';
    //   else {
    //     style[posXStyleProp] = '50%';
    //     style.transform = 'translateX(-50%)';
    //   }
    //   console.log(style[posYStyleProp], pos.y + 'px');

    //   style[posYStyleProp] = pos.y + 'px';
    // },
    handleHover(ev) {
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
        const elImgPos = getElPosOnScreen(elImg);
        // let diff = screenWidth - elImgPos.x;
        style[posXStyleProp] = screenWidth / 2 - elImgPos.x + 'px';
        // style[posXStyleProp] = imgWidth / 2 + (screenWidth / 2 - elImgPos.x) + 'px';
        // style[posXStyleProp] = screenWidth / 2 - diff + imgWidth / 2 + 'px';

        style.transform = 'translateX(-50%)';
      }

      function getElPosOnScreen(el) {
        const pos = { y: 0, x: 0 };
        if (!el) return pos;
        let _el = el;
        while (_el.tagName !== 'BODY') {
          pos.y += _el.offsetTop;
          pos.x += _el.offsetLeft;
          _el = _el.offsetParent;
        }
        return pos;
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

  .close-btn {
    position: absolute;
    top: 24px;
    right: 20px;
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
