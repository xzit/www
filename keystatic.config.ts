import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
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
        projects: fields.array(
          fields.relationship({
            label: "Proyectos destacados",
            collection: "projects",
          }),
          {
            label: "Proyectos destacados",
            itemLabel: (props) => props.value || "Selecciona un proyecto",
          },
        ),
      },
    }),
    sidebar: singleton({
      label: "Sidebar",
      path: "src/content/sidebar",
      schema: {
        about: fields.object({
          title: fields.text({ label: "Título" }),
          description: fields.markdoc.inline({
            label: "Descripción",
          }),
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
            url: fields.text({ label: "URL" }),
          }),
          {
            label: "Red social",
            itemLabel: (props) =>
              props.fields.label.value || "Selecciona una red social",
          },
        ),
      },
    }),
    settings: singleton({
      label: "Configuración",
      path: "src/content/settings",
      schema: {
        title: fields.text({ label: "Título" }),
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
});
