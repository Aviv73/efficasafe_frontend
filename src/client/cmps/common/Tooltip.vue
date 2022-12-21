<template>
  <component
    :is="wrapEl"
    class="tooltip-box"
    :tabindex="on === 'focus' ? '0' : '-1'"
    :class="{
      hoverable: on === 'hover',
      'tooltip-active': isActive,
      'stand-alone': standAlone
    }"
    ref="activator"
    @focus="onToggle(true)"
    @blur="onToggle(false)"
    @mousedown="toggleIsActive"
    @mouseenter="hoverToggle"
    @mouseleave="hoverToggle"
  >
    <transition name="fade">
      <aside
        v-if="!hidden"
        v-show="isActive"
        class="tooltip"
        ref="tooltip"
        :class="{
          fade: fade,
          'exceed-right': exceedsRight,
          'exceed-left': exceedsLeft,
          'exceed-x': exceedsX,
          'right-bottom': rightBottom,
          'right-top': rightTop,
          'bottom-left': bottomLeft,
          'right-top-corner': topRightCorner,
          'left-bottom-corner': leftBottomCorner,
          'left-top-corner': topLeftCorner,
          'center-bottom': centerBottom,
          'bottom-corner-left': bottomCornerLeft,
          'left-corner': left,
          bottom,
          top,
          right
        }"
        :style="{
          'transition-duration': duration + 's',
          'margin-top': offsetY + 'px',
          'margin-left': offsetX + 'px'
        }"
        @click.stop=""
      >
        <button class="tooltip-close-btn" v-if="closable" @click="isActive = false">
          <slot name="close-icon">&#10006;</slot>
        </button>
        <slot name="content" />
        <span class="txt" v-if="!$slots.content">
          {{ txt }}
        </span>
      </aside>
    </transition>
    <slot />
  </component>
</template>

<script>
export default {
  EV_sibling_toggle: 'ev-sibling-toggle',
  props: {
    on: {
      type: String,
      default: 'hover'
    },
    txt: {
      type: String,
      default: ''
    },
    fade: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 0.8
    },
    offsetX: {
      type: Number,
      default: 0
    },
    offsetY: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Boolean,
      default: false
    },
    bottomLeft: {
      type: Boolean,
      default: false
    },
    bottomCornerLeft: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    centerBottom: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    rightBottom: {
      type: Boolean,
      default: false
    },
    rightTop: {
      type: Boolean,
      default: false
    },
    topRightCorner: {
      type: Boolean,
      default: false
    },
    topLeftCorner: {
      type: Boolean,
      default: false
    },
    leftBottomCorner: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    wrapEl: {
      type: String,
      default: 'div'
    },
    standAlone: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false,
      exceedsRight: false,
      exceedsLeft: false,
      exceedsX: false,
      viewportWidth: 0
    };
  },
  methods: {
    hoverToggle() {
      if (this.on !== 'hover') return;
      this.isActive = !this.isActive;
    },
    toggleIsActive(ev) {
      if (this.hidden || this.on !== 'focus') return;
      const isClosing = ev.path.some(el => el.dataset && el.dataset.closeBtn);
      if (isClosing) return;
      this.isActive = !this.isActive;
    },
    onToggle(isActive) {
      if (this.hidden || this.on !== 'focus') return;

      this.checkIfInViewport();
      this.isActive = isActive;
    },
    checkIfInViewport() {
      const { activator, tooltip } = this.$refs;
      const { right, left } = activator.getBoundingClientRect();
      const { width } = tooltip.getBoundingClientRect();
      let isExceedsRight = false;
      let isExceedsLeft = false;

      const rightMargin = right + width;
      const leftMargin = left - width;

      if (rightMargin > this.viewportWidth && leftMargin < 0) {
        this.exceedsX = true;
        return;
      } else if (rightMargin > this.viewportWidth) {
        isExceedsRight = true;
      } else if (leftMargin < 0) {
        isExceedsLeft = true;
      }
      this.exceedsRight = isExceedsRight;
      this.exceedsLeft = isExceedsLeft;
    }
  },
  mounted() {
    this.viewportWidth = window.innerWidth;
    const el = this.$refs.activator.querySelector('.hover-activator');
    if (!el) return;
    el.addEventListener('mouseenter', () => {
      this.onToggle(true);
    });
    el.addEventListener('mouseleave', () => {
      if (this.$refs.activator === document.activeElement) return;
      this.onToggle(false);
    });
  },
  beforeDestroy() {
    const el = this.$refs.activator.querySelector('.hover-activator');
    if (!el) return;
    el.removeEventListener('mouseenter', () => {
      this.onToggle(true);
    });
    el.removeEventListener('mouseleave', () => {
      if (this.$refs.activator === document.activeElement) return;
      this.onToggle(false);
    });
  }
};
</script>

<style lang="scss" scoped>
.tooltip-box {
  position: relative;
  display: inline-block;
  opacity: initial;
  color: initial;
  &:focus {
    outline: none;
  }

  &.tooltip-active {
    .activator {
      background-color: darken(white, 5%);
    }
  }
  &.stand-alone {
    display: block;
  }

  @media not all and (pointer: coarse) {
    .activator:hover {
      background-color: darken(white, 5%);
    }
  }
}
.tooltip {
  position: absolute;
  width: max-content;
  z-index: 999;

  &.right-top-corner {
    left: 16px;
    bottom: 18px;
  }
  &.left-corner {
top: 78%;
    width: 100%;
    right: 141px;
        padding: 15px;
    @media  (max-width: 768px) {
    top: -14%;
    right: 152px;
    width: 100%;
        padding: 0;

    
  }
  }

  &.left-bottom-corner {
    top: 100%;
    right: 50%;
  }
  &.bottom-corner-left {
    top: 100%;
    right: 0px;
  }
  &.left-top-corner {
    transform: translate(-194px, -70px);
  }

  &.fade {
    transition-property: opacity;
    transition-timing-function: ease;
  }
  &.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);

    &-left {
      top: 100%;
      right: -110px;
      transform: none;
    }
  }
  &.top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  &.center-bottom {
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%, -50%);
  }
  &.left {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);

    &.exceed-right {
      left: unset;
      right: 100%;
      transform: translateY(-50%);
    }
    // &.exceed-x {
    //     top: 100%;
    //     right: unset;
    //     left: 50%;
    //     transform: translateX(-50%);
    // }
  }
  &.right {
    right: 125%;
    top: 50%;
    transform: translateY(-50%);

    &-bottom {
      top: 70%;
      left: 50%;
    }
    &-top {
      right: 0;
      bottom: 0;
      top: auto;
      transform: translateY(-1.25rem);
    }
    &.exceed-left {
      right: unset;
      left: 100%;
      transform: translateY(-50%);
    }
    &.exceed-x {
      top: 100%;
      right: unset;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .tooltip-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #c1c1c1;
    z-index: 2;
    cursor: pointer;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
