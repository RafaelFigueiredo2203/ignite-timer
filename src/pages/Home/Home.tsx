import { zodResolver } from "@hookform/resolvers/zod";
import { HandPalm, Play } from "phosphor-react";
import { useContext } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import * as zod from 'zod';
import { CycleContext } from "../../Context/NewCycleContext";
import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";







const newCycleFormValidationSchemma = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount:zod.number().min(5,'O minimo precisa ser de maior ou igual a 5 minutos')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchemma>



export function Home(){
  const {activeCycle, handleCreateNewCycle, handleInterruptCycle} = useContext(CycleContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver:zodResolver(newCycleFormValidationSchemma),
    defaultValues:{
      task:'',
      minutesAmount:0
    }
  })

  const {  handleSubmit, watch,reset} = newCycleForm
 
  function CreateNewCycle(data: NewCycleFormData){
    handleCreateNewCycle(data)
    reset()
  }

  
  console.log(activeCycle)

  const task = watch('task')

  return(
    <HomeContainer>
      
      <form onSubmit={handleSubmit(CreateNewCycle)} action="">
        
        <FormProvider {...newCycleForm}>
        <NewCycleForm/>
        </FormProvider>
        <Countdown />

        
      {activeCycle ? (
      <StopCountDownButton onClick={handleInterruptCycle}  type="button"><HandPalm size={24}/> Interromper </StopCountDownButton >
      ):
      <StartCountDownButton disabled={!task} type="submit"><Play size={24}/> Começar </StartCountDownButton >
      }
      
      </form>
    </HomeContainer>
  )
}