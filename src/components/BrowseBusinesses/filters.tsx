"use client"
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { mcc } from "~/utils/mcc";
import { useState } from 'react'
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

import React from "react";

const Filters: React.FC = () => {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    console.log(mcc)

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
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="justify-between w-64 overflow-hidden px-2"
                            >
                                {value
                                    ? mcc.find((framework) => framework.value === value)?.label
                                    : "Select a category..."}
                                <ChevronsUpDown className="ml-2 h-2 w-2 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                            <Command>
                                <CommandInput placeholder="Search framework..." className='border-0 focus:ring-0'/>
                                <CommandList>
                                    <CommandEmpty>No framework found.</CommandEmpty>
                                    <CommandGroup>
                                        {mcc.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
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