import { Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslation } from '@/hooks/useTranslation'
import type { ExpenseItem, IncomeItem } from '@/hooks/useCalculator'

interface ItemTableProps {
  items: (ExpenseItem | IncomeItem)[]
  isLoading?: boolean
  readOnlyItemIds: string[]
  onValueChange: (itemId: string, value: number | null) => void
  onNameChange: (itemId: string, name: string) => void
  onDelete: (itemId: string) => void
  onAddCustom: () => void
}

export function ItemTable({
  items,
  isLoading = false,
  readOnlyItemIds,
  onValueChange,
  onNameChange,
  onDelete,
  onAddCustom,
}: ItemTableProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">{t.calculator.item}</TableHead>
              <TableHead>{t.calculator.value}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">{t.calculator.item}</TableHead>
            <TableHead>{t.calculator.value}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <ItemRow
              key={item.itemId}
              item={item}
              isReadOnly={readOnlyItemIds.includes(item.itemId)}
              onValueChange={onValueChange}
              onNameChange={onNameChange}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onAddCustom} className="w-full">
              {t.calculator.addCustomItem}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t.calculator.customItemTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

interface ItemRowProps {
  item: ExpenseItem | IncomeItem
  isReadOnly: boolean
  onValueChange: (itemId: string, value: number | null) => void
  onNameChange: (itemId: string, name: string) => void
  onDelete: (itemId: string) => void
}

function ItemRow({ item, isReadOnly, onValueChange, onNameChange, onDelete }: ItemRowProps) {
  const { t } = useTranslation()
  const [localValue, setLocalValue] = useState<string>('')
  const [localName, setLocalName] = useState<string>(item.name)

  // Sync local value with prop
  useEffect(() => {
    if (item.value === undefined || item.value === null) {
      setLocalValue('')
    } else {
      setLocalValue(item.value.toString())
    }
  }, [item.value])

  // Sync local name with prop
  useEffect(() => {
    setLocalName(item.name)
  }, [item.name])

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    setLocalValue(inputValue)

    if (inputValue === '') {
      onValueChange(item.itemId, null)
    } else {
      const numValue = parseFloat(inputValue)
      if (!isNaN(numValue) && numValue >= 0) {
        onValueChange(item.itemId, numValue)
      }
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value
    setLocalName(newName)
    onNameChange(item.itemId, newName)
  }

  // Format value for read-only display
  const formattedReadOnlyValue =
    item.value === null || item.value === undefined || item.value === 0
      ? '0,00'
      : item.value.toLocaleString('cs-CZ', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

  return (
    <TableRow>
      <TableCell>
        {item.isCustom ? (
          <div className="flex items-center gap-2">
            <Input
              value={localName}
              onChange={handleNameChange}
              placeholder={t.calculator.customItemPlaceholder}
              className="border-0 bg-transparent hover:bg-muted/50 focus:bg-muted/50"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.itemId)}
              className="h-8 w-8 shrink-0 text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{t.common.delete}</span>
            </Button>
          </div>
        ) : (
          <span className="text-sm">{item.name}</span>
        )}
      </TableCell>
      <TableCell>
        {isReadOnly ? (
          <Input
            type="text"
            value={formattedReadOnlyValue}
            readOnly
            disabled
            className="bg-muted/50"
          />
        ) : (
          <Input
            type="number"
            min="0"
            step="0.01"
            value={localValue}
            onChange={handleValueChange}
            placeholder="0"
          />
        )}
      </TableCell>
    </TableRow>
  )
}
