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
import { MailIcon, RefreshCcwIcon } from "lucide-react";
import { CollaboratorResponseStatus } from "@prisma/client";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { type CollaboratorResponseExtended } from "~/types/types";
import EmptyState from "../EmptyState";
import Image from "next/image";

interface AcceptedDataProps {
  acceptedCollaborators: CollaboratorResponseExtended[];
}

export const AcceptedCollaborators = ({
  acceptedCollaborators,
}: AcceptedDataProps) => {
  const openEmail = () => console.log("hi");
  const queryClient = useQueryClient();
  const collaboratorResponseMutatation =
    api.collaboratorResponse.updateStatusOfCollaboratorResponse.useMutation();
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
      {acceptedCollaborators.length > 0 ? (
        <div>
          {acceptedCollaborators.map((item) => (
            <Card className="mt-2" key={item.id}>
              <CardHeader>
                <div className="relative flex items-center space-x-2 rounded-lg">
                  {item.responder.profilePicture ? (
                    <div className="flex-shrink-0">
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
                    <div className="h-12 w-12 flex-shrink-0">
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
                  <div className="min-w-0 flex-1">
                    <a>
                      <p className="text-sm font-medium text-gray-900">
                        {item.responder.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {item.responder.address}
                      </p>
                    </a>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      onClick={() => openEmail()}
                      size="sm"
                      className="w-full gap-1 bg-slate-900 px-2 hover:bg-slate-800 sm:w-auto"
                    >
                      <MailIcon className="w-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge>{item.serviceType}</Badge>
                <p className="mt-2 text-sm">{item.responseMessage}</p>
              </CardContent>
              <CardFooter className="gap-21 flex flex-row flex-wrap justify-end">
                <Button
                  onClick={() =>
                    updateCollaboratorResponseStatusV2(
                      item.eventRequestId,
                      item.id,
                      CollaboratorResponseStatus.PENDING,
                    )
                  }
                  size="sm"
                  className="w-full gap-1 bg-slate-600 px-2 hover:bg-slate-500 sm:w-auto"
                >
                  <RefreshCcwIcon className="w-2" />
                  Revoke
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No accepted requests yet." description="You can accept requests from the Request tab"></EmptyState>
      )}
    </div>
  );
};
