import { ServiceType } from "@prisma/client";

function enumToStringArray(enumObj: any): string[] {
    return Object.keys(enumObj).filter(key => isNaN(Number(key)));
}

export const serviceTypeKeys = enumToStringArray(ServiceType);