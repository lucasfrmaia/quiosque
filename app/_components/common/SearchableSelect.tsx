import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Option {
  id: string;
  name: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  options: Option[];
  value?: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção...',
  className,
  searchPlaceholder = 'Buscar...',
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedValue = value ? value.name : placeholder;

  return (
    <div className={cn('relative', className)}>
      <Select
        open={open}
        onOpenChange={setOpen}
        value={value?.id?.toString() || ''}
        onValueChange={(id) => {
          const option = options.find((opt) => opt.id.toString() === id);
          onChange(option || null);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={selectedValue} />
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto">
          <div className="p-2">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
              autoFocus
            />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="Null" disabled>
              Nenhuma opção encontrada.
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
