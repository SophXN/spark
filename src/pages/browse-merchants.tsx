"use client"

import React from "react";
import Navbar from "~/components/Navbar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { mcc } from "~/utils/mcc";

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { CommandList } from "cmdk";

const BrowseMerchantsPage: React.FC = () => {

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // console.log(mcc);

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]

  return (
    <div>
      <Navbar />
      <div className="relative w-screen flex-1 space-y-8 mb-4">
        <div className="mx-3 mt-4 grid justify-items-center">
          <div className="w-full items-center sm:max-w-4xl">
            <h3 className="text-2xl font-bold">Explore businesses to work with</h3>
          </div>
          <div className="mt-4 w-full max-w-4xl">
            <div className="flex flex-row">
              <div className="w-full sm:w-64">
                <div className="grid items-center gap-1.5">
                  <Label>City</Label>
                  <Input
                    id="locationSearch"
                    type="text"
                    placeholder="Type a city"
                    className="pl-2"
                  />
                </div>
              </div>
              <div className="w-full sm:w-64">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                    >
                      {value
                        ? mcc.find((framework) => framework.value === value)?.label
                        : "Select framework..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search framework..." />
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandList>
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
                                  "mr-2 h-4 w-4",
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseMerchantsPage;