import { Image } from "@/components/ui/image";

export default function MintBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true">
      <Image
        src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/fdc6078dc_generated_image.png"
        alt=""
        className="h-full w-full"
        fittingType="fill"
      />
      <div className="absolute inset-0 bg-slate-950/55" />
    </div>
  );
}