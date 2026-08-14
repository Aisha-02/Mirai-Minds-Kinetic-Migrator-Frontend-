import Image from "next/image";
import { signInCopy } from "@/lib/mock/signin";

export function SignInHeader() {
  return (
    <div className="flex flex-col items-center gap-[17px] text-center">
      <Image
        src="/kinetic-logo.png"
        alt={signInCopy.logoAlt}
        width={411}
        height={179}
        className="h-[106px] w-auto rounded-lg"
        priority
      />
      <p className="font-body-md text-body-md text-on-surface-variant">
        {signInCopy.subtitle}
      </p>
    </div>
  );
}
