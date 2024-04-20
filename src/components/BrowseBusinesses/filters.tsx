"use client"
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { mcc } from "~/utils/mcc";
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { BusinessType, filterObject, BrowseMerchantsQuery } from "~/types/types";

import React from "react";

interface filterProps {
    onChange: (value: filterObject) => void;
}

const Filters: React.FC<filterProps> = ({ onChange }) => {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [inputValue, setInputValue] = useState('');
    const [filterObject, setFilterObject] = React.useState<filterObject>({ location: "", merchantCode: "", type: BusinessType.PHYSICAL })

    useEffect(() => {
        console.log("updated")
        console.log(filterObject, "<= before query");
        if (filterObject.location === "") {
            delete filterObject.location;
        }
        if (filterObject.merchantCode === "") {
            delete filterObject.merchantCode
        }
        onChange(filterObject);
    }, [filterObject])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        console.log(event)
        if (event.key === 'Enter') {
            filterObject.location = event.currentTarget.value;
            setFilterObject(prevState => ({
                ...prevState,
                location: filterObject.location
            }));
        }
    };

    const handleInputChange = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        setInputValue(event.currentTarget.value); // Update the temporary input value
    };

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
                        defaultValue={filterObject.location}
                        onKeyDown={handleKeyDown}
                        onChange={() => handleInputChange}
                    />
                </div>
            </div>
            <div className="w-full sm:w-64">
                <div className="grid items-center gap-1.5">
                    <Label>Filter by category</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="justify-between sm:w-64 overflow-hidden px-2"
                            >
                                {value
                                    ? mcc.find((framework) => framework.value === value)?.label
                                    : "Select a category..."}
                                <ChevronsUpDown className="ml-2 h-2 w-2 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                            <Command>
                                <CommandInput placeholder="Search framework..." className='border-0 focus:ring-0' />
                                <CommandList>
                                    <CommandEmpty>No category found, try again.</CommandEmpty>
                                    <CommandGroup>
                                        {mcc.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                    filterObject.merchantCode = currentValue;
                                                    setFilterObject(prevState => ({
                                                        ...prevState,
                                                        merchantCode: framework.mcc
                                                    }));
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-2 w-2",
                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {framework.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="w-full sm:w-64">
                <div className="grid items-center gap-1.5">
                    <Label>Filter by business type</Label>
                    <Select onValueChange={(e) => {
                        setFilterObject(prevState => ({
                            ...prevState,
                            type: e as BusinessType
                        }));
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={BusinessType.MOBILE}>{BusinessType.MOBILE}</SelectItem>
                                <SelectItem value={BusinessType.PHYSICAL}>{BusinessType.PHYSICAL}</SelectItem>
                                <SelectItem value={BusinessType.VIRTUAL}>{BusinessType.VIRTUAL}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default Filters;