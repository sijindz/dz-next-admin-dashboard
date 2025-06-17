
import React, { useState } from 'react'
import { Button } from '../button'
import { RxCaretSort } from 'react-icons/rx'
import { CheckIcon } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../command'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form'
import { cn } from '@/lib/utils'
import { Control } from 'react-hook-form'

const SearchableSelectFormItem = ({ fieldName, fieldLabel, dataKey, dataValue, entries, control, onSelect, disabled = false }: { fieldName: string, fieldLabel: string, dataKey: string, dataValue: string, entries: any[], control: Control<any, any>, onSelect: any, disabled?: boolean }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{fieldLabel}</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    disabled={disabled}
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? entries.find(
                                            (item) => item[dataKey] == field.value
                                        )[dataValue]
                                        : "Select.."}
                                    <RxCaretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 popover-content-width-same-as-its-trigger h-48">
                            <Command>
                                <CommandInput
                                    placeholder="Search items..."
                                    className="h-9"
                                />
                                <CommandEmpty>No item found.</CommandEmpty>
                                <CommandGroup className='overflow-y-scroll'>
                                    {entries.map((item) => (
                                        <CommandItem
                                            value={item[dataValue]}
                                            key={item[dataKey]}
                                            onSelect={() => {
                                                onSelect(item[dataKey]);
                                                console.log(field.value);
                                                setPopoverOpen(false);
                                            }}
                                        >
                                            {item[dataValue]}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    item[dataKey] == field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default SearchableSelectFormItem