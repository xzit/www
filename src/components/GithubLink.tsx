import { buttonVariants } from "@/components/ui/button";
import { RiGithubFill } from "@remixicon/react";
import { cn } from "@/lib/utils";

export function GitHubLink({ repo }: { repo: string }) {
  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "ghost" }))}
    >
      <RiGithubFill className="size-5" />
      <StarsCount repo={repo} />
    </a>
  );
}

export async function StarsCount({ repo }: { repo: string }) {
  const data = await fetch(`https://api.github.com/repos/${repo}`);
  const json = await data.json();

  return (
    json.stargazers_count && (
      <span className="text-muted-foreground tabular-nums">
        {json.stargazers_count >= 1000
          ? `${(json.stargazers_count / 1000).toFixed(1)}k`
          : json.stargazers_count.toLocaleString()}
      </span>
    )
  );
}
