import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'

export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />
}

export function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />
}

export function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'button'>

export function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return <Button aria-current={isActive ? 'page' : undefined} variant={isActive ? 'outline' : 'ghost'} size={size} className={cn(className)} {...props} />
}

export function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn('gap-1 pl-2.5', className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  )
}

export function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn('gap-1 pr-2.5', className)} {...props}>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}

export function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
    </span>
  )
}
