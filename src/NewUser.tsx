// NewUser.tsx
// import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import type { Resolver } from 'react-hook-form'


const schema = yup.object({
  name:    yup.string().required('Name is required'),
  email:   yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('username is required'),
  company: yup.string().required('Company name is required'),
  city:    yup.string().required('City name is required'),
})

export type NewMemberForm = yup.InferType<typeof schema>

type Props = {
  onAddMember: (data: NewMemberForm) => void
  onClose: () => void
  isPending: boolean
}

function NewUser({ onAddMember, onClose, isPending }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewMemberForm>({
    resolver: yupResolver(schema) as Resolver<NewMemberForm>,
  })

  const onSubmit = (data: NewMemberForm) => {
    onAddMember(data)  
    reset()
    onClose() 
            
  }


  return (
    
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 relative">

     <button
          onClick={onClose}
   className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer" >
          ✕
        </button>

       <div className="mb-8">
         <h2 className="text-2xl font-semibold text-gray-800">Add New Member</h2>
         <p className="text-sm text-gray-400 mt-1">Fill in the details to add a new member.</p>
       </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
      {...register('name')}
       placeholder="your name"
       className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
       focus:ring-2 focus:ring-blue-500 focus:border-transparent
     ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
            />
      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

     <div className="flex flex-col gap-1">
     <label className="text-sm font-medium text-gray-700">Email Address</label>
     <input
        {...register('email')}
      placeholder="name@.com"
        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
       focus:ring-2 focus:ring-blue-500 focus:border-transparent
         ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
       />
     {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
       </div>

       <div className="flex flex-col gap-1">
     <label className="text-sm font-medium text-gray-700">Username</label>
     <input
        {...register('username')}
      placeholder="RossyRossy"
        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
       focus:ring-2 focus:ring-blue-500 focus:border-transparent
         ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
       />
     {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
       </div>

     <div className="flex flex-col gap-1">
     <label className="text-sm font-medium text-gray-700">Company</label>
     <input
     {...register('company')}
     placeholder="RossyTech"
     className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
     focus:ring-2 focus:ring-blue-500 focus:border-transparent
       ${errors.company ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
       />
     {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
       <label className="text-sm font-medium text-gray-700">City</label>
       <input
       {...register('city')}
       placeholder="e.g enugu"
      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
     focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
           />
    {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
       </div>

      <button
     type="submit"
     disabled={isPending}
      className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700
     disabled:bg-blue-300 disabled:cursor-not-allowed
     text-white text-sm font-medium rounded-lg transition cursor-pointer"
       >
      {isPending ? 'Adding...' : 'Add New Member'}
     </button>

        </form>
      </div>
    </div>
  )
}

export default NewUser