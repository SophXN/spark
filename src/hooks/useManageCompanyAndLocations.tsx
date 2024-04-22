import { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import { z } from 'zod';
import { MerchantLocation } from '@prisma/client';
import { v4 as uuidv4 } from "uuid";

type FetchOptions = {
    enabled: boolean;
  };

function useManageCompanyAndLocations(merchantId: string, accountId: string, options: FetchOptions) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const findCompanyByMerchantId = api.company.getCompany.useQuery(merchantId, {enabled: options.enabled});
    const createLocations = api.merchantLocations.addLocations.useMutation({onSuccess(data) {
        console.log(data, "<= locations created")
        setLoading(false);
    },});
    const findLocations = api.merchantLocations.getLocations.useQuery(accountId, {enabled: findCompanyByMerchantId.data === null}).data || [];
    const createCompany = api.company.createCompany.useMutation({onSuccess(data, variables, context) {
        console.log(data, "<= company created")
        const updatedLocations = findLocations.map(location => ({
            id: location.id,
            companyId: data.id,
            city: location.city as string,
            type: location.type,
            merchantCode: location.merchantCode
        }));
        createLocations.mutate(updatedLocations)
    }});

    useEffect(() => {
        if(!options.enabled){
            console.log("not calling, no session data")
            return
        }

        if(findCompanyByMerchantId.data){
            console.log("company found, no further action")
            setLoading(false);
            return
        }

        if (!findCompanyByMerchantId.isLoading && !findCompanyByMerchantId.data && !findCompanyByMerchantId.error) {
            // No user found, let's create a company
            console.log("No company found");
            if(findLocations[0] == null) { return }
            if(findLocations.length > 0){
                console.log("locations found, create company")
                const companyParams = {
                    id: uuidv4(),
                    name: findLocations[0].name as string,
                    address: findLocations[0].address as string,
                    squareMerchantId: findLocations[0].companyId as string
                }
                createCompany.mutate(companyParams);
            }
        }
    }, [findCompanyByMerchantId.data, findCompanyByMerchantId.isLoading, findCompanyByMerchantId.error, merchantId, findLocations]);

    // Handle errors
    useEffect(() => {
        if (findCompanyByMerchantId.error) setError(findCompanyByMerchantId.error.message);
        if (createCompany.error) setError(createCompany.error.message);
        if (createLocations.error) setError(createLocations.error.message);
    }, [findCompanyByMerchantId.error, createCompany.error, createLocations.error]);

    // Manage overall loading state
    useEffect(() => {
        setLoading(findCompanyByMerchantId.isLoading || createCompany.isPending || createLocations.isPending);
    }, [findCompanyByMerchantId.isLoading, createCompany.isPending, createLocations.isPending]);

    return { loading, error };
}

export default useManageCompanyAndLocations;
