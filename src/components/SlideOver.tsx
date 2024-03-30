import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EventSponsors } from "./EventSponsors";

interface SlideOverProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function SlideOver({ open, setOpen }: SlideOverProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-[50vw]">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="bg-slate-50 px-4 sm:px-6 ">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Create an event
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 space-y-4 px-4 sm:px-6">
                      <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input
                          type="text"
                          id="event-title"
                          placeholder="Name your event"
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          type="text"
                          id="event-description"
                          placeholder="We plan to bring the community together..."
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="upload">Upload</Label>
                        <Label htmlFor="description">
                          This will appear at the top of your event page and on
                          the home page across our platform
                        </Label>
                        <Button id="event-description" variant="outline">
                          Upload
                        </Button>
                      </div>
                      <EventSponsors />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
