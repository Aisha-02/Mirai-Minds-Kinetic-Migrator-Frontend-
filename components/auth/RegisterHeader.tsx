import Image from "next/image";
import { registerCopy } from "@/lib/mock/register";

export function RegisterHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/kinetic-logo.png"
        alt={registerCopy.logoAlt}
        width={411}
        height={179}
        className="mb-[22px] h-[106px] w-auto rounded-lg"
        priority
      />
      <div className="flex flex-col items-center gap-[17px]">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          {registerCopy.title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {registerCopy.subtitle}
        </p>
      </div>
    </div>
  );
}
