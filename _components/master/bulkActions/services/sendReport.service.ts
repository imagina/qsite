import baseService from '@imagina/qcrud/_services/baseService'
import { SelectedAction } from '../models/interfaces/selectedAction'

export const sendReport = async (
    confirmed: boolean, 
    selectedAction: SelectedAction, 
    optionsForSelectedBulkActions: { [key: string]: string }, 
    prototype: any
) => {
    try {
        const payload = {
            apiRoute: selectedAction?.apiRoute,
            title: selectedAction?.label,
            name: selectedAction?.value,
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
                ...prototype.$filter.values
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