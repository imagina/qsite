<template>
  <div class="row">
    <section id="panel-editor-component" class="full-width">
      <draggable class="row q-col-gutter-lg q-pb-md" v-model="items" :group="{ name: 'items' }"
                 @input="updateSortOrder">
        <div :class="element[gridPosField]" v-for="element in items" :key="element.id">
          <div :class="`panel-editor-component__component ${verifyKeys(element,childsFieldName) ? 'hasChild' : ''}`">
            <div class="absolute-right q-ma-sm">
              <div class="row q-gutter-xs">
                <!--Actions-->
                <q-btn v-for="(action, actIndex) in actions" :key="actIndex" :icon="action.icon"
                       v-bind="actionButtonProps" @click="action.action(element)">
                  <q-tooltip>{{ action.label }}</q-tooltip>
                </q-btn>
                <!--Grid position action-->
                <q-btn v-if="verifyKeys(element,gridPosField)" v-bind="actionButtonProps">
                  <q-popup-edit
                      v-model="element[gridPosField]"
                      :title="element[titleField]"
                      buttons
                      :label-set="$tr('isite.cms.label.save')"
                      :label-cancel="$tr('isite.cms.label.cancel')"
                      v-slot="scope"
                      @save="() => saveGrid()"
                  >
                    <dynamic-field v-model="scope.value"
                                   :field="{type: 'input', props: {autofocus : true, label: $tr('isite.cms.label.gridPosition')}}"/>
                  </q-popup-edit>
                  <q-tooltip>{{ $tr('isite.cms.label.gridPosition') }}</q-tooltip>
                </q-btn>
              </div>
            </div>
            <p>{{ element[titleField] }}</p>
            <q-btn v-if="canAddNewItem" class="add-btn" unelevated no-caps rounded color="cyan"
                   @click="addItem(element)">
              <div class="row items-center no-wrap">
                <q-icon left name="fa-regular fa-grid-2-plus" size="xs"/>
                <div class="text-center">
                  Añadir
                </div>
              </div>
            </q-btn>

            <div v-if="verifyKeys(element,childsFieldName)" class="full-width q-px-md">
              <handle-grid v-model="element[childsFieldName]" v-bind="childProps" @input="updateSortOrder"
                @create="(val) => addedChildItem(val.index, element.id, val)" ref="refHandleGrid"/>
            </div>

          </div>
        </div>
      </draggable>
      <div v-if="canAddNewItem && value.length == 0" class="add-new-item" @click="addItem()">
        <div class="text-center q-pa-lg">
          <q-icon name="fa-regular fa-grid-2-plus" size="60px" color="warning"/>
          <div class="q-mt-md text-h5 text-blue-grey">Añade un nuevo item</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import {defineComponent} from 'vue'
import controller from "modules/qsite/_components/v3/handleGrid/controller";
//components
import draggable from 'vuedraggable'

export default defineComponent({
  name: "handleGrid",
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
    },
    canAddNewItem: {
      type: Boolean,
      default: false
    },
    actions: {type: Object, default: () => ({})},
    childsFieldName: { type: String, default: ''},
    childProps: {type: Object, default: () => {}}
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
#panel-editor-component
  margin: 0 auto;
  padding 10px
  background-color: white;
  border-radius: 10px;
  //border: 1px solid #ccc;

  .hasChild
    padding 20px
    min-height: 120px;

  .panel-editor-component__component
    position relative;
    user-select: none;
    cursor: pointer;
    min-height: 100px;
    display: flex;
    flex-direction column
    align-items: center;
    justify-content: center;
    border: dashed 3px $blue-grey;

    .add-btn
      position absolute;
      bottom: 0%;
      left: 50%;
      transform: translate(-50%, 50%);

  .add-new-item
    display grid;
    place-content center;
    height 100%;
    cursor pointer;
</style>
