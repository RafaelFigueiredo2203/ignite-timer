import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';
import { HandPalm, Play } from "phosphor-react";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import * as zod from 'zod';
import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";



const newCycleFormValidationSchemma = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount:zod.number().min(1,'O minimo precisa ser de maior ou igual a 5 minutos')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchemma>

interface Cycle {
  id:string
  task:string
  minutesAmount:number
  startDate: Date
  interruptedDate?:Date
  finishedDate?: Date
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
  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0


  useEffect(() => {
    let interval: number;

    if(activeCycle){
      interval = setInterval(() => {
        const secondsDiferrence = differenceInSeconds(new Date(), activeCycle.startDate)
        
        if(secondsDiferrence >= totalSeconds){  
          setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId){
              return {...cycle, finishedDate: new Date()}
            }else {
              return cycle;
            }
          }))
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        }else{
        setAmountSecondsPassed(secondsDiferrence);
        }
      },1000)
    }

    return () => {
      clearInterval(interval)
    }
  },[activeCycle,totalSeconds])

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
      setCycles(state => state.map(cycle => {
        if(cycle.id === activeCycleId){
          return {...cycle, interruptedDate: new Date()}
        }else {
          return cycle;
        }
      }))
       setActiveCycleId(null)
  }


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
        <NewCycleForm/>
        <Countdown/>

    

      {activeCycle ? (
      <StopCountDownButton onClick={handleInterruptCycle}  type="button"><HandPalm size={24}/> Interromper </StopCountDownButton >
      ):
      <StartCountDownButton disabled={!task} type="submit"><Play size={24}/> Começar </StartCountDownButton >
      }
      
      </form>
    </HomeContainer>
  )
}