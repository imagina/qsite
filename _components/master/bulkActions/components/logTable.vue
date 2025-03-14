<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { initialPagination } from '../models/defaultModels/constants'

const props = defineProps({
    rows: {
        required: true,
        type: Array,
        default: () => {
            return []
        }
    },
    columns: {
        required: true,
        type: Array,
        default: () => {
            return []
        }
    },
    initialPagination: {
        type: Object,
        default: () => ({ ...initialPagination }),
    },
})

const emit = defineEmits(['getDataLog'])

const pagination = ref({
    ...props.initialPagination,
})

</script>
<template>
    <q-table
        class="log-table-sticky"
        card-class="tw-rounded-xl"
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        virtual-scroll
        :pagination="pagination"
        separator="none"
    >
        <template v-slot:header="props">
            <q-tr 
                :props="props" 
                class="tw-bg-gray-100"
            >
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                >
                    <b class="tw-text-gray-500 tw-text-sm tw-mr-4">
                        {{ col.label }}
                    </b>
                </q-th>
            </q-tr>
        </template>
        <template v-slot:body-cell-description="props">
            <q-td :props="props">
                <span v-html="props.value"></span>
            </q-td>
        </template>
        <template v-slot:body-cell-statusId="props">
            <q-td class="bg-white" :props="props">
                {{ props.value }}
            </q-td>
        </template>
        <template v-slot:body-cell-icon="props">
            <td class="bg-white" :props="props">
                <q-icon 
                    :name="props.row.icon.name"
                    :class="props.row.icon.color"
                    size="16px"
                />
            </td>
        </template>
        <template v-slot:bottom>
			<div class="tw-flex tw-justify-center tw-items-center tw-w-full">
				<q-pagination
					v-model="pagination.page"
					:max="pagination.pagesNumber"
					:max-pages="7"
					rounded
					active-color="white"
					text-color="grey-7"
					active-text-color="blue-14"
					boundary-numbers
					size="md"
					direction-links
					@update:modelValue="emit('getDataLog', pagination)"
				/>
			</div>
		</template>
    </q-table>
</template>
<style lang="scss" scoped>
.log-table-sticky {
    th:nth-child(5), td:nth-child(5) {
        position: sticky;
        right: 20px;
        z-index: 1;
    }
    
    th:last-child, td:last-child {
        position: sticky;
        right: 0;
        z-index: 2;
    }
}
</style>