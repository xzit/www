"use client";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  type RemixiconComponentType,
  RiFigmaFill,
  RiFlutterFill,
  RiNextjsFill,
  RiNodejsFill,
  RiReactjsFill,
  RiSupabaseFill,
  RiTailwindCssFill,
  RiVercelFill,
} from "@remixicon/react";

type Props = {
  stack: readonly { tech: keyof typeof iconMap }[];
};

const iconMap: Record<string, { name: string; icon: RemixiconComponentType }> =
  {
    nextjs: { name: "Next.js", icon: RiNextjsFill },
    reactjs: { name: "React.js", icon: RiReactjsFill },
    flutter: { name: "Flutter", icon: RiFlutterFill },
    nodejs: { name: "Node.js", icon: RiNodejsFill },
    supabase: { name: "Supabase", icon: RiSupabaseFill },
    tailwindcss: { name: "Tailwind CSS", icon: RiTailwindCssFill },
    vercel: { name: "Vercel", icon: RiVercelFill },
    figma: { name: "Figma", icon: RiFigmaFill },
  };

export default function TechStack({ stack }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-0">
        <CardContent className="p-0">
          <TooltipProvider>
            <div className="grid w-full grid-cols-3 items-center justify-center divide-x divide-y sm:grid-cols-6 sm:divide-y-0">
              {stack.map((value, i) => {
                const iconData = iconMap[value.tech];
                if (!iconData) return null;

                const { icon: Icon, name } = iconData;

                return (
                  <Tooltip key={value.tech}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "hover:bg-accent dark:hover:bg-accent/50 flex aspect-square items-center justify-center p-4 transition-colors",
                          i >= stack.length - 3 && "border-b-0",
                          (i + 1) % 3 === 0 &&
                            "border-r-0 last:border-r-0 sm:border-r",
                        )}
                      >
                        <Icon className="size-16" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={-30}>
                      {name}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
