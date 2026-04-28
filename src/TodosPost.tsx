// import React from 'react'
import {  useParams } from 'react-router-dom'
import { useQuery} from '@tanstack/react-query'
import axios from 'axios'


export type Todos ={
    id: number
    title : string
    completed: boolean
}

export type posts ={
    id: number
    title : string
    body : string
}



function TodosPost() {
    

const {id} =useParams()

// const queryClient = useQueryClient()

// fetching todos for the user
  const TODO_URL = `https://jsonplaceholder.typicode.com/todos?userId=${id}&_limit=8`

  const fetchtodos = async (): Promise<Todos[]> => {
    const res = await axios.get(TODO_URL)
   
    return res.data
  }

  const { data:todosData ,
          isLoading:todosLoading,
            error:todosError} = useQuery({
    queryKey: ['todos',id],
    queryFn: fetchtodos,

      
  })


//   fetching post for the user
  const POST_URL = `https://jsonplaceholder.typicode.com/posts?userId=${id}&_limit=5`

  const fetchposts = async (): Promise<posts[]> => {
    const res = await axios.get(POST_URL)
    
    return res.data
  }

  const { data:postData ,
              isLoading:postLoading,
              error:postError} = useQuery({
    queryKey: ['posts',id],
    queryFn: fetchposts,

      
  })

const isLoading =  todosLoading || postLoading
const error   =   todosError || postError

// progress bar declaration
const completedCount = todosData?.filter((t) =>t.completed).length ?? 0
const totalCount = todosData?.length ?? 0
const prgresspercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100):0


if(isLoading) return <p>loading......</p>
if (error) return <p>Error fetching this Data</p>



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

    {/* ── Posts Section ── */}
    <section>
      <h2 className="text-3xl font-semibold text-white mb-4 ">Posts</h2>
      <div className="flex flex-col gap-4 w-full md:w-[50%]">
        {postData?.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-sm font-semibold text-gray-900 capitalize mb-1.5">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {post.body}
            </p>
          </div>
        ))}
      </div>
    </section>

    </div>
  )
}

export default TodosPost