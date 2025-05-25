"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  RiFigmaFill,
  RiNextjsFill,
  RiNodejsFill,
  RiReactjsFill,
  RiSupabaseFill,
  RiTailwindCssFill,
  RiVercelFill,
  type RemixiconComponentType,
} from "@remixicon/react";

type Props = {
  stack: readonly { tech: keyof typeof iconMap }[];
};

const iconMap: Record<string, { name: string; icon: RemixiconComponentType }> =
  {
    nextjs: { name: "Next.js", icon: RiNextjsFill },
    reactjs: { name: "React.js", icon: RiReactjsFill },
    nodejs: { name: "Node.js", icon: RiNodejsFill },
    supabase: { name: "Supabase", icon: RiSupabaseFill },
    tailwindcss: { name: "Tailwind CSS", icon: RiTailwindCssFill },
    vercel: { name: "Vercel", icon: RiVercelFill },
    figma: { name: "Figma", icon: RiFigmaFill },
  };

export default function TechStack({ stack }: Props) {
  return (
    <TooltipProvider>
      <div className="grid w-full grid-cols-3 items-center justify-center divide-x sm:grid-cols-6">
        {stack.map((stack) => {
          const iconData = iconMap[stack.tech];
          if (!iconData) return null;

          const { icon: Icon, name } = iconData;

          return (
            <Tooltip key={stack.tech}>
              <TooltipTrigger asChild>
                <div className="hover:bg-accent dark:hover:bg-accent/50 flex aspect-square items-center justify-center p-4 transition-colors">
                  <Icon className="size-16" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
