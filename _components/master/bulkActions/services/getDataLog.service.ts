import baseService from 'modules/qcrud/_services/baseService'
import { NUMBER_OF_ROWS } from '../models/defaultModels/constants'

export const getDataLog = async (permission: string | null, page: number = 1) => {
    try {
        const response = await baseService.index(
            'apiRoutes.qsite.bulkActions', 
            { 
                refresh: true, 
                params: { 
                    filter: { 
                        type: permission,
                        order: {
                            field:'id',
                            way:'desc'
                        }
                    },
                    take: NUMBER_OF_ROWS,
                    page,
                }
            }
        )
        return response;
    } catch (error) {
        console.error(error)
    }
}
