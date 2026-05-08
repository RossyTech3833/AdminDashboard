import { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"

export type User = {
  id: number
  name: string
  email: string
  company: { name: string }
  address: { city: string }
}

type EditBtProps = {
  userId: string
}

const BASE_URL = `https://jsonplaceholder.typicode.com/users`

function EditBt({ userId }: EditBtProps) {

  const queryClient = useQueryClient()
  const [editingUser, setEditingUser] = useState<User | null>(null)


  const fetchUser = async (): Promise<User> => {
    const res = await axios.get(`${BASE_URL}/${userId}`)
    return res.data
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: fetchUser,
  })

  const handleEdit = () => {
    if (data) setEditingUser(data)
  }

  const handleEditChange = (field: keyof User, value: string) => {
    if (!editingUser) return
    setEditingUser((prev) => {
      if (!prev) return prev
      if (field === "company") return { ...prev, company: { name: value } }
      if (field === "address") return { ...prev, address: { city: value } }
      return { ...prev, [field]: value }
    })
  }

  const editMutation = useMutation({
    mutationFn: async (updatedUser: User) => {
      
      const res = await axios.patch<User>(
        `${BASE_URL}/${updatedUser.id}`,
        updatedUser
      )
      return res.data
    },

    onSuccess: (updatedUser) => {
     
      queryClient.setQueryData(["users"], (old: User[] | undefined) =>
        old?.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      )
      // update the single user cache
      queryClient.setQueryData(["user", userId], updatedUser)

      setEditingUser(null)
    },
  })

  return (
    <div className="m-2">
      <button
        className="border cursor-pointer mt-2 bg-red-700 text-black p-2"
        onClick={(e) => {
          e.stopPropagation()
          handleEdit()
        }}
      >
        {isLoading ? '...' : 'Edit'}
      </button>

      {error && <p className="text-red-500 text-xs mt-1">failed to load</p>}

      {editingUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-900 uppercase">
              Edit Member
            </h2>

            <label className="block mb-2 text-black">
              Name
              <input
                className="border w-full p-2 mt-1 text-black"
                value={editingUser.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </label>

            <label className="block mb-2 text-black">
              Email
              <input
                className="border w-full p-2 mt-1 text-black"
                value={editingUser.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </label>

            <label className="block mb-2 text-black">
              Company
              <input
                className="border w-full p-2 mt-1 text-black"
                value={editingUser.company.name}
                onChange={(e) => handleEditChange("company", e.target.value)}
              />
            </label>

            <label className="block mb-4 text-black">
              City
              <input
                className="border w-full p-2 mt-1 text-black"
                value={editingUser.address.city}
                onChange={(e) => handleEditChange("address", e.target.value)}
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation() 
                  editMutation.mutate(editingUser)
                }}
                disabled={editMutation.isPending}
                className="bg-green-600 text-black p-2 flex-1 cursor-pointer disabled:opacity-50"
              >
                {editMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation() 
                  setEditingUser(null)
                }}
                className="bg-gray-400 text-black p-2 flex-1 cursor-pointer"
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
    </div>
  )
}

export default EditBt