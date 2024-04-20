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
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                    />
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
