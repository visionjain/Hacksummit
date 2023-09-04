import Image from "next/image";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import jlc from '../../../public/jlc.png'

const Register = () => {
    const [userid, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const router = useRouter(); // Initialize the Next.js router
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/register', {
                userid,
                password,
                referralCode,
            });

            if (response.status === 201) {
                setUsername('');
                setPassword('');
                setReferralCode('');
                setSuccessMessage('Registration successful');
            } else {
                // Handle unexpected response status
                setError('Error Occured');
            }

        } catch (err) {
            if (err.response && err.response.status === 500) {
                setError('User already exists');
            } else {
                // Handle other registration errors, if any
                setError(err.response ? err.response.data.error : 'Registration successful');
                setTimeout(() => {
                    if (err.response && err.response.status == 201) {
                        router.push('/login');
                    }
                }, 2000);
            }

            // Set a timeout to clear the error message after 2 seconds
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };




    return (
        <div>
            <div>
        <Image
                src={jlc}
                width={150}
                height={200}
                className='absolute ml-10'
                alt="Logo"
              />
        </div>
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
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Register for your account</h3>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {showAlert && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Referral code is incorrect!</strong>
                                <span className="block sm:inline"> Please check your referral code and try again.</span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowAlert(false)}>
                                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <title>Close</title>
                                        <path d="M14.348 5.652a.5.5 0 01-.708 0L10 9.293 6.06 5.353a.5.5 0 01.708-.708L10 8.293l3.94-3.94a.5.5 0 01.708.708L10 9.293l3.348-3.641a.5.5 0 010-.708z" clipRule="evenodd" fillRule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                        )}
                        <div>
                            <label className="font-medium">Username</label>
                            <input
                                type="text"
                                name='userid'
                                placeholder='Type your username'
                                required
                                value={userid}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Password</label>
                            <input
                                type="password"
                                name='password'
                                placeholder='Type your password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Code</label>
                            <input
                                type="text"
                                name="referralCode"
                                placeholder="Type Code To Register"
                                required
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            className="w-full mt-4 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 cursor-pointer"
                            type="submit"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Register