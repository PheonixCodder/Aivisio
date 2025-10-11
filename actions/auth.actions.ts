"use server";

import { ROUTES } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData): Promise<AuthResponse> {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options : {
            data: {
                name: formData.get("name")
            }
        }
    }

    const { data: user, error } = await supabase.auth.signUp(data)

    return { error: error?.message || "Error signing up", success: !error, data: user || null}

}

export async function logIn(formData: FormData): Promise<AuthResponse> {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { data: user, error } = await supabase.auth.signInWithPassword(data)

    return { error: error?.message || "Error Logging in", success: !error, data: user || null}

}

export async function logOut() : Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut()
    redirect(ROUTES.LOGIN)
}

export async function updateProfile(values: {
    name: string,
}) {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.updateUser({
        data: {
            name: values.name
        }
    })

    return { error: error?.message || "Error Logging in", success: !error, data: user || null}

}

export async function resetPassword(values: {
    email: string,
}) {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.resetPasswordForEmail(values.email)

    return { error: error?.message || "Error sending reset password email", success: !error, data: user || null}

}

export async function changePassword(newPassword: string){
    const supabase = await createClient();

    const { data: user, error } = await supabase.auth.updateUser({
        password: newPassword
    })

    return { error: error?.message || "Error Changing Password", success: !error, data: user || null}

}