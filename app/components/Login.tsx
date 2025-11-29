"use client";

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import { login as doLogin } from "@/services/auth"; // ฟังก์ชันที่เรียก API และเก็บ token ใน localStorage

interface LoginForm {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email required'),
    password: yup.string().min(4, 'Password too short').required('Password required'),
}).required();

export default function LoginComponent() {
    const router = useRouter();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await doLogin(data);
            const token = response.access_token;
            if (typeof window !== "undefined" && token) localStorage.setItem("token", token);

            login(token);

            await Swal.fire('Success', 'Login successful', 'success');
            router.replace("/admin");
        } catch (err) {
            console.error('Login failed', err);
            Swal.fire('Error', 'Login failed', 'error');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        {...register('email')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        {...register('password')}
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
