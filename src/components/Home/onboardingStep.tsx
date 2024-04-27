import { CurrentStep } from "~/types/types"
import { FaCircleCheck } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";
import { OnBoardingStepData } from "~/types/types";
import { useEffect, useRef, useState} from "react";
import useImageUploader, { FileObj } from "~/hooks/useImageUploader";
import { UploadStates } from "~/hooks/useImageUploader";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

interface OnboardingStepProps {
    step: OnBoardingStepData
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({ step }: OnboardingStepProps) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState<FileObj>({
        bucket: "profile-pictures",
    });
    const { status, storageUrl } = useImageUploader(file);
    const updateProfileImageMutation = api.company.updateCompanyProfilePicture.useMutation({onSuccess(data) {
        console.log(data, " <= finished updated company with new icon")
    },});

    const handleDivClick = () => {
        // Trigger the file input when the div is clicked
        fileInputRef.current.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // upload profile picture if you don't have one set
        console.log(event.target.files, "<= image captured")
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) {
            return;
        }
        const contentType = file.type;
        const fileData = {
            file: file,
            contentType: contentType
        }

        setFile(prevState => ({...prevState, ...fileData}))
    }

    useEffect(() => {
        if(status == UploadStates.uploadedToBucket && storageUrl != null) {
            // update company with new image
            // updateProfileImageMutation.mutate({squareMerchantId: step.companyId ?? "", profilePicture: storageUrl})
        }
    }, [status, storageUrl])

    return (
        <div>
            {
                step.completeStatus ? (
                    <div className="rounded-lg flex flex-row gap-1 items-center justify-between">
                        <div className="flex flex-row items-center gap-1">
                            <div className="w-[25px] h-[25px] text-xs border-[1px] border-slate-400 rounded-full flex justify-center items-center">
                                <div className="text-xxs text-slate-400">{step.index.toString()}</div>
                            </div>
                            <div className="text-sm text-slate-400 line-through">
                                {step.currentStep}
                            </div>
                        </div>
                        <FaCircleCheck size={"25"} color="#00d06f" ></FaCircleCheck>
                    </div>
                ) : (
                    <div>
                        {step.currentStep == CurrentStep.addProfilePicture && (
                            <div onClick={handleDivClick} className="rounded-lg flex flex-row gap-1 items-center justify-between cursor-pointer">
                                <div className="flex flex-row items-center gap-1">
                                    <div className="w-[25px] h-[25px] text-xs border-[1px] border-slate-800 rounded-full flex justify-center items-center">
                                        <div className="text-xxs">{step.index.toString()}</div>
                                    </div>
                                    <div className="text-sm">
                                        {step.currentStep}
                                    </div>
                                </div>
                                <ArrowRight size={"16"} ></ArrowRight>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }} // Hide the file input
                                />
                            </div>
                        )}
                        {step.currentStep == CurrentStep.createFirstEvent && (
                            <a href={step.link} className="cursor-pointer">
                                <div className="rounded-lg flex flex-row gap-1 items-center justify-between">
                                    <div className="flex flex-row items-center gap-1">
                                        <div className="w-[25px] h-[25px] text-xs border-[1px] border-slate-800 rounded-full flex justify-center items-center">
                                            <div className="text-xxs">{step.index.toString()}</div>
                                        </div>
                                        <div className="text-sm">
                                            {step.currentStep}
                                        </div>
                                    </div>
                                    <ArrowRight size={"16"} ></ArrowRight>
                                </div>
                            </a>
                        )}

                        {step.currentStep == CurrentStep.collaborateOnEvent && (
                            <div className="rounded-lg flex flex-row gap-1 items-center justify-between">
                                <div className="flex flex-row items-center gap-1">
                                    <div className="w-[25px] h-[25px] text-xs border-[1px] border-slate-800 rounded-full flex justify-center items-center">
                                        <div className="text-xxs">{step.index.toString()}</div>
                                    </div>
                                    <div className="text-sm">
                                        {step.currentStep}
                                    </div>
                                </div>
                                <ArrowRight size={"16"} ></ArrowRight>
                            </div>
                        )}

                        {step.currentStep == CurrentStep.sponsorAnEvent && (
                            <div className="rounded-lg flex flex-row gap-1 items-center justify-between">
                                <div className="flex flex-row items-center gap-1">
                                    <div className="w-[25px] h-[25px] text-xs border-[1px] border-slate-800 rounded-full flex justify-center items-center">
                                        <div className="text-xxs">{step.index.toString()}</div>
                                    </div>
                                    <div className="text-sm">
                                        {step.currentStep}
                                    </div>
                                </div>
                                <ArrowRight size={"16"} ></ArrowRight>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )

}

export default OnboardingStep;