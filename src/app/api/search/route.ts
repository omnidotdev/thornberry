import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/providers";

export const { GET } = createFromSource(source);
