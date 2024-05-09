<template>
  <q-btn 
    size="xs"
    :style="btnStyle"
    round :color="defaultColor"
    icon="fa-solid fa-info"
    style="z-index: 4"
    unelevated
  >
    <q-menu 
      class="
        tw-rounded-2xl
        tw-shadow-2xl
        tw-p-5
      "
    >
      <!--Icon and title-->
      <div 
        v-if="title"
        class="
          tw-flex
          tw-items-center
          tw-justify-between
          tw-mb-2.5
        "
      >
        <section 
          class="
            tw-flex
            tw-flex-row
            tw-items-center
          "
        >
          <q-icon 
            :name="icon || defaultIcon" 
            :color="defaultColor" 
            size="20px" 
            class="tw-mr-2.5"
          />
          <h3 
            class="
              tw-text-base
              tw-font-semibold
            "
          >
            {{ title }}
          </h3>
        </section>
        <!--Close actions-->
        <q-btn 
          icon="fas fa-times" 
          v-close-popup color="blue-grey" 
          size="8px" unelevated
          round flat
        />
      </div>
      <!--description-->
      <div
        class="
          tw-flex
          tw-flex-row
          tw-items-start
          tw-justify-between
        "
      >
        <q-icon
          v-if="!title"
          :name="icon || defaultIcon" 
          :color="defaultColor" 
          size="20px" 
          class="tw-mr-2.5 tw-mt-1"
        />
        <p class="tw-max-w-80">
          {{ description }}
        </p>
        <q-btn
          v-if="!title"
          icon="fas fa-times" 
          v-close-popup color="blue-grey" 
          size="8px" unelevated
          round flat
        />
      </div>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  props: {
    icon: {default: null},
    title: {type: String, default: null, required: true},
    description: {type: String, required: true},
    btnStyle: {type: String, default: ''}
  },
  data() {
    return {
      defaultIcon: 'fa-solid fa-circle-info',
      defaultColor: 'info'
    }
  },
}
</script>
<style lang="scss">
</style>
