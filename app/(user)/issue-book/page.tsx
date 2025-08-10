'use client';
import { CommonSearchableSelect } from "@/components/custom/common-searchable-select";
import { DzDataTable } from "@/components/custom/table/data-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FilterCondition, SelectboxModal } from "@/types/type";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { commonDataTableFetch } from "@/lib/axios-utils";
import { ColumnDef, ColumnFilter } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Book } from "../book/components/columns";
import Link from "next/link";
import { BsCartPlusFill, BsTrash } from "react-icons/bs";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import ResponseUtils from "@/lib/respone-utils";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ENDPOINT_ISSUE_BOOK, ENDPOINT_MEMBER } from "@/constants/api-constants";
import { SwalToast } from "@/components/SwalToast";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});



export type BookEntry = {
    id: number
    bookNumber: string
    book: Book
    isbn: string
}



export type CartItem = {
    id: number,
    bookNumber: string,
    title: string,
    dueDate: string
}

export default function IssueBookPage() {
    const [loading, setLoading] = useState(false);
    const [toggleSearchTableReload, setToggleSearchTableReload] = useState(false);
    const [activeMember, setActiveMember] = useState<SelectboxModal>();
    const [activeMemberData, setMemberData] = useState<any>();
    const [activeDate, setActiveDate] = useState<Date>();
    const router = useRouter();
    const MySwal = withReactContent(Swal)
    const [bookCart, setBookCart] = useState<CartItem[]>([]);


    const filterConditions=[{
        "attribute": "status",
        "operator": "=",
        "value": "true",
        "type": "AND"
    }];

    useEffect(
        () => {
            console.log(activeMember);
            loadMember();
        }, [activeMember]);

    function reloadSearchTable() {
        setToggleSearchTableReload(old => !old);
    }

    async function loadMember() {
        if (!activeMember)
            return;
        try {
            const response = await axiosInterceptorInstance.get(`${ENDPOINT_MEMBER}/find-one?id=${activeMember?.key}&&mode=VIEW`);
            if (response?.data?.data) {
                setMemberData(response.data.data);
                console.log(response.data.data);
            }
        }
        catch (exception: any) {
            const isAuthError = ResponseUtils.isAuthError(exception);
            MySwal.fire({
                title: "Error!",
                text: exception.response?.data?.message,
                html: isAuthError ? <Link className='underline hover:text-blue-800' href="/logout" >Log out</Link> : '',
                icon: "error",
                showConfirmButton: !isAuthError
            })
        }
    }

    function addToCart(activeRow: BookEntry) {
        console.log(activeMember);
        console.log(activeDate ? format(activeDate ?? '', "dd-MMM-yyyy") : '');
        console.log(activeRow)
        let errMsg = undefined;
        if (!activeMemberData) {
            errMsg = "Please Select a memeber"
        }
        else if (!activeMemberData.activeMemberShip) {
            errMsg = "Invalid membership"
        }
        else if (bookCart.some(({ id }) => id ? (activeRow?.id === id) : false)) {
            errMsg = "Book already in cart"
        }
        if (errMsg) {
            MySwal.fire({
                title: "Error!",
                text: errMsg,
                icon: "error",
                heightAuto: false
            })
        }
        else {
            const cartItem = {
                id: activeRow?.id,
                bookNumber: activeRow?.bookNumber,
                title: activeRow.book.name,
                dueDate: format(addDays(Date(), activeMemberData.activeMemberShip.dayLimit), "dd-MM-yyyy")
            };
            setBookCart((prevCart) => prevCart.concat(cartItem));
            reloadSearchTable();
            SwalToast.fire({
                icon: "success",
                title: "Book added to cart!"
            });
        }
    }

    function removeFromCartHandler(id: number) {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(id);
                reloadSearchTable();
                SwalToast.fire({
                    icon: "error",
                    title: "Book removed from cart!"
                });
            }
        });
    }
    const removeFromCart = (id: number) => {
        setBookCart((prevCart) => prevCart.filter(item => item.id !== id));
    }

    async function issueBook() {
        setLoading(true);
        const issueBookRqs = bookCart.map(bookCartItem => {
            const bookEntry = { id: bookCartItem.id };
            const member = { id: activeMemberData.id };
            const issueBookRq = {
                bookEntry: bookEntry,
                member: member,
                issueDate: format(Date(), "dd-MM-yyyy"),
                expectedReturnDate: bookCartItem.dueDate
            }
            return issueBookRq;
        });
        console.log(issueBookRqs);
        try {
            const res = await axiosInterceptorInstance.post(`${ENDPOINT_ISSUE_BOOK}/issues`, issueBookRqs);
            console.log(res)
            setBookCart([]);
            setActiveMember(undefined);
            setMemberData(undefined);
            if (res.data.status) {
                MySwal.fire({
                    position: 'top-right',
                    icon: 'success',
                    title: 'Book Issued!',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }
        catch (ex: any) {
            MySwal.fire({
                title: "Error!",
                html: <div>{ex.response.data.errors?.map((err: any) => {
                    return <p>{err.message}</p>;
                })}</div>,
                icon: "error"
            });
            console.log(ex?.response?.data?.errors);
        }
        finally {
            setLoading(false);
        }

    }
    const bookEntryColumns: ColumnDef<BookEntry>[] = [
        {
            accessorKey: "bookNumber",
            header: "Book Number",
        },
        {
            accessorFn: row => row.book?.name ?? '',
            header: "Book Name",
        },
        {
            accessorFn: row => row?.book?.author?.firstName ?? '',
            header: "Author",
            enableColumnFilter: false
        },
        {
            id: "actions",
            cell: ({ row }) => <Link href='#' title="Add Book" onClick={(e) => { e.preventDefault(); addToCart(row.original); }}><BsCartPlusFill className="text-3xl hover:text-green-800" /></Link>
        }
    ]

    const loadData = async (options: {
        pageIndex: number
        pageSize: number
        columnFilters: ColumnFilter[]
    }) => {

        const filterConditionArray: FilterCondition[] = [];
        filterConditionArray.push({
            "attribute": "status",
            "operator": "=",
            "value": "true",
            "type": "AND"
        });
        options.columnFilters.map((filterVal) => {

            let attribute = filterVal.id?.toString();
            if (filterVal.id == 'Book Name') {
                attribute = "book.name"
            }
            else if (filterVal.id == "Current Member") {
                attribute = "activeMember.firstName"
            }

            filterConditionArray.push({
                "attribute": attribute ?? "",
                "operator": "=?",
                "value": filterVal.value?.toString() ?? "",
                "type": "AND"
            })
        })

        const bookNumberVals = bookCart.map(x => x.bookNumber).join(",");
        console.log("******" + bookNumberVals);
        filterConditionArray.push({
            "attribute": "bookNumber",
            "operator": "!in",
            "value": bookNumberVals,
            "type": "AND"
        });

        console.log("Book table fetch.......");
        return commonDataTableFetch("book-entry/filtered-list-by-page?index=" + options.pageIndex + '&size=' + options.pageSize, filterConditionArray, () => {
            router.push("/login");
        })
    }


    return (
        <div>
            <Card className="w-full">
                <CardContent>
                    <div className="flex justify-between pt-5 pb-10">
                        <h2 className="text-3xl font-bold tracking-tight">Issue Book</h2>
                    </div>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <div className="md:col-span-1 items-center gap-4">
                            <div className="flex flex-col space-y-1.5 w-full">
                                <label>Select Member</label>
                                <CommonSearchableSelect url="/member/filtered-dropdown" filters={filterConditions} activeItem={activeMember} setActiveItem={setActiveMember} />
                            </div>
                            <div className="flex flex-col space-y-1.5 w-full">
                                <label>Issue Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !activeDate && "text-muted-foreground"
                                            )}
                                        >
                                            {activeDate ? (
                                                format(activeDate, "dd-MMM-yyyy")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="z-[99999] popover-content-width-same-as-its-trigger h-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={activeDate}
                                            onSelect={setActiveDate}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>

                                        <TableHead>Book No.</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {bookCart.length > 0 ? bookCart.map((field, index) => {
                                        return (
                                            <TableRow key={index}>

                                                <TableCell className="font-medium">{field.bookNumber}</TableCell>
                                                <TableCell className="font-medium">{field.title}</TableCell>
                                                <TableCell className="font-medium">{field.dueDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link href="#" type="button" onClick={(e) => {
                                                        e.preventDefault();
                                                        removeFromCartHandler(field.id);
                                                    }}>
                                                        <BsTrash className="text-xl text-red-500 hover:text-red-900" />
                                                    </Link></TableCell>
                                            </TableRow>)
                                    }) :
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center"
                                            >
                                                No books selected.
                                            </TableCell>
                                        </TableRow>

                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-between sm:w-1/3 w-full">
                        <Button onClick={() => issueBook()} disabled={loading || bookCart.length == 0} type="button">Issue Book</Button>
                    </div>
                </CardFooter>
            </Card >
            <QueryClientProvider client={queryClient}>
                <Card className="w-full">
                    <CardContent>
                        <div className="flex justify-between pt-5 pb-10">
                            <h2 className="text-3xl font-bold tracking-tight">Search Book</h2>
                        </div>
                        <div className="">
                            <DzDataTable columns={bookEntryColumns} fetchData={loadData} toggleReload={toggleSearchTableReload} />
                        </div>
                    </CardContent>
                </Card>
            </QueryClientProvider>
        </div>
    )
}