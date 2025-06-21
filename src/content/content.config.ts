import { defineCollection, z } from "astro:content";

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        content: z.string(),
        published: z.coerce.date().optional(),
        seo: seoSchema,
      }),
  }),

  pages: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().optional(),
        content: z.string(),
        seo: seoSchema,
      }),
  }),

  projects: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().optional(),
        content: z.string().optional(),
        status: z.enum(["published", "in-progress", "paused"]),
        url: z.string().url().optional(),
        github: z.string().optional(),
        image: image().optional(),
        seo: seoSchema,
      }),
  }),
};
