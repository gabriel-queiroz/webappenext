"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  cnpj: z.string().min(14, {
    message: "Cnpj must be at least 14 characters.",
  }),
});

interface EditUsernameFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUsernameForm({ setOpen }: EditUsernameFormProps) {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("ifood_user") || "");
    setCnpj(localStorage.getItem("ifood_cnpj") || "");
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      cnpj: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("ifood_user", values.username);
    window.dispatchEvent(new Event("storage"));
    toast.success("Nome e cnpj atualizado com sucesso");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    form.setValue("username", e.currentTarget.value);
    setName(e.currentTarget.value);
  };

  const handleChangeCnpj = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    form.setValue("cnpj", e.currentTarget.value);
    setCnpj(e.currentTarget.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <div className="md:flex gap-4">
                  <Input
                    {...field}
                    type="text"
                    value={name}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cnpj</FormLabel>
              <FormControl>
                <div className="md:flex gap-4">
                  <Input
                    {...field}
                    type="text"
                    value={cnpj}
                    onChange={(e) => handleChangeCnpj(e)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Alterar dados</Button>
      </form>
    </Form>
  );
}
