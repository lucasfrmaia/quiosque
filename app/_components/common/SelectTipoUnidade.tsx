import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TipoUnidade } from '@/types/types/types';
import { Controller } from 'react-hook-form';

interface Props {
  control: any;
  changeUnidade?: (value: TipoUnidade) => void;
}

const tiposProdutos: TipoUnidade[] = ['UNIDADE', 'KG', 'MG', 'G'];

export function SelectTipoUnidade({ control, changeUnidade }: Props) {
  return (
    <div>
      <Controller
        control={control}
        name="unidade"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              if (changeUnidade) changeUnidade(value as TipoUnidade);
              field.onChange(value);
            }}
          >
            <SelectTrigger id="unidade">
              <SelectValue placeholder="Selecione um Tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposProdutos.map((unidade) => (
                <SelectItem key={unidade} value={unidade || 'Null'}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
