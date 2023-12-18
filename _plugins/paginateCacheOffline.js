
import cache from "@imagina/qsite/_plugins/cache";

export default async function paginateCacheOffline(apiRoute, search = null, page = 1, perPage = 10) {
    const cacheResponse = await cache.get.item(`${apiRoute}::offline`) || { data: [] };
    if (!cacheResponse.data.length === 0) {
        return cacheResponse;
    };
    const filteredData = cacheResponse.data.filter(item => {
        return Object.values(item).some(value => {
            if (value) {
                search = search ? search.toLowerCase() : null;
                if (search) {
                    return String(value).toLowerCase().includes(search)
                } else {
                    return true;
                }
            }
        })
    });

    const totalPages = Math.ceil(filteredData.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    const response = {
        data: currentPageData,
        meta: {
            page: {
                total: filteredData.length,
                perPage: perPage,
                currentPage: page,
                lastPage: totalPages
            },
        }
    };

    return response;
}