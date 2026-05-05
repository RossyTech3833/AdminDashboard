import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import NewUser from './NewUser'
import { useNavigate } from 'react-router-dom'
import { queryClient } from './main'
import axios from 'axios'
import EditBt from './EditBt'

type NewMemberForm = {
  name: string;
  email: string;
  username: string;
  company: string;
  city: string;
}

type Member = {
  id: string;
  name: string;
  email: string;
  username: string;
  company: { name: string };
  address: { city: string };
}


const BASE_URL = `https://jsonplaceholder.typicode.com/users`

const fetchusers = async (page: number): Promise<Member[]> => {
  const res = await axios.get(`${BASE_URL}?_page=${page}&_limit=5`)
  return res.data
}

function Home() {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [form, setForm] = useState(false)
  const [newMembers, setNewMembers] = useState<Member[]>([])
  const [page, setPage] = useState(1)
  const [deletinguser, setDeletingUser] = useState<string | null>(null) // tracks which user to delete

  const { data, isLoading, error, isPlaceholderData, refetch, isFetching } = useQuery({
    queryFn: () => fetchusers(page),
    queryKey: ['users', page],
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })

  const handleAddMember = (formData: NewMemberForm) => {
    const newMember: Member = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      username: formData.username,
      company: { name: formData.company },
      address: { city: formData.city },
    }
    setNewMembers((prev) => [...prev, newMember])
  }

  const { mutate: addMember, isPending: isAdding } = useMutation({
    mutationFn: async (formData: NewMemberForm) => {
      const res = await axios.post(BASE_URL, formData)
      return res.data
    },
    onSuccess: (_, formData) => {
      handleAddMember(formData)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setForm(false)
    }
  })

  // for the search button
  const allUsers = [...(data ?? []), ...newMembers]

  const filtered = allUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLocaleLowerCase())
  )

  const handleclick = (id: string) => {
    navigate(`/users/${id}`)
  }

  // Step 1: clicking remove just saves the id, opens the modal
  const handleremove = (id: string) => {
    setDeletingUser(id)
  }

  // Step 2: clicking "Remove" inside the modal fires the actual mutation
  const handleConfirm = () => {
    if (deletinguser) {
      removeMember(deletinguser)
      setDeletingUser(null)
    }
  }

  const { mutate: removeMember } = useMutation({
    mutationFn: async (userId: string) => {
      const res = await axios.delete(`${BASE_URL}/${userId}`)
      return res.data
    },
    onSuccess: (_, userId) => {
      setNewMembers((prev) => prev.filter((m) => m.id !== userId))
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  // for pagination
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['users', page + 1],
      queryFn: () => fetchusers(page + 1),
      staleTime: 10_000
    })
  }

  if (isLoading) return (
  <div>
   
    <div className="flex justify-center m-20">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
    </div>

    <div className="flex justify-center gap-6">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
      <div className="h-10 bg-gray-200 rounded animate-pulse w-40" />
    </div>

    <div className="flex justify-center mt-20">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-32" />
    </div>

    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10 px-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex justify-center">
          <div className="border-b shadow-lg shadow-black p-10 w-full space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-8 bg-red-200 rounded animate-pulse w-1/3 mt-6" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

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

      {form && (
        <NewUser
          onAddMember={addMember}
          onClose={() => setForm(false)}
          isPending={isAdding}
        />
      )}

     
      {deletinguser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-red-900 rounded-lg p-8 w-80 text-white shadow-xl">
            <p className="text-lg mb-6">Are you sure you want to remove this member? </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-white rounded text-white hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="flex justify-center m-20 uppercase text-white text-2xl lg:text-5xl md:text-5xl">Admin
        <span className='text-red-900'>Dashboard</span>
      </h1>

      <ul className="flex justify-center gap-6 flex-wrap">
        <input
          className="border text-center px-4 py-2 rounded-lg outline-none border-red-900 text-white text-lg md:text-2xl
          focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setForm(true)}
          className="border px-4 py-2 rounded-lg bg-blue-800 text-white 
          hover:bg-blue-700 transition cursor-pointer"
        >
          + Add New Member
        </button>
      </ul>

      <h1 className='flex justify-center mt-20 uppercase text-3xl text-red-900 text-white'>all users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-10 px-6 text-white cursor-pointer">
        {filtered.map((user) => (
          <div
            key={user.id}
            onClick={() => handleclick(user.id)}
            className="flex justify-center"
          >
            <div className="border-b shadow-lg shadow-white transition-all duration-300 
              ease-in-out hover:scale-105 p-10 w-full">
              <h1>NAME: {user.name}</h1>
              <h1 className="mt-2">EMAIL: {user.email}</h1>
              <h1 className="mt-2">USERNAME: {user.username}</h1>
              <h1 className="mt-2">COMPANY: {user.company.name}</h1>
              <h1 className="mt-2">CITY: {user.address.city}</h1>

              <div className='flex justify-center gap-6 mt-6'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleremove(user.id)
                }}
                className="border cursor-pointer mt-6 bg-red-900 text-white p-2"
              >
                remove member
              </button>

              <EditBt/>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className='gap-4 flex justify-center p-4 mt-20'>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className='border p-2 border-white text-white cursor-pointer'
        >
          previous page
        </button>

        <button
          onMouseEnter={handleMouseEnter}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isPlaceholderData}
          className='border cursor-pointer bg-red-900 p-2'
        >
          next page
        </button>
      </div>

    </div>
  )
}

export default Home