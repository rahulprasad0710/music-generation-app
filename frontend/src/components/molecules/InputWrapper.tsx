import { LucideIcon, XCircle } from "lucide-react";

interface InputWrapperProps {
    label: string;
    icon: LucideIcon;
    error?: string;
    isDirty?: boolean;
    children: React.ReactNode;
}

function InputWrapper({
    label,
    icon: Icon,
    error,
    isDirty,
    children,
}: InputWrapperProps) {
    return (
        <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-semibold text-neutral-600'>
                {label}
            </label>

            <div className='relative flex items-center'>
                <Icon
                    size={16}
                    className='absolute left-3.5 text-neutral-600 pointer-events-none'
                />
                {children}
            </div>

            {error && isDirty && (
                <p className='text-xs text-red-500 flex items-center gap-1'>
                    <XCircle size={12} /> {error}
                </p>
            )}
        </div>
    );
}

export default InputWrapper;
