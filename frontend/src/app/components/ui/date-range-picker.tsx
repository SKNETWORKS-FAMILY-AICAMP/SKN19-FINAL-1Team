"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  value?: DateRange
  onChange?: (date: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  value,
  onChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal h-8 text-[11px]",
              !value?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1.5 h-3 w-3" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "yyyy-MM-dd", { locale: ko })} -{" "}
                  {format(value.to, "yyyy-MM-dd", { locale: ko })}
                </>
              ) : (
                format(value.from, "yyyy-MM-dd", { locale: ko })
              )
            ) : (
              <span>날짜 선택</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}