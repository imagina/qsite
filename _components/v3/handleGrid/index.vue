<template>
  <div class="row">
    <section id="panel-editor-component" class="full-width">
      <draggable :list="elements" class="row q-col-gutter-lg q-pb-md" :group="{ name: 'items' }" :item-key="`handleGrid${uId}`">
        <template #item="{ element }">
          <div :class="element[gridPosField]">
            <div :class="`panel-editor-component__component  ${verifyKeys(element,childsFieldName) ? 'hasChild' : ''}`">
              <div class="row wrap justify-between full-width q-px-sm">
                <p class="ellipsis">{{ element[titleField] }}</p>
                <div class="row q-gutter-xs">
                  <!--Actions-->
                  <q-btn v-for="(action, actIndex) in actions" :key="actIndex" v-bind="getActionsButtonProps(action)"
                         @click="action.action(element)">
                    <q-tooltip>{{ action.label }}</q-tooltip>
                  </q-btn>
                  <!--Grid position action-->
                  <q-btn v-if="verifyKeys(element,gridPosField)" v-bind="getActionsButtonProps()">
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
                    <q-tooltip>{{ $tr('isite.cms.label.gridPosition') }}</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <div v-if="verifyKeys(element,childsFieldName)" class="full-width q-px-xs">
                <handle-grid v-bind="$props" :elements="element[childsFieldName]" :parent="element"
                             @create="emitCreateElement"/>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <!--Actions-->
      <div v-if="canAddNewItem" class="full-width text-center">
        <q-separator class="q-my-md"/>
        <q-btn unelevated no-caps rounded color="cyan" @click="emitCreateElement()" outline class="full-width">
          <q-icon left name="fa-regular fa-grid-2-plus" size="xs"/>
          <p class="ellipsis text-center">{{ $tr('isite.cms.label.add') }}</p>
          <q-tooltip>{{ $tr('isite.cms.label.add') }}</q-tooltip>
        </q-btn>
      </div>
    </section>
  </div>
</template>
<script>
import {defineComponent} from 'vue'
import controller from "src/modules/qsite/_components/v3/handleGrid/controller";
//components
import draggable from 'vuedraggable'

export default defineComponent({
  name: "handleGrid",
  props: {
    elements: {
      type: Array,
      default: []
    },
    titleField: {
      type: String,
      default: 'title'
    },
    gridPosField: {
      type: String,
      default: 'gridPosition'
    },
    canAddNewItem: {
      type: Boolean,
      default: false
    },
    actions: {type: Object, default: () => ({})},
    childsFieldName: {type: String, default: 'children'},
    parent: {default: null}
  },
  components: {
    draggable
  },
  setup(props, {emit}) {
    return {...controller(props, emit)}
  }
})
</script>
<style lang="scss">
#panel-editor-component {
  margin: 0 auto;
  padding: 10px 5px;
  background-color: white;
  border-radius: 10px;;

  .hasChild {
    padding: 20px 5px;
  }

  .panel-editor-component__component {
    position: relative;
    user-select: none;
    cursor: pointer;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: dashed 3px $blue-grey;

    .actions-props {
      min-width: 150px;
    }
  }

  .add-new-item {
    height: 100%;
    cursor: pointer;
  }
}
</style>
