import {computed, reactive} from "vue";
//import {StateKeyInterface} from 'modules/qsite/_components/v3/demo/interface'

interface StateInterface {
    itemSelected: any
}

const state = reactive<StateInterface>({
    itemSelected: {}
})

export default computed(() => ({
    get itemSelected() {
        return state.itemSelected
    },
    set itemSelected(val) {
        state.itemSelected = val
    }
})).value
