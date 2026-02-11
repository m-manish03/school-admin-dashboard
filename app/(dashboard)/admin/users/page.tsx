"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, FileSpreadsheet } from "lucide-react"
import { UserCreationForm } from "@/components/users/user-creation-form"
import { BulkUpload } from "@/components/users/bulk-upload"
import { UserList } from "@/components/users/user-list"

export default function UserManagementPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        All Users
                    </TabsTrigger>
                    <TabsTrigger value="individual" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Individual Creation
                    </TabsTrigger>
                    <TabsTrigger value="bulk" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Bulk Upload
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                    <UserList />
                </TabsContent>

                <TabsContent value="individual" className="space-y-4">
                    <UserCreationForm />
                </TabsContent>

                <TabsContent value="bulk" className="space-y-4">
                    <BulkUpload />
                </TabsContent>

            </Tabs>
        </div>
    )
}
