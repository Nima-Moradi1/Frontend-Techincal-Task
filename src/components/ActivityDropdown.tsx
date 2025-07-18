"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { IoChevronDownOutline } from "react-icons/io5"

const activityTypes = [
  "Unknown",
  "Loading",
  "Unloading",
  "Maintenance",
  "Shifting",
  "Anchorage",
  "Idle",
  "Repair",
] as const

export type ActivityType = typeof activityTypes[number]

interface ActivityTypeDropdownProps {
  value: ActivityType
  onChange: (value: ActivityType) => void
}

export function ActivityTypeDropdown({ value, onChange }: ActivityTypeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="border-slate-100">
        <Button variant="outline" className="capitalize text-sm flex justify-between px-2 items-center">
          {value}
        <IoChevronDownOutline className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        <DropdownMenuLabel>Select Activity Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={(val) => onChange(val as ActivityType)}>
          {activityTypes.map((type) => (
            <DropdownMenuRadioItem key={type} value={type} className="capitalize">
              {type}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}