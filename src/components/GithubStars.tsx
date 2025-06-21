import { buttonVariants } from "@/components/ui/button";
import { RiGithubFill } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function GitHubLink({ repo }: { repo: string }) {
  return (
    <div className="flex items-center gap-2">
      <RiGithubFill className="size-6" />
      <StarsCount repo={repo} />
    </div>
  );
}

function StarsCount({ repo }: { repo: string }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/github/repos?repo=${repo}`)
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count));
  }, [repo]);

  if (stars === null) return null;

  return (
    <span className="text-muted-foreground text-sm tabular-nums">
      {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
    </span>
  );
}
