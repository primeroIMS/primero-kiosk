import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

function SelectContent({
    align = "center",
    alignItemWithTrigger = true,
    alignOffset = 0,
    children,
    className,
    side = "bottom",
    sideOffset = 4,
    ...props
}: Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignItemWithTrigger" | "alignOffset" | "side" | "sideOffset"
> &
    SelectPrimitive.Popup.Props) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner
                align={align}
                alignItemWithTrigger={alignItemWithTrigger}
                alignOffset={alignOffset}
                className="isolate z-50"
                side={side}
                sideOffset={sideOffset}
            >
                <SelectPrimitive.Popup
                    className={cn(
                        `
                          bg-popover text-popover-foreground ring-foreground/5 min-w-36
                          p-2 rounded-2xl shadow-2xl ring-1 duration-100 relative isolate
                          z-50 max-h-(--available-height) w-(--anchor-width)
                          origin-(--transform-origin) overflow-x-hidden overflow-y-auto
                          data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
                          data-closed:animate-out data-closed:fade-out-0
                          data-closed:zoom-out-95
                          data-[side=bottom]:slide-in-from-top-2
                          data-[side=left]:slide-in-from-right-2
                          data-[side=right]:slide-in-from-left-2
                          data-[side=top]:slide-in-from-bottom-2
                        `,
                        className,
                    )}
                    data-slot="select-content"
                    {...props}
                >
                    <SelectScrollUpButton />
                    <SelectPrimitive.List>{children}</SelectPrimitive.List>
                    <SelectScrollDownButton />
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    );
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
    return (
        <SelectPrimitive.Group
            className={cn("scroll-my-1 p-1", className)}
            data-slot="select-group"
            {...props}
        />
    );
}

function SelectItem({ children, className, ...props }: SelectPrimitive.Item.Props) {
    return (
        <SelectPrimitive.Item
            className={cn(
                `
                  gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm relative flex w-full
                  cursor-default items-center outline-hidden select-none
                  focus:bg-accent focus:text-accent-foreground
                  *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2
                  [&_svg:not([class*='size-'])]:size-4
                  data-[disabled]:pointer-events-none data-[disabled]:opacity-50
                  [&_svg]:pointer-events-none [&_svg]:shrink-0
                  not-data-[variant=destructive]:focus:**:text-accent-foreground
                `,
                className,
            )}
            data-slot="select-item"
            {...props}
        >
            <SelectPrimitive.ItemText className="flex flex-1 gap-2 shrink-0 whitespace-nowrap">
                {children}
            </SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator
                render={
                    <span
                        className="
                          pointer-events-none absolute right-2 flex size-4 items-center
                          justify-center
                        "
                    />
                }
            >
                <CheckIcon className="pointer-events-none" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
    return (
        <SelectPrimitive.GroupLabel
            className={cn("text-muted-foreground px-3 py-2.5 text-xs", className)}
            data-slot="select-label"
            {...props}
        />
    );
}

function SelectScrollDownButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
    return (
        <SelectPrimitive.ScrollDownArrow
            className={cn(
                `
                  bg-popover z-10 flex cursor-default items-center justify-center py-1
                  bottom-0 w-full
                  [&_svg:not([class*='size-'])]:size-4
                `,
                className,
            )}
            data-slot="select-scroll-down-button"
            {...props}
        >
            <ChevronDownIcon />
        </SelectPrimitive.ScrollDownArrow>
    );
}

function SelectScrollUpButton({
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
    return (
        <SelectPrimitive.ScrollUpArrow
            className={cn(
                `
                  bg-popover z-10 flex cursor-default items-center justify-center py-1
                  top-0 w-full
                  [&_svg:not([class*='size-'])]:size-4
                `,
                className,
            )}
            data-slot="select-scroll-up-button"
            {...props}
        >
            <ChevronUpIcon />
        </SelectPrimitive.ScrollUpArrow>
    );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
    return (
        <SelectPrimitive.Separator
            className={cn("bg-border/50 -mx-1 my-1 h-px pointer-events-none", className)}
            data-slot="select-separator"
            {...props}
        />
    );
}

function SelectTrigger({
    children,
    className,
    size = "default",
    ...props
}: {
    size?: "default" | "sm";
} & SelectPrimitive.Trigger.Props) {
    return (
        <SelectPrimitive.Trigger
            className={cn(
                "border-input bg-input gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors flex w-fit items-center justify-between whitespace-nowrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:data-[slot=select-value]:flex  *:data-[slot=select-value]:gap-1.5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:items-center",
                className,
            )}
            data-size={size}
            data-slot="select-trigger"
            {...props}
        >
            {children}
            <SelectPrimitive.Icon
                render={
                    <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
                }
            />
        </SelectPrimitive.Trigger>
    );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
    return (
        <SelectPrimitive.Value
            className={cn("flex flex-1 text-left", className)}
            data-slot="select-value"
            {...props}
        />
    );
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
