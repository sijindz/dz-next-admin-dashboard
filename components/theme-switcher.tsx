"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckIcon, Palette } from "lucide-react"

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme()

    const isActive = (themeName: string) => {
        return (theme === themeName && <CheckIcon
            className='ml-2 h-4 w-4'
        />)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full p-0 bg-foreground hover:bg-muted text-background hover:text-muted-foreground border-0 outline-none">
                    <Palette className="w-6 h-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[99998]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <span>Light</span>{theme === 'light' && <CheckIcon
                        className='ml-2 h-4 w-4'
                    />}

                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <span>Dark</span>{isActive('dark')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("custom")}>
                    <span>Custom</span>{theme === 'custom' && <CheckIcon
                        className='ml-2 h-4 w-4'
                    />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}