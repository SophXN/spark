import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { v4 as uuidv4 } from "uuid";
import { type HomePageMerchantDetails } from "~/types/types";

type FetchOptions = {
  enabled: boolean;
};

function useManageCompanyAndLocations(
  merchantId: string,
  accountId: string,
  options: FetchOptions,
) {
  const [, setLoading] = useState(true);
  const [, setError] = useState<string>("");
  const [company, setCompany] = useState<HomePageMerchantDetails>();
  const findCompanyByMerchantId = api.company.getCompany.useQuery(merchantId, {
    enabled: options.enabled,
  });

  const createLocations = api.merchantLocations.addLocations.useMutation({
    onSuccess(data) {
      console.log(data, "<= locations created");
      setLoading(false);
    },
  });
  // console.log("is it enabled??", findCompanyByMerchantId.data);

  const findLocationsThroughSquare =
    api.merchantLocations.getLocations.useQuery(accountId, {
      enabled: findCompanyByMerchantId.data === null,
    }).data ?? [];

  const createCompany = api.company.createCompany.useMutation({
    onSuccess(data) {
      // console.log(data, "<= company created");
      const defaultData = {
        _count: {
          eventRequests: 0,
          sponsorships: 0,
          collaboratorResponses: 0,
        },
      };
      // setCompany(data as HomePageMerchantDetails);
      setCompany({ ...defaultData, ...data } as HomePageMerchantDetails);
      const updatedLocations = findLocationsThroughSquare.map((location) => ({
        id: uuidv4(),
        companyId: data.id,
        city: location.city!,
        type: location.type,
        merchantCode: location.merchantCode,
        locationId: location.id,
      }));
      createLocations.mutate(updatedLocations);
    },
  });

  useEffect(() => {
    if (!options.enabled) {
      // console.log("not calling, no session data");
      return;
    }

    if (findCompanyByMerchantId.data) {
      setCompany(findCompanyByMerchantId.data as HomePageMerchantDetails);
      // console.log("company found, no further action");
      return;
    }

    if (
      !findCompanyByMerchantId.isLoading &&
      !findCompanyByMerchantId.data &&
      !findCompanyByMerchantId.error
    ) {
      // No user found, let's create a company
      console.log("No company found");
      if (findLocationsThroughSquare[0] == null) {
        return;
      }
      if (findLocationsThroughSquare.length > 0) {
        console.log("locations found, create company");
        const companyParams = {
          id: uuidv4(),
          name: findLocationsThroughSquare[0].name,
          address: findLocationsThroughSquare[0].address,
          squareMerchantId: findLocationsThroughSquare[0].companyId,
        };
        createCompany.mutate(companyParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    findCompanyByMerchantId.data,
    findCompanyByMerchantId.isLoading,
    findCompanyByMerchantId.error,
    merchantId,
    findLocationsThroughSquare,
  ]);

  // Handle errors
  useEffect(() => {
    if (findCompanyByMerchantId.error)
      setError(findCompanyByMerchantId.error.message);
    if (createCompany.error) setError(createCompany.error.message);
    if (createLocations.error) setError(createLocations.error.message);
  }, [
    findCompanyByMerchantId.error,
    createCompany.error,
    createLocations.error,
  ]);

  // Manage overall loading state
  useEffect(() => {
    setLoading(
      findCompanyByMerchantId.isLoading ||
        createCompany.isPending ||
        createLocations.isPending,
    );
  }, [
    findCompanyByMerchantId.isLoading,
    createCompany.isPending,
    createLocations.isPending,
  ]);

  return { company };
}

export default useManageCompanyAndLocations;
