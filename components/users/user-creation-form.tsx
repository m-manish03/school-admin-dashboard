import { useState, useEffect } from "react"
import { useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { CredentialsModal } from "./credentials-modal"

// ... (Validation Schemas remain same) ...
// Validation Schemas
const studentSchema = z.object({
    name: z.string().min(2, "Name is required"),
    admissionNumber: z.string().min(1, "Admission Number is required"),
    class: z.string().min(1, "Class is required"),
    section: z.string().min(1, "Section is required"),
    rollNumber: z.string().min(1, "Roll Number is required"),
    parentPhone: z.string().min(10, "Valid phone number required").max(15, "Phone number too long"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
})

const teacherSchema = z.object({
    name: z.string().min(2, "Name is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
    subject: z.string().min(1, "Subject is required"),
    phone: z.string().min(10, "Valid phone number required"),
    email: z.string().email("Valid email is required"),
})

export function UserCreationForm() {
    const [activeTab, setActiveTab] = useState("student")
    const [loading, setLoading] = useState(false)
    const [createdUser, setCreatedUser] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)

    // Student Form
    const {
        register: registerStudent,
        handleSubmit: handleStudentSubmit,
        reset: resetStudent,
        setValue: setStudentValue,
        trigger: triggerStudent,
        formState: { errors: studentErrors },
    } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: "",
            admissionNumber: "",
            class: "",
            section: "",
            rollNumber: "",
            parentPhone: "",
            email: "",
        }
    })

    // Teacher Form
    const {
        register: registerTeacher,
        handleSubmit: handleTeacherSubmit,
        reset: resetTeacher,
        formState: { errors: teacherErrors },
    } = useForm({
        resolver: zodResolver(teacherSchema),
    })

    // Manually register Select fields
    useEffect(() => {
        registerStudent("class")
        registerStudent("section")
    }, [registerStudent])

    const onErrors = (errors: FieldErrors) => {
        console.log("Validation Errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    const onSubmit = async (data: any, role: "student" | "teacher") => {
        console.log("Submitting:", data);
        setLoading(true)
        try {
            const payload = { ...data, role };

            const response = await fetch("/api/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create user");
            }

            setCreatedUser(result.data);
            setShowModal(true);
            toast.success(`${role === 'student' ? 'Student' : 'Teacher'} account created successfully`);

            if (role === "student") resetStudent();
            else resetTeacher();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Create New Account</CardTitle>
                    <CardDescription>
                        Enter details manually to create a single student or teacher account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="student">Student</TabsTrigger>
                            <TabsTrigger value="teacher">Teacher</TabsTrigger>
                        </TabsList>

                        <TabsContent value="student">
                            <form onSubmit={handleStudentSubmit((data) => onSubmit(data, "student"), onErrors)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s_name">Full Name *</Label>
                                        <Input id="s_name" placeholder="John Doe" {...registerStudent("name")} />
                                        {studentErrors.name && <p className="text-xs text-destructive">{studentErrors.name.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admissionNumber">Admission Number *</Label>
                                        <Input id="admissionNumber" placeholder="ADM001" {...registerStudent("admissionNumber")} />
                                        {studentErrors.admissionNumber && <p className="text-xs text-destructive">{studentErrors.admissionNumber.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class *</Label>
                                        <Select onValueChange={(val) => {
                                            setStudentValue("class", val)
                                            triggerStudent("class")
                                        }}>
                                            <SelectTrigger id="class">
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(12)].map((_, i) => (
                                                    <SelectItem key={i + 1} value={`${i + 1}`}>Class {i + 1}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {studentErrors.class && <p className="text-xs text-destructive">{studentErrors.class.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="section">Section *</Label>
                                        <Select onValueChange={(val) => {
                                            setStudentValue("section", val)
                                            triggerStudent("section")
                                        }}>
                                            <SelectTrigger id="section">
                                                <SelectValue placeholder="Select Section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["A", "B", "C", "D"].map((s) => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {studentErrors.section && <p className="text-xs text-destructive">{studentErrors.section.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rollNumber">Roll Number *</Label>
                                        <Input id="rollNumber" placeholder="01" {...registerStudent("rollNumber")} />
                                        {studentErrors.rollNumber && <p className="text-xs text-destructive">{studentErrors.rollNumber.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="parentPhone">Parent Phone *</Label>
                                        <Input id="parentPhone" placeholder="+91 9876543210" {...registerStudent("parentPhone")} />
                                        {studentErrors.parentPhone && <p className="text-xs text-destructive">{studentErrors.parentPhone.message as string}</p>}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="s_email">Email (Optional)</Label>
                                        <Input id="s_email" placeholder="student@school.com" {...registerStudent("email")} />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Student Account
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="teacher">
                            <form onSubmit={handleTeacherSubmit((data) => onSubmit(data, "teacher"), onErrors)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="t_name">Full Name *</Label>
                                        <Input id="t_name" placeholder="Dr. Sarah Smith" {...registerTeacher("name")} />
                                        {teacherErrors.name && <p className="text-xs text-destructive">{teacherErrors.name.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employeeId">Employee ID *</Label>
                                        <Input id="employeeId" placeholder="EMP001" {...registerTeacher("employeeId")} />
                                        {teacherErrors.employeeId && <p className="text-xs text-destructive">{teacherErrors.employeeId.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input id="subject" placeholder="Mathematics" {...registerTeacher("subject")} />
                                        {teacherErrors.subject && <p className="text-xs text-destructive">{teacherErrors.subject.message as string}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone *</Label>
                                        <Input id="phone" placeholder="+91 98765 43210" {...registerTeacher("phone")} />
                                        {teacherErrors.phone && <p className="text-xs text-destructive">{teacherErrors.phone.message as string}</p>}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="t_email">Email *</Label>
                                        <Input id="t_email" type="email" placeholder="teacher@school.edu" {...registerTeacher("email")} />
                                        {teacherErrors.email && <p className="text-xs text-destructive">{teacherErrors.email.message as string}</p>}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Teacher Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <CredentialsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={createdUser}
            />
        </>
    )
}
