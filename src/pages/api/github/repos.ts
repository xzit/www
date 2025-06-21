export const prerender = false;

export const config = {
  runtime: "edge",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");

  if (!repo) {
    return new Response(JSON.stringify({ error: "Missing repo param" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
