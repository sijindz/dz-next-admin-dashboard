'use client';

import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsBook, BsPerson } from "react-icons/bs";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export const dynamic = 'force-dynamic';

export default function Dashboard() {

    const [status, setStatus] = useState({ totalBooks: 0, totalMembers: 0, issuedToday: 0, returnedToday: 0 });

    const [chartData, setChartData] = useState([{ issuedBookCount: 0, returnedBookCount: 0, date: "" }]);

    async function loadData() {
        await axiosInterceptorInstance.get('lms-status')
            .then(function (response) {
                setStatus(response.data.data);
            })
            .catch(
                function (ex) {
                    console.log(ex);
                }
            );
    }

    async function loadChartData() {
        const endDate = moment().format('DD-MM-yyyy');
        const startDate = moment().add(-7, 'd').format('DD-MM-yyyy');
        await axiosInterceptorInstance.get(`lms-status/chart-data/issue-return-status?startDate=${startDate}&endDate=${endDate}`)
            .then(function (response) {
                setChartData(response.data.data);
            })
            .catch(
                function (ex) {
                    console.log(ex);
                }
            );
    }

    useEffect(() => {
        loadData();
        loadChartData();
    }, []);

    return (
        <>
            <h2 className="text-3xl font-bold tracking-tight my-4">Dashboard</h2>

            <div className="flex-1 space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total  Books</CardTitle>
                            <BsBook size={20} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{status ? status?.totalBooks : 0}</div>
                            <p className="text-xs text-muted-foreground">
                                total number of active books
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Members
                            </CardTitle>
                            <BsPerson size={20} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{status ? status?.totalMembers : 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Total number active members
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Books issued today</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <path d="M2 10h20" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{status ? status?.issuedToday : 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Number of books issued today
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Books returned today
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{status ? status?.returnedToday : 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Number of books returned today
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 grid-cols-1">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <ResponsiveContainer width="100%" height={350}>
                            {chartData &&
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date"/>
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar name="Issued Books" dataKey="issuedBookCount" fill="#8884d8" className="text-sidebar-foreground" />
                                    <Bar name="Returned Books" dataKey="returnedBookCount" fill="#82ca9d" className="black" />
                                </BarChart>
                            }
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </>
    )
}