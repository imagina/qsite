<template>
  <div class="row">
    <section id="panel-editor-component" class="full-width">
      <draggable class="row q-col-gutter-md" v-model="orderedItems" group="components" @update="updateSortOrder">
        <div :class="element[gridPosField]" v-for="element in orderedItems" :key="element.id">
          <div class="panel-editor-component__component">
            <div class="absolute-right q-ma-sm">
              <q-btn v-if="element[gridPosField]" icon="fa-regular fa-objects-column" outline round color="cyan" size="10px">
                <q-popup-edit
                    v-model="element[gridPosField]"
                    :title="element[titleField]"
                    buttons
                    :label-set="$tr('isite.cms.label.save')"
                    :label-cancel="$tr('isite.cms.label.cancel')"
                    v-slot="scope"
                >
                  <dynamic-field v-model="scope.value"
                                 :field="{type: 'input', props: {autofocus : true, label: $tr('isite.cms.label.gridPosition')}}"/>
                </q-popup-edit>
                <q-tooltip>{{$tr('isite.cms.label.gridPosition')}}</q-tooltip>
              </q-btn>
            </div>
            {{ element[titleField] }}
          </div>
          <!--<button @click="addItem(element)">Añade un bloque</button>-->
        </div>
      </draggable>
    </section>
  </div>
</template>
<script>
import {defineComponent} from 'vue'
import controller from "@imagina/qsite/_components/v3/handleGrid/controller";
//components
import draggable from 'vuedraggable'

export default defineComponent({
  name: "Panel",
  props: {
    value: {
      type: Array,
      default: []
    },
    orderBy: {
      type: String,
      default: null
    },
    gridPosField: {
      type: String,
      default: 'gridPosition'
    },
    titleField: {
      type: String,
      default: 'title'
    }
  },
  components: {
    draggable
  },
  setup(props, {emit}) {
    return {...controller(props, emit)}
  }
})
</script>
<style lang="stylus">
#panel-editor-component
  margin: 0 auto;
  padding 10px
  min-height: 80vh;
  background-color: white;
  border-radius: 10px;
  //border: 1px solid #ccc;

  .panel-editor-component__component
    position relative;
    user-select: none;
    cursor: pointer;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: dashed 3px $blue-grey;
</style>
