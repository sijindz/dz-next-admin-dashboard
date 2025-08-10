'use client'
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { BsTable } from "react-icons/bs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as z from 'zod'


const formSchema = z.object({
    id: z.number().optional(),
    categoryList: z.array(z.object({
        id: z.number().optional(),
        name: z.string().optional()
    })).nonempty({ message: "Please add atleast one category" }),
    membershipName: z.string().min(1, "Invalid membership name"),
    bookLimit: z.number().gt(0, "Invalid book limit"),
    dayLimit: z.number().gt(0, "Invalid day limit"),
    membershipFee: z.number().gt(0, "Invalid membership fee")

})

export default function MembershipForm({ initData }: { initData: any }) {

    const title = initData ? 'Edit membership' : 'Create membership';
    const toastMessage = initData ? 'Membership updated.' : 'Membership created.';
    const action = initData ? 'Save changes' : 'Create';

    const MySwal = withReactContent(Swal);
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);


    const filterConditions = [{
        "attribute": "status",
        "operator": "=",
        "value": "true",
        "type": "AND"
    }];

    const [categories, setCategories] = React.useState<any[] | null>(null);


    const defaultValues = initData ?? {
        id: 0,
        categoryList: [],
        membershipName: '',
        bookLimit: 0,
        dayLimit: 0,
        membershipFee: 0
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const { fields: categoryFields, append, remove } = useFieldArray({
        keyName: "_id",
        name: "categoryList",
        control: form.control
    });


    const handleCategoryChange = (checked: any, categoryId: any, categoryName: any) => {
        console.log(checked, categoryId)
        if (checked == true) {
            const isExist = isCategoryExisting(categoryId);
            if (!isExist) {
                append({ id: parseInt(categoryId), name: categoryName });
                console.log("category added");
            }
        }
        else {
            const index = categoryFields?.findIndex(category => category.id == categoryId);
            if (index > -1) {
                remove(index);
                console.log("category removed");
            }
        }
        console.log(categoryFields);
    }

    const isCategoryExisting = (categoryId: any) => {
        return categoryFields?.some(({ id }) => id == categoryId);
    }


    async function saveMembership(saveMembership: z.infer<typeof formSchema>) {

        setLoading(true);
        console.log(saveMembership);
        let result: any;
        if (initData) {
            result = axiosInterceptorInstance.put('membership/update', saveMembership);
        }
        else {
            result = axiosInterceptorInstance.post('membership/save', saveMembership);
        }

        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                setLoading(false);
                router.refresh();
                MySwal.fire({
                    position: "center",
                    icon: "success",
                    title: toastMessage,
                    showConfirmButton: false,
                    timer: 1000
                });
                router.refresh();
                router.push('/membership');
            }
            else {
                console.log(response.data.errors);
                response.data.errors?.map((err: any) => {
                    form.setError((err.field && form.control._names.mount.has(err.field)) ? err.field : "root", { type: "custom", message: err.message });
                })
                setLoading(false);
            }
        })
            .catch(function (error: any) {
                console.error(error);
                MySwal.fire({
                    title: "Error",
                    text: error.response?.data?.message,
                    icon: "error"
                });
                setLoading(false);
            });

    }

    React.useEffect(() => {
        console.log(form.formState.errors);
    }, [form.formState.errors]);


    React.useEffect(() => {
        const loadEntries = async () => {

            try {
                const response = await axiosInterceptorInstance.post("/category/filtered-dropdown", filterConditions);
                if (response && response.data && response.data.status === true) {
                    setCategories(response.data.data);
                }
                else {
                    console.log(response.data.errors);
                    response.data.errors?.map((err: any) => {
                        MySwal.fire({
                            title: "Error!",
                            text: err?.message,
                            icon: "error"
                        });
                    })
                }
            } catch (error: any) {
                MySwal.fire({
                    title: "Error!",
                    text: error?.message,
                    icon: "error"
                });
            }
        }
        if (categories === null) {
            loadEntries();
        }
    }, []);


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(saveMembership)}>
                    <Card className="w-full lg:w-1/2">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/membership'} className='text-3xl'><BsTable /></Link>
                            </div>
                            {form.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {form.formState.errors?.root?.message}
                                </AlertDescription>
                            </Alert>}
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="membershipName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-bold">Membership Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Membership Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <div className="flex flex-col space-y-1.5 w-full">
                                        <FormField
                                            control={form.control}
                                            name="membershipFee"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-bold">Membership Fee</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Membership Fee" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5 w-full">

                                        <FormField
                                            control={form.control}
                                            name="dayLimit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-bold">Day Limit</FormLabel>
                                                    <FormControl>
                                                        <Input type='number' placeholder="Day Limit" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5 w-full">

                                        <FormField
                                            control={form.control}
                                            name="bookLimit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-bold">Book Limit</FormLabel>
                                                    <FormControl>
                                                        <Input type='number' placeholder="Book Limit" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label className="text-gray-700 font-bold mb-2">Categories</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {categories && categories.map((entry, index) => (
                                            <div className="flex items-center space-x-2" key={index}>
                                                <Checkbox
                                                    id={entry?.key}
                                                    name="amenities"
                                                    value={entry?.key}
                                                    className="mr-2"
                                                    defaultChecked={isCategoryExisting(entry?.key)}
                                                    onCheckedChange={(checked) => handleCategoryChange(checked, entry?.key, entry?.value)}
                                                />
                                                <label
                                                    htmlFor={entry?.key}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {entry?.value}
                                                </label>
                                            </div>
                                        ))}                                        
                                    </div>
                                    {form.formState.errors?.categoryList && <p className="text-sm font-medium text-destructive">{form.formState.errors?.categoryList?.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-between w-full">
                                <Button onClick={() => form.reset()} disabled={loading} type="button" variant="outline">Clear</Button>
                                <Button disabled={loading} type="submit">{action}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>
    );
}