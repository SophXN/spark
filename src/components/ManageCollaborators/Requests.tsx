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
import { Ewert } from 'next/font/google';
import { RequestCardInfo, RequestStatus, RequestCardInfoArray } from '~/types/types';
import { Cross1Icon, Cross2Icon } from '@radix-ui/react-icons';
import { Check } from 'lucide-react';

const Requests: React.FC<RequestCardInfoArray> = ({ infoCards }) => {

    return (
        <div>
            {infoCards.map((event) =>
                <RequestCard 
                    key={event.requestId}
                    organizerAddress={event.organizerAddress} 
                    organizerName={event.organizerName} 
                    helpingCategory={event.helpingCategory}
                    message={event.message}
                    requestId={event.requestId}
                    status={event.status}  />
            )}
        </div>
    )
}

const RequestCard: React.FC<RequestCardInfo> = ({ ...info }: RequestCardInfo) => {

    function rejectCollaborator() {

    }

    function acceptCollaborator() {

    }

    return (
        <div>
            <Card className='mt-2'>
                <CardHeader>
                    <div className="relative flex items-center space-x-2 rounded-lg">
                        <div className="flex-shrink-0">
                            <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <a>
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm font-medium text-gray-900">{info.organizerName}</p>
                                <p className="truncate text-sm text-gray-500">{info.organizerAddress}</p>
                            </a>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Badge>{info.helpingCategory}</Badge>
                    <p className='mt-2 text-sm'>{info.message}</p>
                </CardContent>
                <CardFooter className='flex flex-wrap flex-row justify-end gap-2'>
                    <Button onClick={() => rejectCollaborator()} size="sm" className='px-2 gap-1 w-full sm:w-auto bg-red-600 hover:bg-red-500'><Cross2Icon className='h-2 w-2'/>Reject request</Button>
                    <Button onClick={() => acceptCollaborator()} size="sm" className='px-2 gap-1 w-full sm:w-auto'><Check className='h-2 w-2'/>Accept Collaborator</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Requests