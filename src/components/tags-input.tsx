"use client";

import {
  TagsInputClearTrigger,
  TagsInputContext,
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputLabel,
  TagsInputRoot,
} from "@/registry/thornberry/components/tags-input";

const TagsInput = () => {
  return (
    <TagsInputRoot
      className="mb-4"
      defaultValue={["Backfeed", "Runa", "Garden"]}
    >
      <TagsInputContext>
        {({ value }) => (
          <>
            <TagsInputLabel>Application(s)</TagsInputLabel>

            <div className="mt-2 grid rounded-md border">
              {!!value.length && (
                <TagsInputControl>
                  {value.map((value, index) => (
                    <TagsInputItem key={value} index={index} value={value}>
                      <TagsInputItemPreview>
                        <TagsInputItemText>{value}</TagsInputItemText>

                        <TagsInputItemDeleteTrigger />
                      </TagsInputItemPreview>

                      <TagsInputItemInput />
                    </TagsInputItem>
                  ))}
                </TagsInputControl>
              )}

              <TagsInputInput placeholder="Add application..." />
            </div>

            <TagsInputClearTrigger />
          </>
        )}
      </TagsInputContext>
    </TagsInputRoot>
  );
};

export default TagsInput;
