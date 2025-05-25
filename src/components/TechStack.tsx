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
      {stack.map((stack) => {
        const iconData = iconMap[stack.tech];
        if (!iconData) return null;

        const { icon: Icon, name } = iconData;

        return (
          <Tooltip key={stack.tech}>
            <TooltipTrigger asChild>
              <div>
                <Icon className="size-12" />
              </div>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
}
