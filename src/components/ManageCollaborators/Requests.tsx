"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Check } from "lucide-react";
import { CollaboratorResponseStatus } from "@prisma/client";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { type CollaboratorResponseExtended } from "~/types/types";
import Image from "next/image";

interface RequestsProps {
  collaboratorResponses: CollaboratorResponseExtended[];
}

export const Requests = ({ collaboratorResponses }: RequestsProps) => {
  const collaboratorResponseMutatation =
    api.collaboratorResponse.updateStatusOfCollaboratorResponse.useMutation();
  const queryClient = useQueryClient();

  const updateCollaboratorResponseStatusV2 = (
    eventRequestId: string,
    collaboratorResponseId: string,
    status: CollaboratorResponseStatus,
  ) => {
    collaboratorResponseMutatation.mutate(
      {
        eventRequestId: eventRequestId,
        collaboratorResponseId: collaboratorResponseId,
        status: status,
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries();
        },
      },
    );
  };
  return (
    <div>
      {collaboratorResponses.map((item) => {
        return (
          <div key={item.id}>
            <Card className="mt-2">
              <CardHeader>
                <div className="relative flex items-center space-x-2 rounded-lg">
                  <div>
                    {item.responder.profilePicture ? (
                      <div>
                        <Image
                          className="h-12 w-12 object-cover rounded-full"
                          src={item.responder.profilePicture}
                          alt="Business Logo"
                          width="100"
                          height="100"
                          layout="fixed"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12">
                        <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <a>
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {item.responder.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {item.responder.address}
                      </p>
                    </a>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge>{item.serviceType}</Badge>
                <p className="mt-2 text-sm">{item.responseMessage}</p>
              </CardContent>
              <CardFooter className="flex flex-row flex-wrap justify-end gap-2">
                <Button
                  onClick={() =>
                    updateCollaboratorResponseStatusV2(
                      item.eventRequestId,
                      item.id,
                      CollaboratorResponseStatus.DENIED,
                    )
                  }
                  size="sm"
                  className="w-full gap-1 bg-red-600 px-2 hover:bg-red-500 sm:w-auto"
                >
                  <Cross2Icon className="h-2 w-2" />
                  Reject request
                </Button>
                <Button
                  onClick={() =>
                    updateCollaboratorResponseStatusV2(
                      item.eventRequestId,
                      item.id,
                      CollaboratorResponseStatus.ACCEPTED,
                    )
                  }
                  size="sm"
                  className="w-full gap-1 px-2 sm:w-auto"
                >
                  <Check className="h-2 w-2" />
                  Accept Collaborator
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
