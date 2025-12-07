"use client";

import {
  ListboxRoot,
  ListboxLabel,
  ListboxContent,
  ListboxItem,
  ListboxItemText,
  ListboxItemIndicator,
  createListCollection,
} from "@/components/listbox";

export function ListboxDemo() {
  const collection = createListCollection({
    items: ["React", "Vue", "Svelte", "Solid"],
  });

  return (
    // @ts-expect-error - collection type mismatch between Ark UI and TypeScript
    <ListboxRoot collection={collection} className="mb-8">
      <ListboxLabel>Select Framework</ListboxLabel>
      <ListboxContent>
        {collection.items.map((item) => (
          <ListboxItem key={item} item={item}>
            <ListboxItemText>{item}</ListboxItemText>
            <ListboxItemIndicator />
          </ListboxItem>
        ))}
      </ListboxContent>
    </ListboxRoot>
  );
}
