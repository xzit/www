"use client";

import type { ComponentType, SVGProps } from "react";

import {
  AstroIcon,
  BetterAuthIcon,
  FlutterIcon,
  NestjsIcon,
  NextjsIcon,
  PrismaIcon,
  ReactJsIcon,
  ShadcnUiIcon,
  SupabaseIcon,
  TailwindCssIcon,
  VercelIcon,
} from "@/icons/brands";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  stack: readonly { stack: keyof typeof iconMap }[];
};

const iconMap: Record<
  string,
  { name: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  reactjs: { name: "React.js", icon: ReactJsIcon },
  nextjs: { name: "Next.js", icon: NextjsIcon },
  astro: { name: "Astro", icon: AstroIcon },
  nestjs: { name: "NestJS", icon: NestjsIcon },
  prisma: { name: "Prisma", icon: PrismaIcon },
  supabase: { name: "Supabase", icon: SupabaseIcon },
  flutter: { name: "Flutter", icon: FlutterIcon },
  shadcnui: { name: "shadcn/ui", icon: ShadcnUiIcon },
  betterauth: { name: "Better Auth", icon: BetterAuthIcon },
  tailwindcss: { name: "Tailwind CSS", icon: TailwindCssIcon },
  vercel: { name: "Vercel", icon: VercelIcon },
};

export default function Stack({ stack }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-0">
        <CardContent className="p-0">
          <TooltipProvider>
            <div className="grid w-full grid-cols-3 items-center justify-center divide-x divide-y sm:grid-cols-6 sm:divide-y-0">
              {stack.map((value, i) => {
                const iconData = iconMap[value.stack];
                if (!iconData) return null;

                const { icon: Icon, name } = iconData;

                return (
                  <Tooltip key={value.stack}>
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
