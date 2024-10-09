<template>
  <master-modal
    v-model="showModal"
    @hide="resetModal()"
    :title="log ? `Log - ID: ${log.id}` : ''"
    :loading="loading"
  >
    <div v-if="!!log">
      <section>
        <!--Message-->
        <label class="text-grey-7 q-mr-xs">{{ $tr('isite.cms.label.message') }}:</label> {{ log.message }}
        <!--Type-->
        <div>
          <label class="text-grey-7 q-mr-xs">{{ $tr('isite.cms.form.type') }}:</label> {{ log.type }}
        </div>
        <!--Created-->
        <div>
          <label class="text-grey-7 q-mr-xs">{{ $tr('isite.cms.form.createdAt') }}:</label> {{ $trd(log.dateCreated, {type: "long"}) }}
        </div>
        <!--Strack Trace-->
        <div style="word-wrap: break-word" v-if="!!log.stackTrace">
          <label class="text-grey-7 q-mr-xs">{{ $tr('isite.cms.label.stackTrace') }}:</label>
          <p>{{ log.stackTrace }}</p>
        </div>
      </section>

    </div>
  </master-modal>
</template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid(),
      showModal: false,
      log: null,
      loading: false
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.logs',
        //permission: 'isite.logs.index',
        create: false,
        read: {
          columns: [
            { name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id' },
            {
              name: 'message', label: 'Message', field: 'message',
              align: 'left', sortable: true,
              action: (col) => this.openModal(col)
            },
            {
              name: 'user_id', label: 'User Id',
              field: 'user_id', align: 'left', sortable: true
            },
          ],
          filters: {
            userId: {
              value: null,
              type: 'select',
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: { label: 'fullName', id: 'id' }
              },
              props: {
                label: `${this.$tr('iprofile.cms.sidebar.adminUserIndex')}:`,
                clearable: true
              }
            },
          }
        },
        update: false,
        delete: false,
        formLeft: {},
        formRight: {}
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    resetModal() {
      this.showModal = false;
      this.log = null;
    },
    //Open Modal
    openModal(log) {
      this.showModal = true;
      console.warn({ log })
      this.log = log
    }
  }
}
</script>
