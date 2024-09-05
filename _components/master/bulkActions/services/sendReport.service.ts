import baseService from '@imagina/qcrud/_services/baseService'
import { SelectedAction } from '../models/interfaces/selectedAction'

export const sendReport = async (
    confirmed: boolean, 
    selectedAction: SelectedAction | null, 
    optionsForSelectedBulkActions: { [key: string]: string }, 
    prototype: any,
    permission: string,
    rowIds: number[] = []
) => {
    try {
        const id = rowIds.length > 0 ? {id: rowIds} : {}
        const payload = {
            apiRoute: selectedAction?.apiRoute,
            title: selectedAction?.label,
            name: selectedAction?.value,
            type: permission
        }

        const requestParams = {
            bulkAction : {
                ...payload,
                fields: {
                    ...optionsForSelectedBulkActions
                },
            },
            confirmed,
            filter: {
                ...prototype.$filter.values,
                ...id
            }
        };

        return await baseService.post(
            payload?.apiRoute, 
            requestParams
        )
    } catch (error) {
        console.error(error);
        prototype.$alert.error(
            prototype.$tr('isite.cms.messages.errorDispatchingAction')
        )
    }
}