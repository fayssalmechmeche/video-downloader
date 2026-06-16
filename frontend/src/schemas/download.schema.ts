import { z } from "zod";

export const downloadSchema = z.object({
  url: z.string().url("L'URL n'est pas valide"),
});

export type DownloadFormValues = z.infer<typeof downloadSchema>;
