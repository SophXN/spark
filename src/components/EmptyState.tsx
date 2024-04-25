import React from "react";

interface EmptyStateProps {
    title: string,
    description: string
}

const EmptyState: React.FC<EmptyStateProps> = ({title, description} : EmptyStateProps) => {

    return (
        <div className="bg-slate-100 w-full h-[400px] rounded-lg flex justify-center items-center">
            <div className="flex flex-col justify-items-center">
                <div className="text-xl font-semibold">
                    {title}
                </div>
                <span className="font-medium text-slate-60 text-center pt-1">
                    {description}
                </span>
            </div>
        </div>
    )
}

export default EmptyState;