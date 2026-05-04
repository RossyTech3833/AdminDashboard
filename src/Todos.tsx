// import React from 'react'
import {  useParams } from 'react-router-dom'
import { useQuery} from '@tanstack/react-query'
import axios from 'axios'


export type Todos ={
    id: number
    title : string
    completed: boolean
}


function Todos() {
    
const {id} =useParams()

// const queryClient = useQueryClient()

  const TODO_URL = `https://jsonplaceholder.typicode.com/todos?userId=${id}&_limit=8`

  const fetchtodos = async (): Promise<Todos[]> => {
    const res = await axios.get(TODO_URL)
   
    return res.data
  }

  const { data:todosData ,
          isLoading:todosLoading,
            error:todosError,refetch,isFetching} = useQuery({
    queryKey: ['todos',id],
    queryFn: fetchtodos,

      
  })




const isLoading =  todosLoading 
const error   =   todosError

// progress bar declaration
const completedCount = todosData?.filter((t) =>t.completed).length ?? 0
const totalCount = todosData?.length ?? 0
const prgresspercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100):0


if(isLoading) return <p>loading......</p>

if (error) return (
  <div className='p-10 m-10'>
    <p className='text-red-800 capitalize'>an error occured</p>
    <button
      onClick={() => refetch()}
      disabled={isFetching}
      className='text-white cursor-pointer'
    >
      {isFetching ? 'Retrying....' : 'PLS retry'}
    </button>
  </div>
)



  return (
    <div>
   <section className="mb-10">
      <h2 className="text-3xl font-semibold text-white mb-3 mt-20">Todos</h2>

      {/* Progress label */}
      <div className="flex justify-between text-xs text-white mb-1.5">
        <span>{completedCount} of {totalCount} completed</span>
        <span>{prgresspercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-[50%] h-3 bg-gray-200 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            prgresspercent === 100 ? 'bg-green-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${prgresspercent}%` }}
        />
      </div>

      {/* Todo list */}
      <ul className="flex justify-center flex-col gap-2 w-[100%] md:w-[50%] ">
        {todosData?.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center gap-3  px-4 py-3 rounded-lg border text-sm transition-colors ${
              todo.completed
                ? 'bg-green-50 border-green-200 text-gray-400 line-through'
                : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}
          >
            <span className="text-base ">{todo.completed ? '✅' : '⬜'}</span>
            {todo.title}
          </li>
        ))}
      </ul>
    </section>

    

    </div>
  )
}

export default Todos