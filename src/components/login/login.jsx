import React from 'react';
import Image from "next/image";
import Link from 'next/link';

const Login = () => {
  return (
    <div>
        <main className="w-full h-screen flex flex-col items-center justify-center px-4">
            <div className="max-w-sm w-full text-gray-600 space-y-8">
                <div className="text-center">
                <Image
                src="/loginicon.png"
                width={150}
                height={150}
                className='mx-auto'
                alt="Logo"
              />

                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                    </div>
                </div>
                <form
                    action="/api/login" method='post'
                >
                    <div>
                        <label className="font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            name='username'
                            placeholder='Type your username'
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="font-medium">
                            Passoword
                        </label>
                        <input
                            type="password"
                            name='password'
                            placeholder='Type your password'
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    {/* <Link href='/customers'> */}
                    <button
                        className="w-full mt-4 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 cursor-pointer"
                        type='submit' value='Login'
                    >
                       Log In
                    </button>
                    {/* </Link> */}
                </form>
            </div>
        </main>
    </div>
  )
}

export default Login