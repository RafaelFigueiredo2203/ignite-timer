import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export function NewCycleForm(){
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