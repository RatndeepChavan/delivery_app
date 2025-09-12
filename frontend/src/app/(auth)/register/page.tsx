"use client";

import type { registrationFormType } from "#/validations/registrationValidation";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { InputField } from "#/components/customFormFields/InputField";
import { SelectField } from "#/components/customFormFields/SelectField";
import { SubmitButton } from "#/components/SubmitButton";
import { LinkComponent } from "#/components/LinkComponent";
import { registrationFormSchema } from "#/validations/registrationValidation";
import { UserRole } from "#/enums/userRoles.enum";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "#/graphql/mutations";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * * 📝 RegistrationPage Component
 *
 * ? Handles user registration using React Hook Form + Zod validation
 * ? Integrates Apollo mutation for signup
 * ? Provides toast feedback and redirects based on session/mutation results
 */
const RegistrationPage = () => {
    // ⚡ Apollo useMutation hook for signup
    const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION);

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
    
    // 🔔 Monitor mutation result and handle success/error
    useEffect(() => {
        if (error && error.message) {
            toast.error(error.message);
        } else if (data && error === undefined) {
            router.replace("/login")
        }
    }, [data, error, router]);

    // 📝 Initialize React Hook Form with Zod validation
    const methods = useForm({
        resolver: zodResolver(registrationFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            role: UserRole.CUSTOMER,
        },
        criteriaMode: "all",
    });

    /**
     * 📨 Handle form submission
     * @param data - Validated registration data
     */
    const onSubmit = async (data: registrationFormType) => {
        await signup({variables : { input: data }})
        toast.success("Data submitted!");
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

            {/* ----------------------------------------------------------
                Registration Form
            ---------------------------------------------------------- */}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <InputField name="name" />
                    <InputField name="email" type="email" />
                    <InputField name="password" type="password" />
                    <InputField
                        name="repeatPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Please enter password again"
                    />
                    <SelectField
                        name="role"
                        options={[
                            { value: UserRole.CUSTOMER , label: "Customer" },
                            { value: UserRole.DELIVERY, label: "Delivery" },
                        ]}
                    />
                    <SubmitButton label="Register" loading={loading} />
                </form>
            </FormProvider>

            {/* ----------------------------------------------------------
                🔗 Link to login page
            ---------------------------------------------------------- */}
            <p className="mt-2 text-center">
                Already have an account?{" "}
                <LinkComponent link_text="Login" href="/login" />
            </p>
        </>
    );
}

export default RegistrationPage