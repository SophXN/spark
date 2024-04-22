import { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import { getServerSession } from "next-auth/next"

function useManageCompanyAndLocations(merchantId: string, accountId: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // tRPC hooks for operations
    const findCompanyByMerchantId = api.company.getCompany.useQuery(merchantId);
    const createCompany = api.company.createCompany.useMutation();
    const createLocations = api.merchantLocations.addLocations.useMutation();
    const findLocations = api.merchantLocations.getLocations.useQuery(accountId);

    useEffect(() => {
        if (!findCompanyByMerchantId.isLoading && !findCompanyByMerchantId.data && !findCompanyByMerchantId.error) {
            // No user found, let's create a company
            console.log("No company found");
            createCompany.mutate({ merchantId });
        }

        if(findCompanyByMerchantId.data){
            // user exists
            console.log(findCompanyByMerchantId.data, ", found company data");
            setLoading(true);
        }
    }, [findCompanyByMerchantId.data, findCompanyByMerchantId.isLoading, findCompanyByMerchantId.error, merchantId]);

    useEffect(() => {
        if (createCompany.isSuccess) {
            console.log("created new company")
            // Company created, now fetch locations and create them
            //fetchLocationsAndCreate();
        }
    }, [createCompany.isSuccess]); // Only rerun when createCompany call succeeds

    useEffect(() => {
        if (findCompanyByMerchantId.data && !createCompany.isPending) {
            // User found, fetch locations and create them without creating company
            fetchLocationsAndCreate();
        }
    }, [findCompanyByMerchantId.data, !createCompany.isPending]);

    async function fetchLocationsAndCreate() {
        try {
            setLoading(true);
            setError(null);
            const locations = await fetchSquareLocationsApi(merchantId);
            createLocations.mutate({ locations });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSquareLocationsApi(merchantId) {
        // Fetch locations from Square's API
        // Simulating fetch with dummy data
        return [{ id: 'location1', name: 'Primary Location' }];
    }

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
