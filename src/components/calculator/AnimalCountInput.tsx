import { PawPrint } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from '@/hooks/useTranslation'

interface AnimalCountInputProps {
  value: number | null
  onChange: (value: number | null) => void
  isLoading?: boolean
}

export function AnimalCountInput({
  value,
  onChange,
  isLoading = false,
}: AnimalCountInputProps) {
  const { t } = useTranslation()
  const [localValue, setLocalValue] = useState<string>('')

  // Sync local value with prop
  useEffect(() => {
    if (value === null || value === undefined) {
      setLocalValue('')
    } else {
      setLocalValue(value.toString())
    }
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    setLocalValue(inputValue)

    if (inputValue === '') {
      onChange(null)
    } else {
      const numValue = parseFloat(inputValue)
      if (!isNaN(numValue) && numValue >= 0) {
        onChange(Math.floor(numValue))
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="animal-count" className="flex items-center gap-2 text-base font-medium">
        <PawPrint className="h-4 w-4 text-emerald-600" />
        {t.calculator.animalCount}
      </Label>
      <Input
        id="animal-count"
        type="number"
        min="0"
        step="1"
        placeholder={t.calculator.animalCountPlaceholder}
        value={localValue}
        onChange={handleChange}
        className="max-w-xs"
      />
    </div>
  )
}
