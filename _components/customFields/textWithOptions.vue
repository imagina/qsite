<template>
  <div class="full-width">
    <div class="q-caption text-grey">{{label}}</div>
    <div class="row gutter-xs">
      <div class="col-12 col-md-3">
        <q-select
            clearable
            :label="$tr('ui.form.type')"
            outlined dense emit-value map-options
            :options="options"
            v-model="item.type"
            @input="vEmit"
        />
      </div>
      <div class="col-12 col-md-9">
        <q-input
            outlined dense
            :label="$tr('ui.label.value')"
            autocomplete="false"
            v-model="item.value"
            @input="vEmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "textWithOptions",
    props: ['value','label','options'],
    components: {},
    watch: {
      value(){
        this.item = JSON.parse(JSON.stringify(this.value))
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.item = JSON.parse(JSON.stringify(this.value))
      })
    },
    data() {
      return {
        item:{
          type: '',
          value: ''
        }
      }
    },
    methods:{
      vEmit(){
        this.$emit('input',this.item)
      }
    }
}
</script>

<style scoped>

</style>
