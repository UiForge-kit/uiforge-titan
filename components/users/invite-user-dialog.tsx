"use client";

import { useState } from "react";
import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isEmail } from "@/lib/validation";
import { inviteUser } from "@/store/actions";
import { useCustomers } from "@/store/data";
import type { UserRole } from "@/types/domain";

export function InviteUserDialog({ onClose }: { onClose: () => void }) {
  const customers = useCustomers((s) => s.items).filter((c) => c.status !== "churned");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [role, setRole] = useState<UserRole>("member");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError("Saisissez un nom.");
    if (!isEmail(email)) return setError("Adresse e-mail invalide.");
    if (inviteUser(customerId, name.trim(), email.trim(), role)) onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Inviter un utilisateur</DialogTitle>
            <DialogDescription>Un e-mail d&apos;invitation sera envoyé à cette adresse.</DialogDescription>
          </DialogHeader>
          <Field label="Nom"><Input autoFocus value={name} maxLength={80} onChange={(e) => { setName(e.target.value); setError(null); }} /></Field>
          <Field label="E-mail" error={error}><Input type="email" value={email} maxLength={120} onChange={(e) => { setEmail(e.target.value); setError(null); }} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client"><SelectField value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full">{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</SelectField></Field>
            <Field label="Rôle"><SelectField value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full"><option value="member">Membre</option><option value="admin">Admin</option></SelectField></Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Inviter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
