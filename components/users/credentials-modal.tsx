"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface CredentialsModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        name: string
        email: string
        password?: string
        role: string
    } | null
}

export function CredentialsModal({ isOpen, onClose, data }: CredentialsModalProps) {
    const [copied, setCopied] = useState(false)

    if (!data) return null

    const handleCopy = () => {
        const text = `Greenfield Academy - New Account\nName: ${data.name}\nRole: ${data.role}\nEmail: ${data.email}\nPassword: ${data.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Credentials copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mt-4 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-center">Account Created Successfully</DialogTitle>
                    <DialogDescription className="text-center">
                        Share these credentials with the user securely.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label>Full Name</Label>
                        <Input readOnly value={data.name} className="bg-muted" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email (Username)</Label>
                        <div className="relative">
                            <Input readOnly value={data.email} className="bg-muted pr-10" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Generated Password</Label>
                        <div className="relative">
                            <Input readOnly value={data.password} className="bg-muted pr-10 font-mono" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy Credentials"}
                    </Button>
                    <Button type="button" className="flex-1" onClick={onClose}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
