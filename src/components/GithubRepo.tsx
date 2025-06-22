import { RiGitForkLine, RiStarLine } from "@remixicon/react";
import { useEffect, useState } from "react";

export function GitHubRepo({ repo }: { repo: string }) {
  return <GithubCount repo={repo} />;
}

function GithubCount({ repo }: { repo: string }) {
  const [stars, setStars] = useState<number | "-">("-");
  const [forks, setForks] = useState<number | "-">("-");

  useEffect(() => {
    fetch(`/api/github/repos?repo=${repo}`)
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count);
        setForks(data.forks_count);
      });
  }, [repo]);

  if (stars === null || forks === null) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <RiStarLine className="size-4" />
        <span className="text-muted-foreground text-sm tabular-nums">
          {typeof stars === "number"
            ? stars >= 1000
              ? `${(stars / 1000).toFixed(1)}k`
              : stars.toLocaleString()
            : "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <RiGitForkLine className="size-4" />
        <span className="text-muted-foreground text-sm tabular-nums">
          {typeof forks === "number"
            ? forks >= 1000
              ? `${(forks / 1000).toFixed(1)}k`
              : forks.toLocaleString()
            : "-"}
        </span>
      </div>
    </div>
  );
}
