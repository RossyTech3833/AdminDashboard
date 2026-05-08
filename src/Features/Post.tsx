import axios from "axios"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"




export type posts ={
    id: number
    title : string
    body : string
}


function Post() {

const {id} = useParams()

const POST_URL = `https://jsonplaceholder.typicode.com/posts?userId=${id}&_limit=5`

const fetchposts = async (): Promise<posts[]> => {
  const res = await axios.get(POST_URL)
  
  return res.data
}

const { data:postData ,
            isLoading:postLoading,
            error:postError,refetch,isFetching} = useQuery({
  queryKey: ['posts',id],
  queryFn: fetchposts,

    
})


const isLoading =   postLoading
const error   =    postError


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

export default Post