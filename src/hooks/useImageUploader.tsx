'use-client'

import { useState, useEffect } from "react";
import { api } from "~/utils/api";

// Create a single supabase client for interacting with your database

export enum UploadStates {
    pending,
    uploadingToBucket,
    uploadedToBucket
}

export interface FileObj {
    bucket: string,
    file?: File,
    contentType?: string
}

function useImageUploader(fileObj: FileObj) {
    const [status, setStatus] = useState(UploadStates.pending);
    const [storageUrl, setStorageUrl] = useState<string>();
    const imageMutation = api.imageHandler.uploadImageToStorage.useMutation({onSuccess: (data) => {
        console.log(data, " <= image uploaded to bucket")
        setStatus(UploadStates.uploadedToBucket);
        setStorageUrl(data as string)
    }})

    useEffect(() => {
        if (fileObj.file != null) {
            console.log(fileObj, " <= image handler")
            const uploadImage = async () => {
                setStatus(UploadStates.uploadingToBucket);
                const params = {
                    bucket: fileObj.bucket,
                    file: fileObj.file,
                    contentType: fileObj.contentType
                }
                console.log(params, "<= before upload")
                imageMutation.mutate(params)
            }
            uploadImage()
        }
    }, [fileObj])

    return { status, storageUrl }
}

export default useImageUploader;