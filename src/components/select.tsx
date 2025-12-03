"use client";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/registry/thornberry/components/button";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
} from "@/registry/thornberry/components/select";

const SelectExample = () => {
  const priorityCollection = createListCollection({
    items: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  });

  return (
    <Select
      positioning={{
        strategy: "fixed",
        placement: "bottom-end",
      }}
      collection={priorityCollection}
      loopFocus
    >
      <SelectLabel>Priority</SelectLabel>
      <SelectControl>
        <SelectTrigger asChild>
          <Button variant="outline" className="w-48 hover:bg-transparent">
            <SelectValueText placeholder="Select priority" />
            <SelectIndicator>
              <ChevronsUpDown />
            </SelectIndicator>
          </Button>
        </SelectTrigger>
      </SelectControl>

      <SelectPositioner>
        <SelectContent className="w-48 p-0">
          <SelectItemGroup className="space-y-1 p-1">
            {priorityCollection.items.map((priority) => (
              <SelectItem key={priority.value} item={priority}>
                <SelectItemText>{priority.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </SelectPositioner>
    </Select>
  );
};

export default SelectExample;
