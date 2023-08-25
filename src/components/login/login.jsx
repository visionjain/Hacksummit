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
                        <p> Dont have an account? <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link></p>
                    </div>
                </div>
                <form
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div>
                        <label className="font-medium">
                            Email
                        </label>
                        <input
                            type="email"
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
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <button
                        className="w-full mt-4 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        <Link href='/customers'>Log In</Link>
                    </button>
                </form>
            </div>
        </main>
    </div>
  )
}

export default Login