<template>
  <div>
    <h2 class="text-primary tw-text-2xl tw-font-semibold tw-mb-4">
      Select a Report
    </h2>
    <div
      class="
        tw-flex
        tw-items-center
        tw-justify-end
        tw-bg-gray-100
        tw-rounded-xl
        tw-p-3
        tw-mb-3
      "
    >
      <div class="tw-hidden md:tw-block tw-border-r-2 tw-pr-4 tw-space-x-4">
        <q-btn flat rounded color="primary" no-caps class="tw-font-bold">
          <q-icon left size="1em" name="star" />
          <div>Add to Favourites</div>
        </q-btn>
        <q-btn outline rounded color="primary" no-caps class="tw-font-bold" @click="newFolder = true">
          <q-icon left size="1em" name="fa fa-plus" />
          <div>New Folder</div>
        </q-btn>
        <q-btn rounded color="negative" no-caps class="tw-font-bold">
          <q-icon left size="1em" name="fa-solid fa-trash-can" />
          <div>Delete</div>
        </q-btn>
      </div>
      <q-btn
        outline
        rounded
        size="md"
        padding="xs"
        color="primary"
        icon="fas fa-ellipsis-v"
        class="btn-small md:tw-hidden tw-order-1 md:tw-order-0"
      >
        <q-menu>
          <q-list class="list-report-menu">
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="star" color="primary" />
              </q-item-section>

              <q-item-section>Add to Favourites</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="newFolder = true">
              <q-item-section avatar>
                <q-icon name="fa fa-plus" color="primary" />
              </q-item-section>

              <q-item-section>New Folder</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="fa-solid fa-trash-can" color="primary" />
              </q-item-section>

              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <div class="tw-pl-0">
        <div class="tw-p-4 text-primary tw-order-0 md:tw-order-1">
          5 items selected
        </div>
      </div>
    </div>
    <q-dialog v-model="newFolder" persistent>
      <q-card class="dialog-card-report">
        <q-card-section class="tw-flex tw-items-center">
          <q-icon name="folder" color="primary" size="1.5rem" /> 
          <div class="tw-text-lg tw-pl-2 tw-font-bold">New Folder</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input outlined dense autofocus @keyup.enter="newFolder = false">
            <template v-slot:prepend>
              <q-icon name="folder_open" />
            </template>
            <template v-slot:append>
              <q-icon name="edit" color="primary" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat rounded size="md" label="Cancel" v-close-popup no-caps class="tw-px-3" />
          <q-btn rounded color="primary" label="Create" class="tw-px-3" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newFolder: false,
    };
  },
};
</script>
<style scope>
  .dialog-card-report {
    @apply tw-p-2 tw-rounded-xl !important;
    min-width: 350px;
  }
</style>