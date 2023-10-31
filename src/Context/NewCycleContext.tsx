import { ReactNode, createContext, useState } from "react"

interface CreateCycleData{
  task:string
  minutesAmount:number
}

 interface Cycle {
  id:string
  task:string
  minutesAmount:number
  startDate: Date
  interruptedDate?:Date
  finishedDate?: Date
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
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  
   
function markCurrentCycleAsFinished(){
  setCycles(state => state.map(cycle => {
    if(cycle.id === activeCycleId){
      return {...cycle, finishedDate: new Date()}
    }else {
      return cycle;
    }
  }))}

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

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    
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



  const activeCycle = cycles.find(cycle =>  cycle.id === activeCycleId)

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