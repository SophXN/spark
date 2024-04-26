import { Progress } from "../ui/progress"
import { OnBoardingStepData } from "~/types/types";
import OnboardingStep from "./onboardingStep";

interface OnboardingStatusProps {
    data: OnBoardingStepData[]
}

const OnboardingStatus: React.FC<OnboardingStatusProps> = ({ data }: OnboardingStatusProps) => {

    const handleProfilePictureTap = () => {
        
    }

    const secondStep = {
        onClick: handleProfilePictureTap
    }

    return (
        <div className="w-full rounded-lg border px-2 py-2 flex flex-col gap-2">
            <div className="flex flex-row justify-between">
                <div className="text-lg font-semibold">Get set-up checklist</div>
                <div className="txt-lg font-semibold">1/4</div>
            </div>
            <div>
                <Progress
                    className="h-1"
                    value={20} // temporary value
                ></Progress>
            </div>
            {data.map((step) => {
                if(step.index == 2) return <OnboardingStep key={step.index} step={{...secondStep, ...step}}/>
                return <OnboardingStep key={step.index} step={step}/>
            })}
        </div>
    )
}

export default OnboardingStatus