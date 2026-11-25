"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

function Accordion({ ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-2 rounded-lg text-left text-sm font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="text-muted-foreground size-3.5 shrink-0 translate-y-px transition-transform duration-200 group-data-panel-open/accordion-trigger:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionPanel({
  className,
  children,
  scrollable,
  ...props
}: AccordionPrimitive.Panel.Props & {
  /**
   * Le panneau occupe la hauteur restante et défile. L'animation de hauteur est
   * alors désactivée, elle suppose une hauteur mesurable.
   */
  scrollable?: boolean
}) {
  if (scrollable) {
    return (
      <AccordionPrimitive.Panel
        data-slot="accordion-panel"
        className="flex min-h-0 flex-1 flex-col text-sm"
        {...props}
      >
        <div className={cn("scrollbar-slim min-h-0 flex-1 overflow-y-auto", className)}>
          {children}
        </div>
      </AccordionPrimitive.Panel>
    )
  }

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn(className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionPanel }
