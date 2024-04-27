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
    const imageMutation = api.imageHandler.uploadImageToStorage.useMutation({
        onSuccess: (data) => {
            console.log(data, " <= image uploaded to bucket")
            setStatus(UploadStates.uploadedToBucket);
            setStorageUrl(data)
        }
    })

    useEffect(() => {
        if (fileObj.file) {
            console.log(fileObj, " <= image handler")
            setStatus(UploadStates.uploadingToBucket);

            convertFileToBase64(fileObj.file, (base64EncodedFile) => {
                if (base64EncodedFile) {
                    console.log('Base64 Encoded File:', base64EncodedFile);
                    // Now send `base64EncodedFile` to your API
                    const params = {
                        bucket: fileObj.bucket,
                        file: base64EncodedFile as string,
                        contentType: fileObj.contentType
                    }

                    console.log(params, "<= before upload")
                    imageMutation.mutate(params)
                } else {
                    console.log('Failed to convert file to base64.');
                }
            });
        }
    }, [fileObj])

    function convertFileToBase64(file: File, callback: (base64EncodedFile: string | ArrayBuffer | null) => void): void {
        const reader = new FileReader();
        reader.onload = () => {
            callback(reader.result);  // reader.result is string | ArrayBuffer | null
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            callback(null);
        };
        reader.readAsDataURL(file);
    }

    return { status, storageUrl }
}

export default useImageUploader;