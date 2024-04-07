import { CalendarIcon, Globe, LocateIcon } from "lucide-react"

export default function WhenAndWhere() {
    return (
        <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex items-center space-x-2 mb-2 sm:mb-0 sm:mr-10">
                    <CalendarIcon className="text-slate-800" />
                    <div className="text-left">
                        <h3 className="text-md font-medium">Date and time</h3>
                        <p className="text-sm text-gray-600 text-muted-foreground">Fri, Mar 17 9:00am</p>
                    </div>
                </div>
                <div className="border-t sm:border-l border-gray-200 sm:border-0 w-full sm:w-10 h-2 self-center" />
                <div className="flex items-center space-x-2">
                    <Globe className="text-slate-800" />
                    <div className="text-left">
                        <h3 className="text-md font-medium">Location</h3>
                        <p className="text-sm text-gray-600 text-muted-foreground">500 hut st, 11211, Brooklyn</p>
                    </div>
                </div>
            </div>
        </div>
    )
}