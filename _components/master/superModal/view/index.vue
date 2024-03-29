<template>
    <q-dialog
        v-model="show"
        :content-class="`master-super-ctn master-dialog${customPosition ? '-custom' : ''}`"
        :maximized="maximized"
        :persistent="persistent"
        :position="customPosition ? 'right' : 'standard'"
        :content-style="masterModalWidthSize"
    >
    <!--Content-->
    <div
        :id="id || 'masterModalContent'"
        :style="customPosition ? '' : `min-width: ${width}`"
        v-if="show"
        class="master-dialog__content round relative-position"
        :class="customClass"
    >
        <!--Header-->
        <div :class="`master-dialog__header text-${color} row justify-between items-center`">
        <!--Title-->
        <div class="master-dialog__header-title row items-center">
            <q-icon v-if="icon" :name="icon" class="q-mr-sm" size="20px" />
            <b>{{ title }}</b>
        </div>
        <!--Close Button-->
        <div 
            class="
            tw-absolute 
            tw-right-0 
            tw-mr-20 
            tw-space-x-2"
            >
            <q-btn 
                v-for="(btn, keyBtn) in multiActions"
                v-if="btn.props.vIf != undefined ? btn.props.vIf : true"
                :key="keyBtn"
                v-bind="{ ...actionBtnProps, ...(btn.props || {}) }"
                @click="btn.action ? btn.action() : null" 
            />
        </div>
        <q-btn
            v-close-popup
            icon="fas fa-times"
            round
            color="blue-grey"
            unelevated
            class="btn-small"
            outline
            v-if="!hideCloseAction"
        />

        </div>
        <q-separator inset />
        <!--Slot content-->
        <div class="master-dialog__body">
            <slot />
        </div>
        <!--Actions Content-->
        <div class="master-dialog__actions" v-if="actions && actions.length">
        <div class="row justify-end q-gutter-sm">
            <q-btn
            v-for="(btn, keyBtn) in actions"
            v-if="btn.props.vIf != undefined ? btn.props.vIf : true"
            :key="keyBtn"
            v-bind="{ ...actionBtnProps, ...(btn.props || {}) }"
            @click="btn.action ? btn.action() : null"
            :loading="btn.props.loading != undefined ? btn.props.loading : false"
            />
        </div>
        </div>
        <!--Loading-->
        <inner-loading :visible="loading" />
    </div>
</q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useSuperModal from '../controllers/superModal.controller'

export default defineComponent({
    props: {
        value: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        persistent: { type: Boolean, default: false },
        color: { type: String, default: 'blue-grey' },
        width: { type: String, default: '400px' },
        title: { type: String },
        icon: { type: String },
        actions: { type: Array },
        id: { type: String },
        maximized: { type: Boolean, default: false },
        hideCloseAction: { type: Boolean, default: false },
        customPosition: { type: Boolean, default: false },
        modalWidthSize: { type: String, default: '65vw' },
        customClass: { type: String, default: '' },
        multiActions: {type: Array, default: () => [] }
    },
    setup(props, { emit }) {
       return { ...useSuperModal(props, emit) }
    }, 
});
</script>

<style scoped src="../assets/styles/superModal.style.styl" lang="stylus">
</style>