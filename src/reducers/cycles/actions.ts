import { Cycle } from "./reducer";

export enum ActionTypes{
  add_new_cycle = 'add_new_cycle',
  iterupt_current_cycle = 'iterupt_current_cycle',
  mark_currentCycleAsFinished = 'mark_currentCycleAsFinished'
}

export function addNewCycleAction(newCycle:Cycle){
  return{
    type:ActionTypes.add_new_cycle,
      payload: {
         newCycle,
      }
    }
}

export function markCurrentCycleAsFinishedAction(){
  return{
    type:ActionTypes.add_new_cycle,
    }
}


export function interruptCurrentCycleAsAction(){
  return{
    type:ActionTypes.iterupt_current_cycle,
    }
}