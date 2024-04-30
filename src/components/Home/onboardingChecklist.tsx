import { Progress } from "../ui/progress";
import { type OnBoardingStepData } from "~/types/types";
import OnboardingStep from "./onboardingStep";

interface OnboardingStatusProps {
  data: OnBoardingStepData[];
}

const OnboardingStatus: React.FC<OnboardingStatusProps> = ({
  data,
}: OnboardingStatusProps) => {
  const totalSteps = data.length;
  const numberOfCompletedItems =
    data.reduce((acc, step) => {
      return step.completeStatus ? acc + 1 : acc;
    }, 0) ?? 0;
  const percentageChecklistComplete =
    (numberOfCompletedItems / totalSteps) * 100;

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border px-2 py-2 mt-2">
      <div className="flex flex-row justify-between">
        <div className="text-lg font-semibold">Get set-up checklist</div>
        <div className="text-lg font-semibold">
          {percentageChecklistComplete.toString() + "%"}
        </div>
      </div>
      <div>
        <Progress
          className="h-1"
          value={percentageChecklistComplete} // temporary value
        ></Progress>
      </div>
      {data.map((step) => {
        return <OnboardingStep key={step.index} step={step} />;
      })}
    </div>
  );
};

export default OnboardingStatus;
