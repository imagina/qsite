<template>
  <div id="fileListComponent">
    <!--Table-->
    <q-table :rows="tableData" :columns="tableColumns" v-model:pagination="table.pagination" :grid="table.grid"
             :hide-pagination="!allowPagination" :rows-per-page-options="table.rowsPerPageOptions" dropdown-icon="fa"
             @request="getDataTable" :loading="loading" hide-no-data :hide-header="hideHeader">
      <!---Top content-->
      <template v-slot:top v-if="!hideHeader">
        <div id="tableTopContent" class="row items-center justify-between full-width">
          <!--Left content-->
          <div class="text-blue-grey text-subtitle1">
            <!---Title-->
            <q-icon v-if="icon" :name="icon" class="q-mr-sm" />
            <!---Title-->
            <b v-if="title">{{ title }}</b>
            <!--Counter-->
            <span v-if="allowCounter" class="q-ml-sm">({{ table.pagination.rowsNumber }})</span>
          </div>
          <!--Actions-->
          <div id="tableActions" class="row q-gutter-sm" v-if="!readonly">
            <!--customActions-->
            <template v-for="(item, itemKey) in actions">
              <q-btn
                :key="itemKey"
                class="btn-small"
                v-bind="item"
                v-if="item?.vIf != undefined ? item?.vIf : true"
                @click="item.action()"
                no-caps
              >
                <q-tooltip v-if="item.tooltip">{{ item.tooltip }}.</q-tooltip>
              </q-btn>
            </template>
            <!--Order-->
            <q-btn v-if="allowOrder" class="btn-small" round unelevated outline color="blue-grey"
                   :icon="`fas fa-arrow-${table.filter.order.way == 'asc' ? 'up' : 'down'}`" @click="toggleOrder()">
              <q-tooltip>{{ $tr('isite.cms.label.order') }} {{ table.filter.order.way }}.</q-tooltip>
            </q-btn>
            <!--toogle view-->
            <q-btn v-if="allowChangeView" :icon="table.grid ? 'fas fa-grip-horizontal' : 'fas fa-list-ul'"
                   class="btn-small" @click="table.grid = !table.grid" round unelevated outline color="blue-grey">
              <q-tooltip>{{ $tr(`isite.cms.message.${table.grid ? 'gribView' : 'listView'}`) }}</q-tooltip>
            </q-btn>
          </div>
        </div>
        <!--Separator-->
        <div class="full-width q-mt-sm" v-if="title">
          <q-separator />
        </div>
      </template>
      <!--Custom Grid-->
      <template v-slot:item="props">
        <div class="col-12" v-if="props.rowIndex == firstIndexTableData">
          <!--Loop every items and set as dragabble-->
          <draggable
            v-model="table.data"
            :group="{ name: 'bocksBlocks' }"
            :disabled="!draggable"
            class="row"
            item-key="id"
            handle=".drag-handle">
            <!-- Files -->
            <template #item="{element}">
              <div :class="`${gridColClass} q-pa-xs`">

                <!---Card-->
                <div v-if="gridType == 'card'"
                     :class="`file-card cursor-pointer ${isSelected(element.filename)}`"
                >
                  <!--Image Preview-->
                  <!--select file-->
                  <div class="tw-absolute tw-left-0">
                    <q-checkbox v-if="allowSelect"
                                v-model="table.selected"
                                :val="element.filename"
                                :class="`${table.selected.includes(element.filename) ? '' : (isDesktop ? 'showOnHover' : '') }`"
                                color="primary"
                                keep-color
                                checked-icon="fa-solid fa-circle-check"
                                unchecked-icon="fa-light fa-circle"
                                size="lg"
                    />
                  </div>
                  <div class="tw-absolute tw-left-0 tw-bottom-20 text-blue-grey">
                    <q-btn
                      class="q-ml-sm "
                      :class="{'showOnHover' : isDesktop}"
                      @click="fileAction(element)"
                      icon="fa-light fa-eye"
                      :label="$tr('isite.cms.label.quickLook')"
                      size="sm"
                      dense
                      rounded
                      no-caps
                      unelevated
                      style="border: 1px solid teal;background: white; font-size: 12px;z-index: 10"
                    />
                  </div>
                  <div class="tw-absolute tw-right-0" :class="{'showOnHover' : isDesktop}">
                    <q-btn
                      round
                      color="primary"
                      icon="fa-light fa-file-arrow-down"
                      size="sm"
                      @click="downloadFile(element)"
                      class="q-ma-sm"
                    >
                      <q-tooltip>
                        {{ $tr('isite.cms.label.download') }}
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <div
                    v-if="element.isImage"
                    class="file-card_img img-as-bg"
                    :style="`background-image: url('${getImage(element)}')`"
                    @click="markAsSelected($event, element.filename)"
                  >
                    <!--Tooltip-->
                    <q-tooltip anchor="center middle" self="center middle" :delay="500">
                      {{ element.filename }}
                    </q-tooltip>
                  </div>
                  <!--Icon-->
                  <div
                    v-else
                    class="file-card_icon img-as-bg row items-center justify-center bg-white"
                    @click="markAsSelected($event, element.filename)"
                  >
                    <q-icon :name="element.icon" color="blue-grey" />
                    <!--Tooltip-->
                    <q-tooltip anchor="center middle" self="center middle" :delay="500">
                      {{ element.filename }}
                    </q-tooltip>
                  </div>
                  <!--Bottom content-->
                  <div class="file-card__bottom">
                    <!--Actions-->
                    <div v-if="!readonly" class="file-card__bottom_actions row items-center justify-between">
                      <div
                        :class="`full-width file-card__bottom_title ellipsis ${draggable ? 'drag-handle' : ''}`"
                        @click="markAsSelected($event, element.filename)"
                      >
                        <div class="q-pa-sm ellipsis">{{ element.filename }}</div>
                        <q-separator inset />
                      </div>
                      <!-- File id -->
                      <div
                        class="q-px-sm text-caption text-grey-9"
                        @click="markAsSelected($event, element.filename)"
                      >
                        <b>ID: {{ element.id }}</b>
                      </div>
                      <!--button Actions-->
                      <btn-menu class="float-right" :actions="itemActions" :action-data="element" />
                    </div>
                  </div>
                </div>
                <!--Chips-->
                <div v-else-if="gridType == 'chip'"
                     :class="`file-chip ${draggable ? 'drag-handle' : 'cursor-pointer'}`">
                  <!--Image Preview-->
                  <div v-if="element.isImage" class="file-chip__img img-as-bg" @click="fileAction(element)"
                       :style="`background-image: url('${getImage(element)}')`">
                  </div>
                  <!--Icon-->
                  <q-icon v-else :name="`fas fa-${element.isFolder ? 'fa-solid fa-folder' : 'fa-light fa-file'}`" class="file-chip__icon"
                          @click="fileAction(element)" />
                  <!--Title-->
                  <div class="file-chip__title ellipsis" @click="fileAction(element)">
                    {{ element.filename }}
                    <!--Tooltip-->
                    <q-tooltip anchor="center middle" self="center middle" :delay="500">
                      {{ element.filename }}
                    </q-tooltip>
                  </div>
                  <!--Actions-->
                  <div class="file-chip__actions">
                    <!--select file-->
                    <q-checkbox v-if="allowSelect" v-model="table.selected" :val="element.filename" color="green" />
                    <!--button Actions-->
                    <btn-menu class="" :actions="itemActions" :action-data="element" />
                  </div>
                </div>
              </div>
            </template>
            <!--Quantity files-->
            <template v-slot:footer>
                <template
                  v-for="itemNum in emptyQuantityFiles"
                  :key="`item${itemNum}`"
                >
                  <div
                    v-if="!readonly && quantity && (gridType == 'card')"
                    :class="`${gridColClass} q-pa-xs`"
                  >
                    <div
                      class="
                        file-item-quantity
                        row
                        items-center
                        justify-center
                      "
                      @click="$emit('emptyFileAction')"
                    >
                      <q-icon name="fas fa-photo-video" size="45px" />
                    </div>
                  </div>
                </template>
            </template>
          </draggable>
        </div>
      </template>
      <!--Custom columns-->
      <template v-slot:body-cell="props">
        <!--File Name-->
        <q-td v-if="props.col.name == 'filename'" :props="props" class="td-filename">
          <div @click="fileAction(props.row)" class="item-file row items-center cursor-pointer">
            <!--Icon-->
            <q-icon v-if="!props.row.isImage" :name="`fas fa-${props.row.isFolder ? 'fa-solid fa-folder' : 'fa-light fa-file'}`" />
            <!--Image-->
            <div class="file-image" v-else :style="`background-image: url('${getImage(props.row)}')`"></div>
            <!--Filename-->
            {{ props.value }}
          </div>
        </q-td>
        <!-- actions columns -->
        <q-td v-else-if="props.col.name == 'actions'" :props="props">
          <!--Actions-->
          <div class="file-card__bottom_actions">
            <!--button Actions-->
            <btn-menu class="" :actions="itemActions" :action-data="props.row" />
          </div>
        </q-td>
        <!-- selector -->
        <q-td v-else-if="props.col.name == 'selectColum'">
          <q-checkbox v-model="table.selected" :val="props.row.filename" color="green" />
        </q-td>
        <!--Default columns-->
        <q-td v-else :props="props" :title="props.value">
          {{ props.value }}
        </q-td>
      </template>
    </q-table>
    <!---No data-->
    <div v-if="!readonly && !tableData.length" class="row q-px-sm q-pb-sm">
      <template
        v-for="itemNum in emptyQuantityFiles"
        :key="`item${itemNum}`"
      >
        <div
          v-if="quantity && (gridType == 'card')"
          :class="`${gridColClass} q-pa-xs`"
        >
          <div
            class="
              file-item-quantity
              row
              items-center
              justify-center
            "
            @click="$emit('emptyFileAction')"
          >
            <q-icon name="fas fa-photo-video" size="45px" />
          </div>
        </div>
      </template>
    </div>
    <!--Image preview-->
    <avatar-image ref="avatarImage" no-preview />
    <!---MS Docs-->
    <master-modal v-model="modalDocs.show" :title="`${modalDocs.fileName}`" width="100%">
      <iframe
        :src="`https://view.officeapps.live.com/op/view.aspx?src=${modalDocs.src}`"
        width="100%" style="height: calc(100vh - 272px)"
      />
    </master-modal>
    <!---PDF preview-->
    <master-modal v-model="modalPdf.show" :title="`PDF | ${modalPdf.fileName}`" width="100%">
      <iframe :src="modalPdf.src" width="100%" style="height: calc(100vh - 272px)" />
    </master-modal>
    <!---Audio preview-->
    <master-modal v-model="modalAudio.show" :title="`Audio | ${modalAudio.fileName}`">
      <audio controls style="width: 100%">
        <source :src="modalAudio.src" type="audio/ogg">
        <source :src="modalAudio.src" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </master-modal>
    <!---Video preview-->
    <master-modal v-model="modalVideo.show" :title="`Video | ${modalVideo.fileName}`">
      <video width="100%" controls>
        <source :src="modalVideo.src" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </master-modal>
  </div>
</template>
<script>
//components
import draggable from 'vuedraggable';

export default {
  name: 'fileListComponent',
  components: { draggable },
  props: {
    modelValue: { default: null },
    gridType: { type: String, default: 'card' },
    icon: { default: false },
    title: { default: false },
    allowCounter: { type: Boolean, default: false },
    allowOrder: { type: Boolean, default: false },
    allowChangeView: { type: Boolean, default: false },
    actions: {
      type: Array, default: () => {
        return [];
      }
    },
    gridColClass: { default: 'col-6 col-md-3 col-lg-2' },
    itemActions: {
      type: Array, default: () => {
        return [];
      }
    },
    allowPagination: { type: Boolean, default: false },
    loadFiles: { default: false },
    allowSelect: { type: Number, default: 0 },
    draggable: { type: Boolean, default: false },
    quantity: { default: 0 },
    hideHeader: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    selectedFile: { default: null }
  },
  emits: ['update:modelValue','emptyFileAction','loaded','clickItem','selected'],
  watch: {
    modelValue: {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(this.table.data))
          this.table.data = this.$clone(newValue);
      }
    },
    'table.data': {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.$emit('update:modelValue', this.$clone(newValue));
      }
    },
    loadFiles: {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
          this.table.pagination.page = 1;
          this.getData();
        }
      }
    },
    'table.selected': {
      deep: true,
      handler: function(newValue, oldValue) {
        if (JSON.stringify(newValue) != JSON.stringify(oldValue))
          this.handlerSelectedFiles();
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      table: {
        grid: true,
        data: [],
        pagination: {
          page: 1,
          rowsPerPage: (this.loadFiles && this.loadFiles.requestParams) ? (this.loadFiles.requestParams.take) || 20 : 20,
          lastPage: 1,
          rowsNumber: 0
        },
        rowsPerPageOptions: [5, 10, 20, 50, 100, 300, 500],
        filter: {
          order: {
            field: 'created_at',
            way: 'desc'
          }
        },
        selected: []
      },
      modalDocs: {
        show: false,
        src: false,
        fileName: ''
      },
      modalPdf: {
        show: false,
        src: false,
        fileName: ''
      },
      modalAudio: {
        show: false,
        src: false,
        fileName: ''
      },
      modalVideo: {
        show: false,
        src: false,
        fileName: ''
      },
      selectedFiles: []
    };
  },
  computed: {
    //Table columns
    tableColumns() {
      const columns = [
        {
          name: 'id', label: 'Id', field: 'id', align: 'left',
          sortable: true
        },
        {
          name: 'filename', label: this.$tr('isite.cms.form.name'), field: 'filename', align: 'left',
          sortable: true
        },
        {
          name: 'type', label: this.$tr('isite.cms.form.type'), align: 'left', field: 'id',
          format: (val, row) => row ? (row.isFolder ? this.$tr('isite.cms.label.folder') :
            (row.isImage ? this.$tr('isite.cms.label.image') : this.$tr('isite.cms.label.file'))) : ''
        },
        {
          name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
          sortable: true, format: val => val ? this.$trd(val, { type: 'long' }) : '-'
        },
        {
          name: 'filesize', label: this.$tr('isite.cms.label.size'), field: 'filesize',
          format: val => val ? this.$helper.formatBytes(val) : '-'
        },
        { name: 'actions', label: this.$trp('isite.cms.label.action') }
      ];
      //Add selector column
      if (this.allowSelect) columns.unshift({
        name: 'selectColum', label: '', align: 'center'
      });
      //Response
      return columns;
    },
    //Table data
    tableData() {
      //Get data table
      let items = this.$clone(this.table.data) || [];
      if (this.selectedFile) {
        const fileName = this.table.data.filter(item => item.id === this.selectedFile).map(item => item.filename);
        this.table.selected = fileName;
      }
      //Icons by extensions
      let iconByExtension = {
        mp3: 'fas fa-file-audio',
        ogg: 'fas fa-file-audio',
        mp4: 'fas fa-file-video',
        pdf: 'fas fa-file-pdf',
        xlsx: 'fas fa-file-excel',
        xls: 'fas fa-file-excel',
        docx: 'fas fa-file-word',
        doc: 'fas fa-file-word',
        pptx: 'fas fa-file-powerpoint',
        ppt: 'fas fa-file-powerpoint'
      };

      //Transform data
      items.forEach(item => {
        //Set icon by extension
        item.icon = item.isFolder ? 'fas fa-folder' : (iconByExtension[item.extension] || 'fas fa-file');
        //Vlaidate extra format to image type
        if (['svg', 'jfif'].includes(item.extension)) item.isImage = true;
      });

      //Response
      return items;
    },
    //Return first index from current tableData
    firstIndexTableData() {
      let pagination = this.$clone(this.table.pagination);
      return ((pagination.rowsPerPage * pagination.page) - pagination.rowsPerPage);
    },
    //return empty files to selec
    emptyQuantityFiles() {
      let quantityEmpty = (this.quantity - this.tableData.length);
      return (quantityEmpty >= 1) ? (quantityEmpty > 3 ? 3 : quantityEmpty) : 0;
    },
    isSelected() {
      return name => this.table.selected.includes(name) ? 'selectable--selected scale-down' : (this.allowSelect ? 'selectable' : '');
    },
    isDesktop() {
      return this.$q.screen.gt.sm;
    }
  },
  methods: {
    init() {
      this.table.data = this.$clone(this.modelValue);
      this.getData();
    },
    //Get data
    getData(refresh = false) {
      //Call data table
      this.getDataTable({
        pagination: this.$clone(this.table.pagination),
        filter: this.$clone(this.table.filter)
      }, refresh);
    },
    //Get data table
    getDataTable({ pagination, filter }, refresh = false) {
      return new Promise((resolve, reject) => {
        //Validate loadFiles options
        if (!this.loadFiles || !this.loadFiles.apiRoute) return resolve(false);
        //Loading
        this.loading = true;
        //Update table filters
        this.table.filter = this.$clone({
          ...this.table.filter,
          ...(filter || {}),
          ...((this.loadFiles && this.loadFiles.requestParams) ? (this.loadFiles.requestParams.filter || {}) : {})
        });
        //Request params
        let requestParams = {
          refresh: true,
          params: {
            page: this.$clone(pagination.page),
            take: pagination.rowsPerPage,
            filter: this.$clone(this.table.filter)
          }
        };
        //Set order by
        if (pagination.sortBy) {
          requestParams.params.filter.order = {
            field: pagination.sortBy,
            way: pagination.descending ? 'desc' : 'asc'
          };
        }

        //Request
        this.$crud.index(this.loadFiles.apiRoute, requestParams).then(response => {
          //Emit event to notice loaded files
          this.$emit('loaded');
          //Set table data
          this.table.data = response.data;
          //Set pagination
          this.table.pagination.page = this.$clone(response.meta.page.currentPage);
          this.table.pagination.rowsNumber = this.$clone(response.meta.page.total);
          this.table.pagination.rowsPerPage = this.$clone(response.meta.page.perPage);
          this.table.pagination.lastPage = this.$clone(response.meta.page.lastPage);
          this.table.pagination.sortBy = this.$clone(pagination.sortBy);
          this.table.pagination.descending = this.$clone(pagination.descending);
          this.loading = false;
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.loading = false;
          });
        });
      });
    },
    //Do Item action
    fileAction(file) {
      //MS office extensions
      const msFileExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pps'];

      //Action if is image
      if (file.isImage) {
        const src = this.getImage(file);
        this.$refs.avatarImage.open(src);
      }
      //Action if is MS doc
      if (msFileExtensions.includes(file.extension)) {
        this.modalDocs = {
          show: true,
          src: file.url,
          fileName: file.filename
        };
      }
      //Action if is PDF
      if (file.extension == 'pdf') {
        this.modalPdf = {
          show: true,
          src: file.url,
          fileName: file.filename
        };
      }
      //Action if is mp3
      if (['mp3','ogg'].includes(file.extension)) {
        this.modalAudio = {
          show: true,
          src: file.url,
          fileName: file.filename
        };
      }
      //Action if is mp4
      if (file.extension == 'mp4') {
        this.modalVideo = {
          show: true,
          src: file.url,
          fileName: file.filename
        };
      }
      //Emit selection item
      this.$emit('clickItem', file);
    },
    //Toggle order
    toggleOrder() {
      this.table.filter.order.way = this.$clone(this.table.filter.order.way == 'asc' ? 'desc' : 'asc');
      this.table.pagination.page = 1;
      this.getData();
    },
    //Handler selected files data
    handlerSelectedFiles() {
      let dataFiles = [];
      let selectedFiles = this.$clone(this.table.selected.reverse().slice(0, this.allowSelect));

      //Validate keep selected files
      this.selectedFiles.forEach(file => {
        if (selectedFiles.includes(file.filename)) dataFiles.push(file);
      });

      //Validate new files selected
      selectedFiles.forEach(filename => {
        if (!this.selectedFiles.map(file => file.filename).includes(filename)) {
          dataFiles.push(this.table.data.find(file => file.filename == filename));
        }
      });

      //Set selected files
      this.table.selected = this.$clone(selectedFiles);
      this.selectedFiles = this.$clone(dataFiles);

      //Emit selected files
      this.$emit('selected', this.$clone(this.selectedFiles));
    },
    async downloadFile(file) {
      const url = file.url;
      const filename = file.filename;
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const urlObject = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlObject;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          document.body.removeChild(downloadLink);
        }, 100);
      } catch (error) {
        this.$apiResponse.handleError('Error downloading file');
      }
    },
    markAsSelected(event, name) {
      if (event?.pointerType == 'touch') return false;
      if (this.table.selected.includes(name)) {
        this.table.selected = this.table.selected.filter(element => element != name);
      } else {
        this.table.selected.push(name);
      }
      this.handlerSelectedFiles();
    },
    //Get Image Url depends of Disk
    getImage(file) {
      return file.disk == 'privatemedia' ? file.url : file.mediumThumb;
    }
  }
};
</script>
<style lang="scss">
#fileListComponent {
  .q-table__container {
    width: 100%;
    box-shadow: none;
    color: $grey-9;
    padding: 10px;

    .q-table__top {
      padding: 0;
    }

    thead {
      th {
        font-size: 16px;
      }
    }

    .td-filename { //Table styles
      .item-file {
        width: max-content;

        .q-icon {
          font-size: 25px;
          margin-right: 15px;
        }

        .file-image {
          margin-right: 15px;
          height: 36px;
          width: 36px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }
    }

    .file-card:hover .showOnHover {
      display: block;
    }

    .file-card { //Card styles
      color: $grey-9;
      background-color: $grey-4;
      border: 2px solid $grey-3;
      border-radius: 4px;
      overflow: hidden;
      position: relative;

      .showOnHover {
        display: none;
      }

      .file-card_img, .file-card_icon {
        height: 120px;
        width: 100%;
      }

      .file-card_icon {
        .q-icon {
          font-size: 50px;
        }
      }

      .file-card__bottom {
        width: 100%;
        background-color: white;
        position: relative;

        &_title {
          font-size: 12px;
          color: $grey-9;
          text-transform: lowercase;
        }
      }
    }

    .file-chip {
      border: 1px solid $grey-5;
      padding: 5px;
      border-radius: 5px;
      color: $grey-8;
      position: relative;
      min-height: 38px;

      .file-chip__img {
        position: absolute;
        left: 5px;
        top: 6.5px;
        height: 18px;
        width: 18px;
      }

      .file-chip__icon {
        position: absolute;
        left: 5px;
        top: 6.5px;
        font-size: 18px;
        margin-right: 5px;
      }

      .file-chip__title {
        padding-left: 23px;
        padding-right: 20px;
        text-transform: lowercase;
      }

      .file-chip__actions {
        position: absolute;
        right: 2px;
        top: 0;
      }
    }
  }

  .file-item-quantity {
    cursor: pointer;
    height: 188px;
    border: 2px dotted $grey-5;
    border-radius: 5px;
    color: $grey-5;
  }

  .q-field__control div:last-child {
    font-size: 18px;
  }

  th:last-child, td:last-child {
    background-color: white;
    position: sticky;
    right: 0;
    z-index: 1;
  }

  .drag-handle {
    cursor: move;
  }

  .scale-down {
    transition: all 0.2s ease-in-out;
    transform: scale(0.9) !important;
  }
}
</style>

