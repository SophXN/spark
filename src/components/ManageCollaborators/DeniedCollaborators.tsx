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
import { RefreshCcwIcon } from "lucide-react";
import { type CollaboratorResponse } from "@prisma/client";

interface DeniedData {
  deniedCollaborators: CollaboratorResponse[];
}

export const DeniedCollaborators: React.FC<DeniedData> = ({
  deniedCollaborators,
}) => {
  const revokeDenial = () => console.log("Revoke denial");
  return (
    <div>
      {deniedCollaborators.map((item) => (
        <Card className="mt-2" key={item.id}>
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
          <CardFooter className="gap-21 flex flex-row flex-wrap justify-end">
            <Button
              onClick={() => revokeDenial()}
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
  );
};