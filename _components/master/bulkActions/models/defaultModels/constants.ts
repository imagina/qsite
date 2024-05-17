export const status = { 
    1: {
        label: 'Pending',
        icon: {
            name: 'fa-solid fa-clock',
            color: 'tw-text-orange-400'
        },
    },
    2: {
        label: 'In progress',
        icon: {
            name: 'fa-duotone fa-spinner-third fa-spin',
            color: 'tw-text-blue-400'
        }
    },
    3: {
        label: 'Failed',
        icon: {
            name: 'fa-solid fa-circle-exclamation',
            color: 'tw-text-red-400'
        }
    },
    4: {
        label: 'Success',
        icon: {
            name: 'fa-solid fa-circle-check',
            color: 'tw-text-green-400'
        }
    }
}

export const columns = [
    { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
    { 
        name: 'action', 
        label: 'Action', 
        align: 'left', 
        field: 'action', 
        sortable: true, 
    },
    { name: 'createdAt', label: 'Date', align: 'left', field: 'createdAt', sortable: true },
    { 
        name: 'statusId', 
        label: 'Status', 
        align: 'left', 
        field: 'statusId', 
        sortable: true,
        format: (val) => status[val].label,
        style: 'width: 64px'
    },
    { 
        name: 'icon', 
        label: '', 
        align: 'center', 
        field: 'statusId',
        format: (val) => status[val].icon,
        style: 'padding-left: 0; width: 20px' 
    },
]

export const initialPagination = {
    sortBy: 'id',
    descending: true,
    rowsPerPage: 10
}

export const typesOfMessages = {
    info: {
        icon: 'fa-solid fa-circle-info',
        color: 'info'
    },
    warning: {
        icon: 'fa-solid fa-triangle-exclamation',
        color: 'warning'
    },
}

export const fieldMassiveActions = {
    name: 'actionType',
    value: '',
    type: 'select',
    required: true,
    props: {
        label: 'Report/Action Type',
        options: [],
        emitValue: false,
        'map-options': false,
    }
}