"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { LoginFormValues, loginSchema } from "@/validations/auth.schema";
import InputWrapper from "../molecules/InputWrapper";
import { loginApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useFirstLoginStore } from "@/store/userFirstLogin.store";
import Image from "next/image";
import musicLogo from "@/assets/musicgpt32.webp";

interface LoginFormProps {
    onSwitch: () => void;
    onClose: () => void;
}

function LoginForm({ onSwitch, onClose }: LoginFormProps) {
    const [showPw, setShowPw] = useState(false);
    const { markAsReturningUser } = useFirstLoginStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, dirtyFields },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const handleSubmitForm = async (payload: LoginFormValues) => {
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
                markAsReturningUser();
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='p-8 bg-brand-black-100 rounded-[28px] w-full'>
            <div className='mb-6 flex items-center justify-center w-full gap-4 '>
                <div className='relative h-8 w-8'>
                    <Image
                        src={musicLogo}
                        alt='MusicGPT logo'
                        width={32}
                        height={32}
                        priority
                    />
                </div>
                <h2 className='text-center font-bold text-xl'>Login</h2>
            </div>

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
                        className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm bg-brand-black-100 text-neutral-100 placeholder:text-neutral-500 outline-none transition 
                                focus:bg-neutral-800 focus:ring-0.5 focus:ring-neutral-400
                                ${errors.email && dirtyFields.email ? "border-red-500" : "border-neutral-700 focus:border-neutral-500"}`}
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
                        className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm bg-brand-black-100 text-neutral-100 placeholder:text-neutral-500 outline-none transition 
                                focus:bg-neutral-800 focus:ring-0.5 focus:ring-neutral-400
                                ${errors.password && dirtyFields.password ? "border-red-500" : "border-neutral-700 focus:border-neutral-500"}`}
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
                    className={`mt-1 h-11  text-sm font-bold transition-all flex items-center justify-center gap-2 rounded-full p-4  border border-white/20 
                    ${
                        isValid
                            ? "bg-neutral-50 hover:bg-neutral-50 active:scale-[0.98] text-neutral-800 shadow-md shadow-neutral-900 cursor-pointer "
                            : " text-sm font-semibold leading-tight text-white  transition-all active:scale-95"
                    }`}
                >
                    Login {isValid && <ArrowRight size={15} />}
                </button>

                <p className='text-center text-xs text-gray-500'>
                    Don&apos;t have an account?{" "}
                    <button
                        type='button'
                        onClick={onSwitch}
                        className='font-semibold text-neutral-200 hover:text-neutral-50 transition-colors cursor-pointer px-2'
                    >
                        Create one
                    </button>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
