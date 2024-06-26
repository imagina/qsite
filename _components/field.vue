<template>
  <div id="siteField" class="q-my-xs">
    <q-input
      v-if="['select', 'select-multi',
        'text-multi','text-multi-with-options',
        'file','color','checkbox',
        'checkbox-multi-with-options','checkbox-multi'].indexOf(setting.type) < 0 && !setting.custom"
      autocomplete="false"
      outlined dense
      @update:modelValue="emitValue()"
      v-model="vModel"
      :type="setting.type"
      :label="label"
      :rows="setting.type=='textarea' ? 3 : ''"/>

    <text-multi
      v-if="['text-multi', 'text-multi-with-options'].indexOf(setting.type) >= 0"
      class="q-my-sm"
      @update:modelValue="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :input="setting.input"
      :options="setting.type == 'text-multi-with-options' ? setting.options : []"
    />

    <checkbox-multi
      v-if="['checkbox-multi', 'checkbox-multi-with-options'].indexOf(setting.type) >= 0"
      class="q-my-sm"
      @update:modelValue="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :checkboxLabel="setting.checkboxLabel"
      :input="setting.input"
      :options="setting.type == 'checkbox-multi-with-options' ? setting.options : []"
    />

    <register-extra-fields
      v-if="setting.type === 'register-extra-fields'"
      class="q-my-sm"
      @update:modelValue="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :input="setting.input"
      :setting="setting"
    />

    <address-extra-fields
      v-if="setting.type === 'address-extra-fields'"
      class="q-my-sm"
      @update:modelValue="emitValue()"
      v-model="vModel"
      :label="label"
      :type="setting.type"
      :input="setting.input"
      :setting="setting"
    />

    <div class="q-caption text-grey"
         v-if="['select', 'select-multi'].indexOf(setting.type) >= 0">
      {{label}}
    </div>

    <tree-select
      v-if="['select', 'select-multi'].indexOf(setting.type) >= 0"
      :multiple="setting.type === 'select-multi'"
      :options="options"
      :value-consists-of="setting.valueCconsistsOf ? setting.valueCconsistsOf : 'LEAF_PRIORITY'"
      @update:modelValue="emitValue()"
      v-model="vModel"
      :placeholder="label"
    />

    <q-input v-if="setting.type == 'color'" outlined dense v-model="vModel"
             :label="label" @update:modelValue="emitValue()">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-color v-model="vModel"/>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <media-form
      v-if="setting.type == 'file'"
      entity="Modules\Setting\Entities\Setting"
      :zone="setting.name"
      @update:modelValue="emitValue()"
      v-model="vModel.medias_single"
      :entity-id="setting.id ? setting.id : ''"
      :label="label"
    />

    <q-editor
      v-if="setting.type == 'wysiwyg'"
      :label="label"
      v-model="vModel"
      @update:modelValue="emitValue()"
    />

    <q-checkbox
      v-if="setting.type == 'checkbox'"
      @update:modelValue="emitValue()"
      v-model="vModel"
      :label="label" class="q-my-sm"/>
  </div>
</template>
<script>

  /*Components*/
  import mediaForm from 'modules/qmedia/_components/form'
  import textMulti from 'modules/qsite/_components/customFields/textMulti'
  import checkboxMulti from 'modules/qsite/_components/customFields/checkboxMulti'
  import registerExtraFields from 'modules/qsite/_components/customFields/registerExtraFields'
  import addressExtraFields from 'modules/qsite/_components/customFields/addressExtraFields'

  export default {
    props: ['setting', 'label'],
    emits: ['update:modelValue'],
    components: {
      mediaForm,
      textMulti,
      checkboxMulti,
      registerExtraFields,
      addressExtraFields

    },
    computed: {
      options () {
        let name = this.setting.name.split('::')[1]
        let options = []
        switch (name) {
          case 'template':
            options = this.$store.getters['qsiteApp/availableThemesTreeSelect']
            break
          case 'locales':
            options = this.$store.getters['qsiteApp/availableLocalesTreeSelect']
            break
          default:
            if (this.setting.options) {
              options = this.setting.options
            }
            break
        }

        return options
      }
    },
    watch: {
      modelValue (newValue) {
        this.vModel = JSON.parse(JSON.stringify(newValue))
      }
    },
    created () {
      this.$nextTick(function () {

      })
    },
    data () {
      return {
        vModel: this.$attrs.value
      }
    },
    methods: {
      emitValue () {
        this.$emit('update:modelValue', this.vModel)
      },

    }

  }
</script>
<style lang="scss">
</style>
