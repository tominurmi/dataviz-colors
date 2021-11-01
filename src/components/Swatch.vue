<template>
  <div class="rounded-8 relative" :class="swatchClasses" :style="swatchStyle">
    <div class="flex flex-col">
      <p class="text-14 font-bold p-8 mb-0 cursor-pointer" @click="setWcag" @mouseover="showWcagText = true" @mouseleave="showWcagText = false">{{ showWcagText ? '✓ WCAG' : weight }}</p>
      <p class="text-12 p-8 mb-0 select-all">{{ hex }}</p>
    </div>
    <p class="absolute text-12 top-8 m-0 right-8" :style="dotStyle">{{ ratingDots }}</p>
    <p class="text-12 p-8 pt-4 mb-0 absolute text-gray-500">{{ name }}</p>
  </div>
</template>

<script>
import { ref, inject, computed, nextTick } from 'vue'
import { hex, score } from 'wcag-contrast'

const sleep = n => new Promise(r => setTimeout(r, n))

const getIsDark = (c) => {
  var c = c.substring(1) // strip #
  var rgb = parseInt(c, 16) // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff // extract red
  var g = (rgb >> 8) & 0xff // extract green
  var b = (rgb >> 0) & 0xff // extract blue
  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
  if (luma < 150) return true
}

export default {
  name: 'Color',
  props: {
    hex: String,
    weight: String,
    name: String,
    group: Array,
    groupTitle: String
  },
  setup: (props) => {
    const wcag = inject('wcag')
    const showWcagText = ref(false)
    const resetWcag = () => wcag.value = {}
    const rating = computed(() => {
      if (!wcag.value.hex) return
      return score(hex(wcag.value.hex, props.hex))
    })
    const ratingDots = computed(() => {
      switch (rating.value) {
        case 'AA Large': return '•'
        case 'AA': return '••'
        case 'AAA': return '•••'
        default: return ''
      }
    })
    const swatchClasses = computed(() => ({
      'wcag-fail': rating.value === 'Fail',
    }))
    const dotStyle = computed(() => ({
      color: wcag.value
    }))
    const isDark = getIsDark(props.hex)
    const textColor = isDark ? props.group[0].hex : props.group[props.group.length - 1].hex
    const swatchStyle = {
      backgroundColor: props.hex,
      color: textColor
    }
    const setWcag = async () => {
      if (wcag.value.hex === props.hex) return resetWcag()
      else {
        const changingValues = !!wcag.value.hex
        resetWcag()
        if (changingValues) await sleep(300)
        wcag.value = { hex: props.hex, text: textColor, name: props.groupTitle.toLowerCase() + '-' + props.weight }
      }
    }

    return {
      wcag,
      setWcag,
      rating,
      swatchClasses,
      swatchStyle,
      ratingDots,
      dotStyle,
      isDark,
      showWcagText
    }
  }
}
</script>

<style>
/* .color { */
/*   backface-visibility: hidden; */
/*   will-change: transform, box-shadow; */
/* } */
/* /1* .color:hover { *1/ */
/* /1*   flex: 3; *1/ */
/* /1* } *1/ */
/* .color, .color * { */
/*   transition: 0.1s ease-in-out; */
/* } */
/* .color.wcag-fail:not(.wcag-active) { */
/*   opacity: 0.25; */
/*   filter: grayscale(1); */
/* } */
/* .color.wcag-fail .swatch { */
/*   box-shadow: none; */
/* } */
/* .color.wcag-active { */
/*   transform: scale(1.2); */
/*   transform-origin: center; */
/*   z-index: 1; */
/* } */
/* .color.wcag-active .swatch { */
/*   /1* box-shadow: 0 2px 6px 2px rgba(0,0,0,0.2); *1/ */
/* } */
.swatch {
  height: 72px;
  width: 100%;
}
.token {
  font-weight: 700;
}
.token, .hex {
  font-size: 14px;
  line-height: 14px;
}
.hex, .name {
  text-transform: uppercase;
}
.dots {
  font-size: 16px;
  font-weight: 700;
  margin-left: 8px;
}
.description {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr;
  align-items: center;
  height: 100%;
}
</style>
