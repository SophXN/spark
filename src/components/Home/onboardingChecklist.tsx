import { Progress } from "../ui/progress"
import { OnBoardingStepData } from "~/types/types";
import OnboardingStep from "./onboardingStep";
import useImageUploader from "~/hooks/useImageUploader";
import { useState } from "react";

interface OnboardingStatusProps {
    data: OnBoardingStepData[]
}

const OnboardingStatus: React.FC<OnboardingStatusProps> = ({ data }: OnboardingStatusProps) => {

    const totalSteps = data.length;
    const numberOfCompletedItems = data.reduce((acc, step) => {
        return step.completeStatus ? acc + 1 : acc
    }, 0) ?? 0;
    const percentageChecklistComplete = (numberOfCompletedItems / totalSteps) * 100;

    console.log(data);

    return (
        <div className="w-full rounded-lg border px-2 py-2 flex flex-col gap-2">
            <div className="flex flex-row justify-between">
                <div className="text-lg font-semibold">Get set-up checklist</div>
                <div className="text-lg font-semibold">{percentageChecklistComplete.toString() + "%"}</div>
            </div>
            <div>
                <Progress
                    className="h-1"
                    value={percentageChecklistComplete} // temporary value
                ></Progress>
            </div>
            {data.map((step) => {
                return <OnboardingStep key={step.index} step={step}/>
            })}
        </div>
    )
}

export default OnboardingStatus