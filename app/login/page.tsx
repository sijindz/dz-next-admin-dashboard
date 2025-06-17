'use client';
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios"
import { SwalToast } from "@/components/SwalToast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

const authorSchema = z.object({
    username: z.string().min(1, {
        message: "Invalid Username"
    }),
    password: z.string().min(1, {
        message: "Invalid Username"
    })
})

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const authorForm = useForm<z.infer<typeof authorSchema>>({
        resolver: zodResolver(authorSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function doLogin(loginRq: z.infer<typeof authorSchema>) {
        console.log(loginRq)
        setLoading(true);
        try {
            const resp = await axios.post("http://localhost:8080/api/auth/sign-in", loginRq,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                })
            console.log(resp);
            if (resp?.data?.data?.token) {
                Cookies.set('_token', resp.data.data.token)
                SwalToast.fire({
                    icon: "success",
                    title: "You logged in Successfully!"
                });
                router.push("/");
            }
            else {
                SwalToast.fire({
                    icon: "error",
                    title: "Login Error"
                });
            }

        }
        catch (err: any) {            
            const errorDetails = `${err?.response?.data?.problemDetails[0]?.detail}`;
            console.log(errorDetails);
            SwalToast.fire({
                icon: "error",
                title: "Login Error",
                html: errorDetails
            });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
            <div className="w-full m-auto sm:max-w-lg px-4">
                <Form {...authorForm}>
                    <form onSubmit={authorForm.handleSubmit(doLogin)} className="space-y-8">
                        <FormMessage accessKey="common" />
                        <Card>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                                <CardDescription className="text-center">
                                    Enter your email and password to login
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <FormField
                                    control={authorForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={authorForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col">
                                <Button disabled={loading} className="w-full" type="submit">Login</Button>
                                <p className="mt-2 text-xs text-center text-gray-700">
                                    {" "}
                                    Don't have an account?{" "}

                                    <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    )
}