"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Upload, FileUp, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Papa from "papaparse"

export function BulkUpload() {
    const [role, setRole] = useState<"student" | "teacher">("student")
    const [file, setFile] = useState<File | null>(null)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [summary, setSummary] = useState<any>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            parseFile(selectedFile)
            setSummary(null)
        }
    }

    const parseFile = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Map CSV fields to internal schema if needed, or just validate.
                // For now, assume CSV headers match: name, admissionNumber etc.
                setPreviewData(results.data)
            },
            error: (error) => {
                toast.error(`Error parsing CSV: ${error.message}`)
            }
        })
    }

    const handleUpload = async () => {
        if (!previewData.length) return
        setUploading(true)
        setProgress(10)

        try {
            // transform data based on role
            const users = previewData.map(row => {
                // Simple normalization
                const user: any = { role, ...row }
                // Clean keys (remove spaces)
                Object.keys(user).forEach(key => {
                    const newKey = key.trim();
                    if (newKey !== key) {
                        user[newKey] = user[key];
                        delete user[key];
                    }
                });
                return user;
            });

            // Simulate progress
            const interval = setInterval(() => {
                setProgress(p => Math.min(p + 10, 90))
            }, 200)

            const response = await fetch("/api/users/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ users }),
            });

            clearInterval(interval);
            setProgress(100);

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Upload failed");

            setSummary(result.summary);
            toast.success(`Processed ${result.summary.total} records`);

        } catch (error: any) {
            toast.error(error.message);
            setProgress(0);
        } finally {
            setUploading(false);
        }
    }

    const downloadTemplate = () => {
        const headers = role === "student"
            ? ["name", "admissionNumber", "class", "section", "rollNumber", "parentPhone", "email"]
            : ["name", "employeeId", "subject", "phone", "email"];

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + (role === "student" ? "John Doe,ADM001,10,A,01,9876543210," : "Dr. Smith,EMP001,Math,9876543210,smith@school.edu");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${role}_template.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bulk Upload {role === "student" ? "Students" : "Teachers"}</CardTitle>
                <CardDescription>Upload a CSV file to create multiple accounts at once.</CardDescription>
                <div className="flex gap-2 mt-4">
                    <Button variant={role === "student" ? "default" : "outline"} onClick={() => { setRole("student"); setPreviewData([]); setSummary(null); }}>Students</Button>
                    <Button variant={role === "teacher" ? "default" : "outline"} onClick={() => { setRole("teacher"); setPreviewData([]); setSummary(null); }}>Teachers</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 hover:bg-muted/50 transition-colors">
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">Select CSV File</span>
                        <Input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">{file ? file.name : "Supported formats: .csv"}</p>
                    <Button variant="link" size="sm" onClick={downloadTemplate} className="mt-2 text-xs">Download Template</Button>
                </div>

                {previewData.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-medium">Preview ({previewData.length} entries)</h3>
                        <ScrollArea className="h-[200px] border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(previewData[0]).map((head) => (
                                            <TableHead key={head}>{head}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {previewData.map((row, i) => (
                                        <TableRow key={i}>
                                            {Object.values(row).map((cell: any, j) => (
                                                <TableCell key={j}>{cell}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                )}

                {uploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                )}

                {summary && (
                    <Alert variant={summary.failureCount > 0 ? "destructive" : "default"} className={summary.failureCount > 0 ? "" : "border-green-500 bg-green-50 text-green-700"}>
                        {summary.failureCount > 0 ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <AlertTitle>Upload Compelte</AlertTitle>
                        <AlertDescription>
                            Total: {summary.total} | Success: {summary.successCount} | Failed: {summary.failureCount}
                        </AlertDescription>
                    </Alert>
                )}

            </CardContent>
            <CardFooter>
                <Button onClick={handleUpload} disabled={!file || uploading || previewData.length === 0} className="w-full">
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                    {uploading ? "Processing..." : "Start Upload"}
                </Button>
            </CardFooter>
        </Card>
    )
}
