import React from 'react';
import { useState, useEffect } from 'react';
import Request from '~/components/Requests';
import DeniedRequests from '~/components/DeniedRequests';
import AcceptedRequests from './AcceptedRequests';

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

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
    const activeTab = tabs.find((tab) => tab.current).name
    console.log(tabs)

    const handleTabClick = (clickedTab: Tab) => {
        // Potentially some logic here
        console.log(clickedTab)
        if (tabs.find((tab) => tab.current).name == clickedTab.name) {
            // clicked an selected tab
            return
        }
        const updatedTabs = tabs.map(tab =>
            tab.name === clickedTab.name ? { ...tab, current: true } : { ...tab, current: false }
        );
        //unselected we load the data from the 
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
                {activeTab === 'Requests' && <Request />}
                {activeTab === 'Accepted' && <AcceptedRequests />}
                {activeTab === 'Denied' && <DeniedRequests />}
            </div>
        </div>
    )
}