import { z } from "zod";

export const ContentSchema = z.object({
  link: z.string(),
  type: z.enum(["link", "image", "audio", "video", "tweet", "youtube"]),
  title: z.string().min(1, "Title needed."),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
