'use-client'

import { useState, useEffect } from "react";
import { api } from "~/utils/api";

// Create a single supabase client for interacting with your database

enum uploadStates {
    pending,
    uploadingToBucket,
    uploadedToBucket,
    updatingMerchantWithUrl,
    finishedUpdatingUser
}

function useImageUploader(bucket: string, file?: File) {
    const [status, setStatus] = useState(uploadStates.pending);
    const [storageUrl, setStorageUrl] = useState<string>();
    const imageMutation = api.imageHandler.updateBusinessProfileImage.useMutation({onSuccess: (data) => {
        // console.log(data.profilePicture, " <= image uploaded to bucket")
        // setStatus(uploadStates.uploadedToBucket);
        // setStorageUrl(data.profilePicture as string)
    }})

    useEffect(() => {

        if (file != null) {

            const uploadImage = async () => {
                setStatus(uploadStates.uploadingToBucket);
                // const formData = new FormData();
                // formData.append('file', file);
                // console.log(formData, " <= formData");
                const params = {
                    bucket: bucket,
                    file: file
                }
                imageMutation.mutate(params)
                //setStatus(uploadStates.uploadedToBucket);
            }

            uploadImage()
        }
    }, [file])

    return { status, storageUrl }
}

export default useImageUploader;