import type { Pagination } from "@/api/comon/model/Pagination";
import { getCompanyListApi } from "@/api/system";
import type { CompanySearchForm } from "@/api/system/model/company";

import { defineStore } from "pinia";
import { ref } from "vue";

export const useCompanyStore = defineStore('company', () => {

    const showForm = ref(false);

    const getCompanyList = async function (params: CompanySearchForm & Pagination) {
        const res = await getCompanyListApi(params);
    }

    return { getCompanyList };
});