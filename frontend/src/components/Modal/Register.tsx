"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    CheckCircle2,
    XCircle,
    ArrowRight,
} from "lucide-react";
import { RegisterFormValues, registerSchema } from "@/validations/auth.schema";
import InputWrapper from "../molecules/InputWrapper";
import { registerApi } from "@/services/auth.api";
import Image from "next/image";
import MusicLogo from "../molecules/MusicGptLogo";
import musicLogo from "@/assets/musicgpt32.webp";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface RegisterFormProps {
    onSwitch: () => void;
}

const passwordRules = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { label: "One number", test: (v: string) => /[0-9]/.test(v) },
];

function RegisterForm({ onSwitch }: RegisterFormProps) {
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [done, setDone] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, dirtyFields },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const pw = watch("password", "");

    if (done) {
        return (
            <div className='flex flex-col items-center gap-4 py-10 '>
                <div className='w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center'>
                    <CheckCircle2 size={28} className='text-green-600' />
                </div>

                <h3 className='text-xl font-bold text-gray-900'>
                    Account created!
                </h3>
                <p className='text-sm text-neutral-50 text-center'>
                    Welcome aboard. You can now sign in.
                </p>
                <button
                    onClick={onSwitch}
                    className='mt-2 cursor-pointer text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1'
                >
                    Go to login <ArrowRight size={14} />
                </button>
            </div>
        );
    }

    const handleSubmitForm = async (payload: RegisterFormValues) => {
        try {
            const response = await registerApi({
                email: payload.email,
                password: payload.password,
                name: payload?.fullName,
            });

            const { data, success, message } = response;

            if (success) {
                setDone(true);
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        }
    };

    return (
        <div className='p-8'>
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
                <h2 className='text-center font-bold text-xl'>Sign Up</h2>
            </div>
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                noValidate
                className='flex flex-col gap-4'
            >
                {/* Full Name */}
                <InputWrapper
                    label='Full Name'
                    icon={User}
                    error={errors.fullName?.message}
                    isDirty={!!dirtyFields.fullName}
                >
                    <input
                        {...register("fullName")}
                        type='text'
                        placeholder='Jane Doe'
                        autoComplete='name'
                        className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm bg-brand-black-100 text-neutral-100 placeholder:text-neutral-500 outline-none transition 
                                focus:bg-neutral-800 focus:ring-0.5 focus:ring-neutral-400
                                ${errors.fullName && dirtyFields.fullName ? "border-red-500" : "border-neutral-700 focus:border-neutral-500"}`}
                    />
                </InputWrapper>

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
                        placeholder='Create a password'
                        autoComplete='new-password'
                        className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm bg-brand-black-100 text-neutral-100 placeholder:text-neutral-500 outline-none transition 
                                focus:bg-neutral-800 focus:ring-0.5 focus:ring-neutral-400
                                ${errors.password && dirtyFields.password ? "border-red-500" : "border-neutral-700 focus:border-neutral-500"}`}
                    />
                    <button
                        type='button'
                        onClick={() => setShowPw((v) => !v)}
                        className='absolute right-3 text-gray-400 hover:text-violet-500 transition-colors'
                        aria-label='Toggle password'
                    >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </InputWrapper>

                {/* Password strength hints */}
                {dirtyFields.password && (
                    <ul className='flex flex-col gap-1 -mt-1'>
                        {passwordRules.map((rule) => {
                            const ok = rule.test(pw);
                            return (
                                <li
                                    key={rule.label}
                                    className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-green-600" : "text-gray-400"}`}
                                >
                                    {ok ? (
                                        <CheckCircle2 size={12} />
                                    ) : (
                                        <XCircle size={12} />
                                    )}
                                    {rule.label}
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Confirm Password */}
                <InputWrapper
                    label='Confirm Password'
                    icon={Lock}
                    error={errors.confirmPassword?.message}
                    isDirty={!!dirtyFields.confirmPassword}
                >
                    <input
                        {...register("confirmPassword")}
                        type={showCpw ? "text" : "password"}
                        placeholder='Repeat your password'
                        autoComplete='new-password'
                        className={`w-full h-12 pl-9 pr-4 rounded-xl border text-sm bg-brand-black-100 text-neutral-100 placeholder:text-neutral-500 outline-none transition 
                                focus:bg-neutral-800 focus:ring-0.5 focus:ring-neutral-400
                                ${errors.confirmPassword && dirtyFields.confirmPassword ? "border-red-500" : "border-neutral-700 focus:border-neutral-500"}`}
                    />
                    <button
                        type='button'
                        onClick={() => setShowCpw((v) => !v)}
                        className='absolute right-3 text-gray-400 hover:text-violet-500 transition-colors'
                        aria-label='Toggle confirm password'
                    >
                        {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </InputWrapper>

                {/* Submit */}
                <button
                    type='submit'
                    disabled={!isValid}
                    className={`mt-2 h-12  text-sm font-bold transition-all flex items-center justify-center gap-2 rounded-full p-4  border border-white/20 
                    ${
                        isValid
                            ? "bg-neutral-50 hover:bg-neutral-50 active:scale-[0.98] text-neutral-800 shadow-md shadow-neutral-900 cursor-pointer "
                            : " text-sm font-semibold leading-tight text-white  transition-all active:scale-95"
                    }`}
                >
                    Create Account {isValid && <ArrowRight size={15} />}
                </button>

                <p className='text-center text-xs text-gray-500'>
                    Already have an account?{" "}
                    <button
                        type='button'
                        onClick={onSwitch}
                        className='font-semibold text-neutral-200 hover:text-neutral-50 transition-colors cursor-pointer px-2'
                    >
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    );
}

export default RegisterForm;
