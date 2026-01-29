"use client"
import Link from 'next/link'
import React from 'react'

import {useAuth} from '../provider/authProvider'

export default function page() {

  const { user } = useAuth();

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white- p-5 rounded-2xl text-center shadow-2xl border-b border-gray-200'>
      <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            WELCOME TO SHOESTORE ADMINPAGE
        </h1>
          <h1 className='text-2xl font-bold text-gray-900'>
          HELLO {user ? user.username : "Admin"} !
          </h1>
          <p>
            {user ? user.role : "role"}
          </p>
        <p className='text-xl font-bold text-gray-900 mt-1'>
          Would you  like to go?
        </p>
      </div>
      <div className='flex-row justify-center flex gap-4 mt-4'>
        <Link href={'/admin/shoe'} className=' bg-gray-400 text-white font-bold hover:bg-gray-700 rounded-2xl p-3 ' >
        Shoe Dashboard
        </Link >
        <Link href={'/admin/user'} className=' bg-gray-400 text-white font-bold hover:bg-gray-700 rounded-2xl p-3 ' >
        User Dashboard
        </Link>
      </div>
      </div>
    </div>
  )
}
