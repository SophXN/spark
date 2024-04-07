import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";

interface EventCardProps {
  image: string;
}

export function EventCard({ image }: EventCardProps) {
  return (
    <Card className="col-span-1 flex flex-col">
      <CardContent className="py-3 px-3">
        <Image
          src={image}
          alt="Event"
          className="h-[200px] w-full rounded object-cover"
          width={500}
          height={500}
        />
        <div className="py-2">
          <Badge className="mr-1" variant="secondary">Sponsor spots · 3</Badge>
          <Badge variant="secondary">Collab spots · 1</Badge>
        </div>
        <CardTitle>AAIP Pop Up</CardTitle>
        <CardDescription className="py-1 text-orange-400">
          Fri, Mar 17 9:00am
        </CardDescription>
        <CardDescription>345 Brettly Way Brooklyn, NY 12311</CardDescription>
        <div className="relative flex items-center space-x-1 pt-2">
          <div className="flex-shrink-0">
            <Image className="h-5 w-5 rounded-full"
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Business Logo"
              width="100"
              height="100" />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Larry&apos;s Ca Phé</p>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
