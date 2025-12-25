import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: {
      owner: "xzit",
      name: "www",
    },
  },
  ui: {
    brand: {
      name: "XZIT",
      mark: () => <img src="/favicon.svg" alt="XZIT" height={24} />,
    },
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Content" }),
        published: fields.date({
          label: "Published",
        }),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
      },
    }),
    pages: collection({
      label: "Pages",
      slugField: "title",
      path: "src/content/pages/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Content" }),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
      },
    }),
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "src/content/projects/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Content" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Live", value: "published" },
            { label: "In development", value: "in-progress" },
            { label: "Paused", value: "paused" },
          ],
          defaultValue: "paused",
        }),
        url: fields.url({ label: "URL" }),
        github: fields.text({ label: "Github" }),
        image: fields.image({ label: "Image" }),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
      },
    }),
    repos: collection({
      label: "Repos",
      slugField: "title",
      path: "src/content/repos/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Content" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Live", value: "published" },
            { label: "In development", value: "in-progress" },
            { label: "Paused", value: "paused" },
          ],
          defaultValue: "paused",
        }),
        url: fields.url({ label: "URL" }),
        github: fields.text({ label: "Github" }),
        image: fields.image({ label: "Image" }),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: "Home",
      path: "src/content/home",
      schema: {
        about: fields.object({
          title: fields.text({ label: "Title" }),
          description: fields.markdoc.inline({
            label: "Description",
          }),
          cv: fields.file({
            label: "CV",
            directory: "public/files/resumes",
            publicPath: "/files/resumes/",
          }),
          social: fields.array(
            fields.object({
              label: fields.select({
                label: "Social",
                options: [
                  { label: "Github", value: "github" },
                  { label: "LinkedIn", value: "linkedin" },
                  { label: "Facebook", value: "facebook" },
                  { label: "Instagram", value: "instagram" },
                  { label: "X", value: "x" },
                  { label: "Bluesky", value: "bluesky" },
                ],
                defaultValue: "github",
              }),
              url: fields.url({ label: "URL" }),
            }),
            {
              label: "Social",
              itemLabel: (props) =>
                props.fields.label.value || "Select a social",
            },
          ),
        }),
        projects: fields.array(
          fields.relationship({
            label: "Projects",
            collection: "projects",
          }),
          {
            label: "Projects",
            itemLabel: (props) => props.value || "Select a project",
          },
        ),
        stack: fields.array(
          fields.object({
            item: fields.select({
              label: "Stack",
              options: [
                { label: "React.js", value: "reactjs" },
                { label: "Next.js", value: "nextjs" },
                { label: "Astro", value: "astro" },
                { label: "NestJS", value: "nestjs" },
                { label: "Prisma", value: "prisma" },
                { label: "Supabase", value: "supabase" },
              ],
              defaultValue: "reactjs",
            }),
          }),
          {
            label: "Stack",
            itemLabel: (props) => props.fields.item.value || "Select a stack",
          },
        ),
        repos: fields.array(
          fields.relationship({
            label: "Repos",
            collection: "repos",
          }),
          {
            label: "Repos",
            itemLabel: (props) => props.value || "Select a repo",
          },
        ),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
      },
    }),
    blog: singleton({
      label: "Blog",
      path: "src/content/blog",
      schema: {
        title: fields.text({ label: "Title" }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
      },
    }),
    settings: singleton({
      label: "Settings",
      path: "src/content/settings",
      schema: {
        author: fields.text({ label: "Author" }),
        email: fields.text({ label: "Email" }),
        seo: fields.object({
          title: fields.text({ label: "Title SEO" }),
          description: fields.text({
            label: "Description SEO",
            multiline: true,
          }),
        }),
        navbar: fields.object({
          github: fields.url({ label: "Github" }),
        }),
        footer: fields.object({
          timezone: fields.select({
            label: "Timezone",
            options: [
              { label: "America/Mexico_City", value: "America/Mexico_City" },
            ],
            defaultValue: "America/Mexico_City",
          }),
          location: fields.text({ label: "Location" }),
          coordinates: fields.text({ label: "Coordinates" }),
        }),
      },
    }),
  },
});
