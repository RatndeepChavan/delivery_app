"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { InputField } from "#/components/customFormFields/InputField";
import { SubmitButton } from "#/components/SubmitButton";
import { LinkComponent } from "#/components/LinkComponent";
import { loginFormSchema } from "#/validations/loginValidation";
import type { loginFormType } from "#/validations/loginValidation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * * 🔐 LoginPage Component
 *
 * ? Handles user login using React Hook Form + Zod validation
 * ? Provides instant feedback using react-hot-toast
 * ? Redirects logged-in users automatically to the homepage
 */
const LoginPage = () => {
    // ⏳ Local state to handle form loading state
    const [loading, setLoading] = useState(false)

    // 📡 Fetch current session to check if user is already logged in
    const {data: session} = useSession()

    // 🧭 Next.js router for navigation
    const router = useRouter()
    
    // 🔄 Redirect logged-in users to homepage
    useEffect(() => {
        if (session){
            router.replace("/")
        }
    }, [router, session])
    
    // 📝 Initialize React Hook Form with Zod validation
    const methods = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "" },
        criteriaMode: "all",
    });
    
    /**
     * 📨 Handle form submission
     * @param data - Validated form data
     */
    const onSubmit = async (data: loginFormType) => {
        setLoading(true);
        toast.loading('Please wait...', { id: data.email });// ? Unique toast per email to allow dismissal

        // 🔑 Attempt login via next-auth credentials provider
        const result = await signIn("credentials", { ...data, redirect: false });

        setLoading(false);
        toast.dismiss(data.email); // ? Remove loading toast

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Login successful!");
            router.replace("/") // ? Navigate to homepage
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

            {/* ----------------------------------------------------------
                LogIn form
            ---------------------------------------------------------- */}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <InputField name="email" type="email" />
                    <InputField name="password" type="password" />
                    <SubmitButton label="Login" loading={loading} />
                </form>
            </FormProvider>
            
            {/* ----------------------------------------------------------
                🔗 Link to registration page
            ---------------------------------------------------------- */}
            <p className="mt-2 text-center">
                Don&apos;t have an account?{" "}
                <LinkComponent link_text="Register" href="/register" />
            </p>
        </>
    );
}

export default LoginPage