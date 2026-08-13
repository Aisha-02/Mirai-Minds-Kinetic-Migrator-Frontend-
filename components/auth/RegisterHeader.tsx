import Image from "next/image";
import { registerCopy } from "@/lib/mock/register";

export function RegisterHeader() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Image
        src="/kinetic-logo.png"
        alt={registerCopy.logoAlt}
        width={500}
        height={500}
        className="mb-2 h-36 w-auto"
        priority
      />
      <h1 className="font-headline-md text-headline-md text-on-surface">
        {registerCopy.title}
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        {registerCopy.subtitle}
      </p>
    </div>
  );
}
