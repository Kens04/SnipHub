import { z } from "zod";
import { CreateSnippetSchema } from "../_lib/CreateSnippetSchema";

export type createSnippetType = z.infer<typeof CreateSnippetSchema>;