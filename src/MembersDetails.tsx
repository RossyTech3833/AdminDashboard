import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import TodosPost from "./TodosPost"
import { useState } from "react"
import axios from "axios"

export type users = {
  id: number
  name: string
  email: string
  company: { name: string }
  address: { city: string }
}

export const MembersDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [editingUser, setEditingUser] = useState<users | null>(null)

  const BASE_URL = `https://jsonplaceholder.typicode.com/users/${id}`

  const fetchUser = async (): Promise<users> => {
    const res = await axios.get(BASE_URL)
   
    return res.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", id],
    queryFn: fetchUser,
  })

  const handleEdit = () => {
    if (data) setEditingUser(data)
  }

  const handleEditChange = (field: keyof users, value: string) => {
    if (!editingUser) return
    setEditingUser((prev) => {
      if (!prev) return prev
      if (field === "company") return { ...prev, company: { name: value } }
      if (field === "address") return { ...prev, address: { city: value } }
      return { ...prev, [field]: value }
    })
  }

  const editMutation = useMutation({
    mutationFn: async (updatedUser: users) => {
      const res = await axios.patch<users>(
        `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
       updatedUser
      )
      return res.data
    },

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users", id], updatedUser)

      //  updating the list cache if it exists
      queryClient.setQueryData(["users"], (old: users[] | undefined) =>
        old?.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      )

      setEditingUser(null)
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error occurred</p>



  return (
    <div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl uppercase mb-6 text-white text-center font-bold mt-30">
        Check out the members details, posts and todos
      </h1>

      <div className="flex justify-center mt-20 px-6">
        <div className="border-b shadow-lg shadow-white text-white text-center p-10 w-full max-w-md">
          <h1 className="text-2xl uppercase mb-6 text-white text-center">
            Member Details
          </h1>
          <p>NAME: {data?.name}</p>
          <p className="mt-2">EMAIL: {data?.email}</p>
          <p className="mt-2">COMPANY: {data?.company.name}</p>
          <p className="mt-2">CITY: {data?.address.city}</p>

          <div className="flex gap-3 mt-6 justify-center">
            <button
              onClick={() => navigate("/")}
              className="border cursor-pointer bg-blue-600 text-white p-2"
            >
              ← Back
            </button>

            {/* from here is the editing button */}
            <button
              onClick={handleEdit}
              className="border cursor-pointer bg-red-700 text-white p-3"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-900 uppercase">
              Edit Member
            </h2>

            <label className="block mb-2">
              Name
              <input
                className="border w-full p-2 mt-1"
                value={editingUser.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </label>

            <label className="block mb-2">
              Email
              <input
                className="border w-full p-2 mt-1"
                value={editingUser.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </label>

            <label className="block mb-2">
              Company
              <input
                className="border w-full p-2 mt-1"
                value={editingUser.company.name}
                onChange={(e) => handleEditChange("company", e.target.value)}
              />
            </label>

            <label className="block mb-4">
              City
              <input
                className="border w-full p-2 mt-1"
                value={editingUser.address.city}
                onChange={(e) => handleEditChange("address", e.target.value)}
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => editMutation.mutate(editingUser)}
                disabled={editMutation.isPending}
                className="bg-green-600 text-white p-2 flex-1 cursor-pointer disabled:opacity-50"
              >
                {editMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-400 text-white p-2 flex-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {editMutation.isError && (
              <p className="text-red-600 mt-3 text-sm">
                Failed to save. Please try again.
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <TodosPost />
      </div>
    </div>
  )
}