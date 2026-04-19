"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    XCircle,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { LoginFormValues, loginSchema } from "@/validations/auth.schema";
import InputWrapper from "../molecules/InputWrapper";
import { loginApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";

interface LoginFormProps {
    onSwitch: () => void;
    onClose: () => void;
}

function LoginForm({ onSwitch, onClose }: LoginFormProps) {
    const [showPw, setShowPw] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, dirtyFields },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    // if (done) {
    //     return (
    //         <div className='flex flex-col items-center gap-4 py-10'>
    //             <div className='w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center'>
    //                 <CheckCircle2 size={28} className='text-neutral-600' />
    //             </div>
    //             <h3 className='text-xl font-bold text-gray-900'>Signed in!</h3>
    //             <p className='text-sm text-gray-500'>
    //                 Welcome back. You&apos;re now logged in.
    //             </p>
    //         </div>
    //     );
    // }

    const handleSubmitForm = async (payload: LoginFormValues) => {
        console.log({
            payload,
        });

        try {
            const response = await loginApi({
                email: payload.email,
                password: payload.password,
                isRememberMe: payload?.rememberMe ?? false,
            });

            const { data, success, message } = response;

            useAuthStore.getState().setUser(data);
            useAuthStore.getState().setToken(data?.accessToken ?? null);

            console.log(response);

            if (success) {
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='p-10'>
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                noValidate
                className='flex flex-col gap-4'
            >
                {/* Email */}
                <InputWrapper
                    label='Email Address'
                    icon={Mail}
                    error={errors.email?.message}
                    isDirty={!!dirtyFields.email}
                >
                    <input
                        {...register("email")}
                        type='email'
                        placeholder='jane@example.com'
                        autoComplete='email'
                        className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition
                                    focus:bg-white focus:ring-2 focus:ring-neutral-300
                                    ${errors.email && dirtyFields.email ? "border-red-400" : "border-gray-200 focus:border-neutral-400"}`}
                    />
                </InputWrapper>

                {/* Password */}
                <InputWrapper
                    label='Password'
                    icon={Lock}
                    error={errors.password?.message}
                    isDirty={!!dirtyFields.password}
                >
                    <input
                        {...register("password")}
                        type={showPw ? "text" : "password"}
                        placeholder='Your password'
                        autoComplete='current-password'
                        className={`w-full h-11 pl-9 pr-10 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition
            focus:bg-white focus:ring-2 focus:ring-neutral-300
            ${errors.password && dirtyFields.password ? "border-red-400" : "border-gray-200 focus:border-neutral-400"}`}
                    />
                    <button
                        type='button'
                        onClick={() => setShowPw((v) => !v)}
                        className='absolute right-3 text-gray-400 hover:text-neutral-500 transition-colors'
                        aria-label='Toggle password'
                    >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </InputWrapper>

                {/* Remember me + Forgot password */}
                <div className='flex items-center justify-between'>
                    <label className='flex items-center gap-2 cursor-pointer select-none'>
                        <div className='relative'>
                            <input
                                {...register("rememberMe")}
                                type='checkbox'
                                className='peer sr-only'
                            />
                            <div className='w-4 h-4 rounded border border-gray-300 bg-gray-50 peer-checked:bg-neutral-600 peer-checked:border-neutral-600 transition-colors' />
                            <svg
                                className='absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity'
                                viewBox='0 0 16 16'
                                fill='none'
                            >
                                <path
                                    d='M3 8l3.5 3.5L13 5'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </div>
                        <span className='text-sm text-gray-600'>
                            Remember me
                        </span>
                    </label>
                    <button
                        type='button'
                        className='text-sm font-semibold text-neutral-600 hover:text-neutral-800 transition-colors'
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Submit */}
                <button
                    type='submit'
                    disabled={!isValid}
                    className={`mt-1 h-11 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
          ${
              isValid
                  ? "bg-neutral-600 hover:bg-neutral-700 active:scale-[0.98] text-white shadow-md shadow-neutral-900 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
                >
                    Login {isValid && <ArrowRight size={15} />}
                </button>

                <p className='text-center text-xs text-gray-500'>
                    Don&apos;t have an account?{" "}
                    <button
                        type='button'
                        onClick={onSwitch}
                        className='font-semibold text-neutral-600 hover:text-neutral-800 transition-colors'
                    >
                        Create one
                    </button>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
