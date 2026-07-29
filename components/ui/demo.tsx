import { GooeyLoader } from "@/components/ui/loader-10";

export default function GooeyLoaderDemo() {
  return (
    // A minimal container to center the component for presentation.
    <div className="flex items-center justify-center w-full min-h-[250px]">
      <GooeyLoader
        primaryColor="#10b981" // Verde logo Casa Druetto
        secondaryColor="#059669" // Verde secundario Casa Druetto
        borderColor="#e5e7eb" // gray-200
      />
    </div>
  );
}
