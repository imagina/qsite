
import crud from 'modules/qcrud/_services/baseService.js'

export default async function getCountries(refresh = false) {
    try {
        const params = {
            refresh,
            params: {
                include: 'translations'
            },
        };
        const response = await crud.index(
            "apiRoutes.qlocations.countries",
            params,
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
