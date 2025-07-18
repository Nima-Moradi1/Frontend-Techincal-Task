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

const percentOptions = ["0%", "50%", "100%"] as const
type Percent = typeof percentOptions[number]

interface PercentDropdownProps {
  value: Percent
  onChange: (value: Percent) => void
}

export function PercentDropdown({ value, onChange }: PercentDropdownProps) {
  return (
    <DropdownMenu>
   <DropdownMenuTrigger asChild className="border-slate-100">
           <Button variant="outline" className="capitalize text-sm flex justify-between px-2 items-center">
             {value}
           <IoChevronDownOutline className="size-4" />
           </Button>
         </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-white">
        <DropdownMenuLabel>Set Effectiveness</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={(val) => onChange(val as Percent)}>
          {percentOptions.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}