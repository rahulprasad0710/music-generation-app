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
                    <CheckCircle2 size={28} className='text-violet-600' />
                </div>
                <h3 className='text-xl font-bold text-gray-900'>
                    Account created!
                </h3>
                <p className='text-sm text-gray-500 text-center'>
                    Welcome aboard. You can now sign in.
                </p>
                <button
                    onClick={onSwitch}
                    className='mt-2 text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1'
                >
                    Go to login <ArrowRight size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className='p-10'>
            <form
                onSubmit={handleSubmit(() => setDone(true))}
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
                        className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition
                                focus:bg-white focus:ring-2 focus:ring-violet-300
                                ${errors.fullName && dirtyFields.fullName ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
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
                        className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition
            focus:bg-white focus:ring-2 focus:ring-violet-300
            ${errors.email && dirtyFields.email ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
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
                        className={`w-full h-11 pl-9 pr-10 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition
            focus:bg-white focus:ring-2 focus:ring-violet-300
            ${errors.password && dirtyFields.password ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
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
                        className={`w-full h-11 pl-9 pr-10 rounded-xl border text-sm bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none transition
            focus:bg-white focus:ring-2 focus:ring-violet-300
            ${errors.confirmPassword && dirtyFields.confirmPassword ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
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
                    className={`mt-2 h-11 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
          ${
              isValid
                  ? "bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white shadow-md shadow-violet-200 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
                >
                    Create Account {isValid && <ArrowRight size={15} />}
                </button>

                <p className='text-center text-xs text-gray-500'>
                    Already have an account?{" "}
                    <button
                        type='button'
                        onClick={onSwitch}
                        className='font-semibold text-violet-600 hover:text-violet-800 transition-colors'
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </div>
    );
}

export default RegisterForm;
