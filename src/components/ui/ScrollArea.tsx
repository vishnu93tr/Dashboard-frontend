"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof BaseScrollArea> {
  className?: string;
  viewportClassName?: string;
  children: React.ReactNode;
}

export default function ScrollArea({
  className,
  viewportClassName,
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <BaseScrollArea
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full overflow-y-auto pr-4", viewportClassName)}
      >
        {children}
      </div>
    </BaseScrollArea>
  );
}
