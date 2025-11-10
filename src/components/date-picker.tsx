"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/registry/thornberry/components/button";
import {
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerInput,
  DatePickerLabel,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerRoot,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from "@/registry/thornberry/components/date-picker";
import { Input } from "@/registry/thornberry/components/input";

const DatePicker = () => (
  <DatePickerRoot positioning={{ sameWidth: true }}>
    <DatePickerLabel>Select a date</DatePickerLabel>

    <DatePickerControl>
      <DatePickerInput asChild>
        <Input className="border-input" />
      </DatePickerInput>

      <DatePickerTrigger asChild>
        <Button variant="outline" aria-label="Open date picker">
          <Calendar />
        </Button>
      </DatePickerTrigger>
    </DatePickerControl>

    <DatePickerPositioner>
      <DatePickerContent className="pb-0">
        <DatePickerView className="flex flex-col gap-3" view="day">
          <DatePickerContext>
            {(datePicker) => (
              <>
                <DatePickerViewControl>
                  <DatePickerPrevTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronLeft />
                    </Button>
                  </DatePickerPrevTrigger>

                  <DatePickerViewTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <DatePickerRangeText />
                    </Button>
                  </DatePickerViewTrigger>

                  <DatePickerNextTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronRight />
                    </Button>
                  </DatePickerNextTrigger>
                </DatePickerViewControl>

                <DatePickerTable>
                  <DatePickerTableHead>
                    <DatePickerTableRow>
                      {datePicker.weekDays.map((weekDay, id) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                        <DatePickerTableHeader key={id}>
                          {weekDay.narrow}
                        </DatePickerTableHeader>
                      ))}
                    </DatePickerTableRow>
                  </DatePickerTableHead>
                  <DatePickerTableBody>
                    {datePicker.weeks.map((week, id) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                      <DatePickerTableRow key={id}>
                        {week.map((day, id) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                          <DatePickerTableCell key={id} value={day}>
                            <DatePickerTableCellTrigger>
                              {day.day}
                            </DatePickerTableCellTrigger>
                          </DatePickerTableCell>
                        ))}
                      </DatePickerTableRow>
                    ))}
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>

        <DatePickerView className="flex flex-col gap-3" view="month">
          <DatePickerContext>
            {(datePicker) => (
              <>
                <DatePickerViewControl>
                  <DatePickerPrevTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronLeft />
                    </Button>
                  </DatePickerPrevTrigger>

                  <DatePickerViewTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <DatePickerRangeText />
                    </Button>
                  </DatePickerViewTrigger>

                  <DatePickerNextTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronRight />
                    </Button>
                  </DatePickerNextTrigger>
                </DatePickerViewControl>

                <DatePickerTable>
                  <DatePickerTableBody>
                    {datePicker
                      .getMonthsGrid({ columns: 4, format: "short" })
                      .map((months, id) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                        <DatePickerTableRow key={id}>
                          {months.map((month, id) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                            <DatePickerTableCell key={id} value={month.value}>
                              <DatePickerTableCellTrigger>
                                {month.label}
                              </DatePickerTableCellTrigger>
                            </DatePickerTableCell>
                          ))}
                        </DatePickerTableRow>
                      ))}
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>

        <DatePickerView className="flex flex-col gap-3" view="year">
          <DatePickerContext>
            {(datePicker) => (
              <>
                <DatePickerViewControl>
                  <DatePickerPrevTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronLeft />
                    </Button>
                  </DatePickerPrevTrigger>

                  <DatePickerViewTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <DatePickerRangeText />
                    </Button>
                  </DatePickerViewTrigger>

                  <DatePickerNextTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronRight />
                    </Button>
                  </DatePickerNextTrigger>
                </DatePickerViewControl>

                <DatePickerTable>
                  <DatePickerTableBody>
                    {datePicker
                      .getYearsGrid({ columns: 4 })
                      .map((years, id) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                        <DatePickerTableRow key={id}>
                          {years.map((year, id) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: used for docs
                            <DatePickerTableCell key={id} value={year.value}>
                              <DatePickerTableCellTrigger>
                                {year.label}
                              </DatePickerTableCellTrigger>
                            </DatePickerTableCell>
                          ))}
                        </DatePickerTableRow>
                      ))}
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
      </DatePickerContent>
    </DatePickerPositioner>
  </DatePickerRoot>
);

export default DatePicker;
