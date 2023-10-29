import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';
import { HandPalm, Play } from "phosphor-react";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import * as zod from 'zod';
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, StopCountDownButton, TaskInput } from "./styles";


const newCycleFormValidationSchemma = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount:zod.number().min(5,'O minimo precisa ser de maior ou igual a 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchemma>

interface Cycle {
  id:string
  task:string
  minutesAmount:number
  startDate: Date
  interruptedDate?:Date
}

export function Home(){

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
 
  const {register , handleSubmit, watch,reset} = useForm<NewCycleFormData>({
    resolver:zodResolver(newCycleFormValidationSchemma),
    defaultValues:{
      task:'',
      minutesAmount:0
    }
  })

  const activeCycle = cycles.find(cycle =>  cycle.id === activeCycleId) 

  useEffect(() => {
    let interval: number;

    if(activeCycle){
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
          )
      },1000)
    }

    return () => {
      clearInterval(interval)
    }
  },[activeCycle])

  function handleCreateNewCycle(data:NewCycleFormData){
    const  id = String(new Date().getTime())

    const newCycle:Cycle = {
      id,
      task:data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }        
  
  function handleInterruptCycle(){
      setCycles(cycles.map(cycle => {
        if(cycle.id === activeCycleId){
          return {...cycle, interruptedDate: new Date()}
        }else {
          return cycle;
        }
      }))
       setActiveCycleId(null)
  }


  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds/60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if(activeCycle){
    document.title = `${minutes}:${seconds}`
    }
  },[minutes,seconds,activeCycle])

  console.log(activeCycle)

  const task = watch('task')

  return(
    <HomeContainer>
      
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
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
        min={5} 
        max={60} 
        type="number" 
        id="minutesAmount" 
        placeholder="00"
        {...register('minutesAmount', {valueAsNumber:true})} />
      
        <span>minutos.</span>
        </FormContainer>

      <CountDownContainer>
        <span>{minutes[0]}</span>
        <span>{minutes[1]}</span>
        <Separator>:</Separator>
        <span>{seconds[0]}</span>
        <span>{seconds[1]}</span>
      </CountDownContainer>

      {activeCycle ? (
      <StopCountDownButton onClick={handleInterruptCycle}  type="button"><HandPalm size={24}/> Interromper </StopCountDownButton >
      ):
      <StartCountDownButton disabled={!task} type="submit"><Play size={24}/> Começar </StartCountDownButton >
      }
      
      </form>
    </HomeContainer>
  )
}