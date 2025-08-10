
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../button'
import classNames from 'classnames'
import { RxCaretSort } from 'react-icons/rx'
import { CheckIcon } from 'lucide-react'
import { Command,CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../command'
import { SelectboxModal } from '@/types/type'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

const SearchableSelect = ({ entries, activeItem, setActiveItem }: { entries: SelectboxModal[], activeItem: SelectboxModal|undefined, setActiveItem: Dispatch<SetStateAction<SelectboxModal>> }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={classNames(
                        "w-full justify-between",
                        !activeItem && "text-muted-foreground"
                    )}
                >
                    {activeItem
                        ? entries?.find(
                            (entry) => entry?.key === activeItem.key
                        )?.value
                        : "Select.."}
                    <RxCaretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 popover-content-width-same-as-its-trigger h-48">
                <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup className='overflow-y-scroll'>
                        {entries?.map((entry) => (
                            <CommandItem
                                value={entry?.value}
                                key={entry?.key}
                                onSelect={() => {
                                    //console.log(language.value);
                                    setActiveItem({
                                        key: entry?.key ?? '',
                                        value: entry?.value ?? ''
                                    })
                                    console.log(activeItem?.key)
                                    setPopoverOpen(false);
                                }}
                            >
                                <CheckIcon
                                    className={classNames(
                                        "mr-2 h-4 w-4",
                                        entry?.key === activeItem?.key
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {entry?.value}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default SearchableSelect