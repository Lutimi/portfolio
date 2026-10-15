import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// One MDX file per language: src/content/work/<lang>/<slug>.mdx
const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      // Outcome-led headline, not the project name
      title: z.string(),
      project: z.string(),
      summary: z.string(),
      cover: image(),
      coverAlt: z.string(),
      // Project type pills: B2C, Marketplace, 0 to 1...
      pills: z.array(z.string()),
      role: z.string(),
      team: z.string(),
      // Duration instead of year ("6 months", not "2022")
      duration: z.string(),
      tools: z.array(z.string()).default([]),
      // The home thumbnail: one outcome line, a short band, and optionally
      // the screenshot that proves the outcome with a redline on it
      plate: z.object({
        // Short, outcome-led line for project cards; the facts table uses outcome
        headline: z.string().optional(),
        // Honest status for the card: prototype, delivered, live, concept
        status: z.string().optional(),
        outcome: z.string(),
        role: z.string(),
        team: z.string(),
        image: image().optional(),
        imageAlt: z.string().optional(),
        mark: z
          .object({
            x: z.number(),
            y: z.number(),
            w: z.number(),
            h: z.number(),
            label: z.string(),
            align: z.enum(['left', 'right']).optional(),
          })
          .optional(),
      }),
      order: z.number(),
      // Drafts render in dev only
      draft: z.boolean().default(false),
    }),
})

export const collections = { work }
