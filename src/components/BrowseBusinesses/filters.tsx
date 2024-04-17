"use client"
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { mcc, mccObject } from "~/utils/mcc";
import { useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Check, ChevronsUpDown } from "lucide-react"
import { Combobox } from '@headlessui/react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

import React from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const Filters: React.FC = () => {

    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    console.log(mcc)

    const filteredCategories =
        query === ''
            ? mcc
            : mcc.filter((person) => {
                return person.value.toLowerCase().includes(query.toLowerCase())
            })

    return (
        <div className="flex flex-row flex-wrap gap-2">
            <div className="w-full sm:w-64">
                <div className="grid items-center gap-1.5">
                    <Label>Filter by city</Label>
                    <Input
                        id="locationSearch"
                        type="text"
                        placeholder="Type a city"
                        className="pl-2"
                    />
                </div>
            </div>
            <div className="w-full sm:w-64">
                <div className="grid items-center gap-1.5">
                    <Label>Category</Label>
                    <Combobox as="div" value={selectedCategory} onChange={setSelectedCategory}>
                        <div className="relative">
                            <Combobox.Input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(event) => setQuery(event.target.value)}
                                displayValue={query}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-2 w-2 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>

                            {filteredCategories.length > 0 && (
                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredCategories.map((category) => (
                                        <Combobox.Option
                                            key={category.value}
                                            value={category.value}
                                            className={({ active }) =>
                                                classNames(
                                                    'font-normal mx-1 relative rounded-md cursor-default select-none py-1 pl-8 pr-4',
                                                    active ? 'bg-slate-100 text-slate-900' : 'text-slate-900'
                                                )
                                            }
                                        >
                                            {({ active, selected }) => (
                                                <>
                                                    <span className={classNames('block truncate', selected)}>{category.value}</span>
                                                    {selected && (
                                                        <span
                                                            className={classNames(
                                                                'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                                                active ? 'text-slate-600' : 'text-slate-600'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-2 w-3" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            )}
                        </div>
                    </Combobox>
                </div>
            </div>
            <div className="w-full sm:w-64">
                <div className="grid items-center gap-1.5">
                    <Label>Store type</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default Filters;