import React from 'react';
import { useState, useEffect } from 'react';
import Request from '~/components/ManageCollaborators/Requests';
import DeniedRequests from '~/components/DeniedRequests';
import AcceptedRequests from '../AcceptedRequests';
import { CollaboratorResponse, ServiceType } from '@prisma/client';
import { RequestCardInfo, RequestStatus, RequestCardInfoArray } from '~/types/types';

var defaultTabs: Tab[] = [
    { name: 'Requests', href: '#requests', current: true },
    { name: 'Accepted', href: '#accepted', current: false },
    { name: 'Denied', href: '#denied', current: false },
]

interface Tab {
    name: string,
    href: string,
    current: boolean
}

const arrayOfRequests: RequestCardInfo[] = [
    { organizerAddress: '484 humboldt st', organizerName: 'Landon Co', helpingCategory: ServiceType.FOOD, message: "A lovely message from the collaborator about how much they want to help", requestId: "123123", status: RequestStatus.denied },
    { organizerAddress: '499 francis grove', organizerName: 'Landon Co', helpingCategory: ServiceType.ART, message: "A lovely message from the collaborator about how much they want to help", requestId: "123653", status: RequestStatus.pending },
    { organizerAddress: 'CTown markets', organizerName: 'Landon Co', helpingCategory: ServiceType.SPACE, message: "A lovely message from the collaborator about how much they want to help", requestId: "198823", status: RequestStatus.pending },
    { organizerEmail: "landonvagohughes@gmail.com", organizerAddress: 'CTown markets', organizerName: 'Landon Co', helpingCategory: ServiceType.OTHER, message: "A lovely message from the collaborator about how much they want to help", requestId: "198823", status: RequestStatus.accepted }
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
    const activeTab = tabs.find((tab) => tab.current).name
    console.log(tabs)

    const handleTabClick = (clickedTab: Tab) => {

        if (tabs.find((tab) => tab.current).name == clickedTab.name) {
            // clicked the active tab
            return
        }
        const updatedTabs = tabs.map(tab =>
            tab.name === clickedTab.name ? { ...tab, current: true } : { ...tab, current: false }
        );
        //unselected we load the data from the new tab
        setTabs(updatedTabs)
    };

    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 my-2 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
                    defaultValue={tabs.find((tab) => tab.current).name}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a
                                key={tab.name}
                                href={tab.href}
                                onClick={() => handleTabClick(tab)}
                                className={classNames(
                                    tab.current
                                        ? 'border-slate-600 text-slate-700'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'whitespace-nowrap border-b-2 py-2 mt-1 text-sm font-medium'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                {tab.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
            <div className='mt-2'>
                {activeTab === 'Requests' && (
                    <Request infoCards={arrayOfRequests.filter(request => request.status === RequestStatus.pending)} />
                )}
                {activeTab === 'Accepted' && <AcceptedRequests />}
                {activeTab === 'Denied' && <DeniedRequests />}
            </div>
        </div>
    )
}