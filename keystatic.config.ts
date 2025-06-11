import { config, fields, collection, singleton } from "@keystatic/core";

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
      name: "Xzit",
      // mark: () => <img src="/favicon.svg" alt="Joaquín Olivas" height={24} />,
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
        title: fields.slug({ name: { label: "Título" } }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Contenido" }),
        published: fields.date({
          label: "Publicado",
        }),
        seo: fields.object({
          title: fields.text({ label: "Título SEO" }),
          description: fields.text({
            label: "Descripción SEO",
            multiline: true,
          }),
        }),
      },
    }),
    pages: collection({
      label: "Páginas",
      slugField: "title",
      path: "src/content/pages/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Contenido" }),
        seo: fields.object({
          title: fields.text({ label: "Título SEO" }),
          description: fields.text({
            label: "Descripción SEO",
            multiline: true,
          }),
        }),
      },
    }),
    projects: collection({
      label: "Proyectos",
      slugField: "title",
      path: "src/content/projects/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
        }),
        content: fields.markdoc({ label: "Contenido" }),
        status: fields.select({
          label: "Estado",
          options: [
            { label: "En línea", value: "published" },
            { label: "En desarrollo", value: "in-progress" },
            { label: "En pausa", value: "paused" },
          ],
          defaultValue: "paused",
        }),
        url: fields.url({ label: "URL" }),
        image: fields.image({ label: "Imagen" }),
        seo: fields.object({
          title: fields.text({ label: "Título SEO" }),
          description: fields.text({
            label: "Descripción SEO",
            multiline: true,
          }),
        }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: "Inicio",
      path: "src/content/home",
      schema: {
        about: fields.object({
          title: fields.text({ label: "Título" }),
          description: fields.markdoc.inline({
            label: "Descripción",
          }),
          cv: fields.file({
            label: "CV",
            directory: "public/files/resumes",
            publicPath: "/files/resumes/",
          }),
          social: fields.array(
            fields.object({
              label: fields.select({
                label: "Red social",
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
              label: "Red social",
              itemLabel: (props) =>
                props.fields.label.value || "Selecciona una red social",
            },
          ),
        }),
        projects: fields.array(
          fields.relationship({
            label: "Proyectos",
            collection: "projects",
          }),
          {
            label: "Proyectos",
            itemLabel: (props) => props.value || "Selecciona un proyecto",
          },
        ),
        stack: fields.array(
          fields.object({
            tech: fields.select({
              label: "Tecnologías",
              options: [
                { label: "Next.js", value: "nextjs" },
                { label: "React.js", value: "reactjs" },
                { label: "Node.js", value: "nodejs" },
                { label: "Supabase", value: "supabase" },
                { label: "Tailwind CSS", value: "tailwindcss" },
                { label: "Vercel", value: "vercel" },
                { label: "Figma", value: "figma" },
              ],
              defaultValue: "nextjs",
            }),
          }),
          {
            label: "Tecnologías",
            itemLabel: (props) =>
              props.fields.tech.value || "Selecciona una tecnología",
          },
        ),
        seo: fields.object({
          title: fields.text({ label: "Título SEO" }),
          description: fields.text({
            label: "Descripción SEO",
            multiline: true,
          }),
        }),
      },
    }),
    blog: singleton({
      label: "Blog",
      path: "src/content/blog",
      schema: {
        title: fields.text({ label: "Título" }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
        }),
        seo: fields.object({
          title: fields.text({ label: "Título SEO" }),
          description: fields.text({
            label: "Descripción SEO",
            multiline: true,
          }),
        }),
      },
    }),
    settings: singleton({
      label: "Configuración",
      path: "src/content/settings",
      schema: {
        author: fields.text({ label: "Autor" }),
        email: fields.text({ label: "Correo electrónico" }),
        seo: fields.object({
          title: fields.text({ label: "Título SEO" }),
          description: fields.text({
            label: "Descripción SEO",
            multiline: true,
          }),
        }),
        navbar: fields.object({
          github: fields.url({ label: "Github" }),
        }),
        footer: fields.object({
          timezone: fields.select({
            label: "Zona horaria",
            options: [
              { label: "America/Mexico_City", value: "America/Mexico_City" },
            ],
            defaultValue: "America/Mexico_City",
          }),
          location: fields.text({ label: "Ubicación" }),
          coordinates: fields.text({ label: "Coordenadas" }),
        }),
      },
    }),
  },
});
