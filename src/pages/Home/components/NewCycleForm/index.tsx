import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import * as zod from 'zod';
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";


const newCycleFormValidationSchemma = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount:zod.number().min(1,'O minimo precisa ser de maior ou igual a 5 minutos')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchemma>

export function NewCycleForm(){

  const {register , handleSubmit, watch,reset} = useForm<NewCycleFormData>({
    resolver:zodResolver(newCycleFormValidationSchemma),
    defaultValues:{
      task:'',
      minutesAmount:0
    }
  })

  return (
    <FormContainer>
        <label htmlFor="task">Vou trabalhar em </label>
        <TaskInput 
        disabled={!!activeCycle}
        type="text" list="task-suggestions" id="task" placeholder="De um nome ao seu projeto" {...register('task')}/>

        <datalist id="task-suggestions">
          <option value="Projeto 1"></option>
          <option value="Projeto 2"></option>
          <option value="Projeto 3"></option>
        </datalist>

        <label htmlFor="minutesAmount">Durante</label>
        <MinutesAmountInput 
        disabled={!!activeCycle}
        step={5} 
        min={1} 
        max={60} 
        type="number" 
        id="minutesAmount" 
        placeholder="00"
        {...register('minutesAmount', {valueAsNumber:true})} />
      
        <span>minutos.</span>
        </FormContainer>
  )
}