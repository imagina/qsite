import { reactive } from 'vue';
import baseService from 'modules/qcrud/_services/baseService.js'

const state = reactive({
    dragReports: false,
});

export default function foldersStore() {
    function getDragReports() {
        return state.dragReports;
    }
    function setDragReports(value) {
        state.dragReports = value;
    }
    function transformDataToDragableForderList(data) {
        try {
            return data.map(item => ({
                ...item,
                isCollapse: false,
                loading: false,
                reportList: [],
            }));
        } catch (error) {
            console.error('[folderStore:transformDataToDragableForderList]');
        }
    }
    async function saveOrderFolders(route, forderList) {
        try {
            const positionFolder = forderList.map(item => ({ id: item.id }));
            await baseService.create(route, positionFolder)
        } catch (error) {
            console.log(error);
            console.error('[folderStore:saveOrderFolders]');
        }
    }
    return {
        transformDataToDragableForderList,
        getDragReports,
        setDragReports,
        saveOrderFolders,
    }
}
