<template>
  <div>
    <master-modal
      v-model="modal.show"
      @hide="resetModal()"
      :loading="modal.loading"
      :title="modal.title"
      persistent
      hideCloseAction
      customClass="wizard-modal"
    >
      <div class="content-modal">
        <div class="tw-text-md md:tw-text-md text-center tw-font-semibold tw-p-4 text-blue-grey"
            v-html="$tr('isite.cms.message.recordModalMessage')">
        </div>
        <div class="text-center tw-mt-6">
        <q-btn  rounded
                class="tw-text-center"
                no-caps
                color="primary"
                size="md"
                outline
                @click="go()">
          {{ $tr('isite.cms.label.continue') }}
        </q-btn>
        </div>
      </div>
    </master-modal>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      loading: false,
      modal: {
        title: null,
        show: false,
        loading: false,
      },
    };
  },
  provide() {
    return {};
  },
  computed: {},
  methods: {
    //Reset Modal
    resetModal() {
      this.modal = { show: false, loading: false };
    },
    async showModalWizard() {
      this.modal = {
        title: this.$tr('isite.cms.message.recordModalTitle'),
        show: true,
        loading: false,
      };
    },
    go() {
      this.$emit('message');
    }
  },
};
</script>

<style>
.wizard-modal {
  background: -webkit-linear-gradient(bottom, #fff, #e4e2f2);
}
.wizard-modal .master-dialog__header  {
  justify-content: center !important;
  background: transparent;
  font-size: 18px;
}
.wizard-modal .content-modal p:not(:last-child) {
  margin-bottom: 10px;
}
</style>
