"use client";

import { useState } from "react";

import { DateTimePicker as DateTimePickerComponent } from "@/registry/thornberry/components/date-time-picker";

const DateTimePicker = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex max-w-md flex-col gap-3">
      <DateTimePickerComponent
        label="Send at"
        description="Pick when the email goes out."
        minValue="now"
        onValueChange={(details) => setValue(details.value)}
      />
      <p className="text-muted-foreground text-sm">
        Value: <code>{value ?? "null"}</code>
      </p>
    </div>
  );
};

export default DateTimePicker;
