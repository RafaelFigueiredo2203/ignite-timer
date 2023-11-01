import { differenceInSeconds } from "date-fns"
import { ReactNode, createContext, useEffect, useReducer, useState } from "react"
import { addNewCycleAction, interruptCurrentCycleAsAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer"



interface CreateCycleData{
  task:string
  minutesAmount:number
}



interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void 
  amountSecondsPassed : number
  setSecondsPassed: (seconds: number) => void
  handleCreateNewCycle: (data: CreateCycleData) => void
  handleInterruptCycle: () => void

}

export const CycleContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps{
  children:ReactNode
}



export function CyclesContextProvider({children}:CyclesContextProviderProps){
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,{
    cycles: [],
    activeCycleId: null,
  }, (initialState) => {
    const storagedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

    if(storagedStateAsJSON){
      return JSON.parse(storagedStateAsJSON)
    }
    return initialState
  })  
  const  {activeCycleId, cycles} = cyclesState
  const activeCycle = cycles.find(cycle =>  cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
  if(activeCycle){
   return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
  }
  })

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJson)
  },[cyclesState])

  
   
function markCurrentCycleAsFinished(){

  dispatch(markCurrentCycleAsFinishedAction)
  }

  function setSecondsPassed(seconds: number){
    setAmountSecondsPassed(seconds)
  }

  
  function handleCreateNewCycle(data:CreateCycleData){
    const  id = String(new Date().getTime())

    const newCycle:Cycle = {
      id,
      task:data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    dispatch(addNewCycleAction(newCycle))

    
    setAmountSecondsPassed(0)

    
  }        
  
  function handleInterruptCycle(){

    dispatch(interruptCurrentCycleAsAction())

    

  }





  return(
    <CycleContext.Provider 
    value={{activeCycle,activeCycleId , 
    cycles,
    markCurrentCycleAsFinished, 
    amountSecondsPassed, 
    setSecondsPassed,
    handleCreateNewCycle,
    handleInterruptCycle}}>
      {children}
      </CycleContext.Provider>
  )
}