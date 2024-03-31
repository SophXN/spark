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
    <Card className="w-[350px]">
      <CardHeader>
        <Image
          src={image}
          alt="Event"
          className="h-[200px] w-full rounded object-cover"
          width={100}
          height={100}
        />
        <div className="space-x-2">
          <Badge variant="secondary">Sponsor spots · 3</Badge>
          <Badge variant="secondary">Collab spots · 1</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardTitle>AAIP Pop Up</CardTitle>
        <CardDescription className="text-orange-400">
          Fri, Mar 17 9:00am
        </CardDescription>
        <CardDescription>345 Brettly Way Brooklyn, NY 12311</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-start gap-3">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Business Logo"
          className="h-8 w-8 rounded-full"
          width={20}
          height={20}
        />
        Larry&apos;s Ca Phé
      </CardFooter>
    </Card>
  );
}
