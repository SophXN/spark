import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { RequestCardInfo } from '~/types/types';
import { MailIcon, RefreshCcwIcon } from 'lucide-react';

interface DeniedData {
    deniedData: RequestCardInfo[]
}

const DeniedRequests: React.FC<DeniedData> = ({deniedData}) => {

    function revokeDenial() {

    }

    return (
        <div>
            {deniedData.map((requests) =>
                <Card className='mt-2'>
                <CardHeader>
                    <div className="relative flex items-center space-x-2 rounded-lg">
                        <div className="flex-shrink-0">
                            <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <a>
                                <p className="text-sm font-medium text-gray-900">{requests.organizerName}</p>
                                <p className="truncate text-sm text-gray-500">{requests.organizerAddress}</p>
                            </a>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Badge>Food</Badge>
                    <p className='mt-2 text-sm'>{requests.message}</p>
                </CardContent>
                <CardFooter className='flex flex-wrap flex-row justify-end gap-21'>
                    <Button onClick={() => revokeDenial()} size="sm" className='px-2 gap-1 w-full sm:w-auto bg-slate-600 hover:bg-slate-500'><RefreshCcwIcon className='w-2'/>Revoke</Button>
                </CardFooter>
            </Card>
            )}
        </div>
    )
}

export default DeniedRequests