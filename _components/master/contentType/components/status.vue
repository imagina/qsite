<template>
  <div class="grid grid-rows-2">
    <div v-if="icon">
      <i  
        :class="icon" 
        :style="{ 'color' : iconColor}"
        style="font-size: 20px;"
      />
    </div>
    <div class="ellipsis">
      {{ label }}
    </div>    
  </div>  
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: { default: null },
    color: { default: null },
    icon: { default: null },
  },
  computed: {
    getStyle(){
      return this.color ? this.color : '#000000'
    },
    iconColor() {
      return this.color ? this.color : '#000000'
    },
    textColor() {
      return this.color ? '#ffffff' : '#000000'
    }
  }
})
</script>
<style lang="scss"></style>
