import { CurrentStep } from "~/types/types"
import { FaCircleCheck } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";
import { OnBoardingStepData } from "~/types/types";

interface OnboardingStepProps {
    step: OnBoardingStepData
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({ step }: OnboardingStepProps) => {

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
                        <a href={step.link} onClick={step.onClick} className="cursor-pointer">
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
                    </div>
                )
            }
        </div>
    )

}

export default OnboardingStep;