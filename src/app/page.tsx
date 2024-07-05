"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UsernameForm from "@/components/username-form";
import Gamma from "@/lib/gamma";
import { getSelectedModel } from "@/lib/model-helper";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { ChatRequestOptions } from "ai";
import { Message, useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";

type ResponseIa = {
  answer: string;
  awnser_code: string;
};

export default function Home() {
  const { handleSubmit, isLoading, error, stop } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      toast.error("Ocorreu um erro. Por favor tente novamente");
    },
  });
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  // React.useEffect(() => {
  //   if (!isLoading && !error && chatId && messages.length > 0) {
  //     if (typeof window !== "undefined") {
  //       // Save messages to local storage
  //       localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  //     }
  //     // Trigger the storage event to update the sidebar component
  //     window.dispatchEvent(new Event("storage"));
  //   }
  // }, [messages, chatId, isLoading, error]);

  // useEffect(() => {
  //   if (env === "production") {
  //     const newOllama = new ChatOllama({
  //       baseUrl: "http://localhost:11434",
  //       model: selectedModel,
  //     });
  //     setOllama(newOllama);
  //   }

  //   console.log("selectedModel:", selectedModel);
  //   if (!localStorage.getItem("ifood_user")) {
  //     setOpen(true);
  //   }
  // }, [selectedModel]);

  // useEffect(() => {
  //   // if (selectedModel === "Browser Model") {
  //   //   console.log("Selected model: Browser");
  //   //   const gammaInstance = Gamma.getInstance();
  //   //   setGamma(gammaInstance);
  //   // }
  // }, [setSelectedModel, selectedModel]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFirstMessage = messages.length === 0;
    setMessages([...messages, { role: "user", content: input, id: uuidv4() }]);
    setInput("");

    try {
      const cnpj = localStorage.getItem("ifood_cnpj");
      if (isFirstMessage) {
        const response = await fetch("http://localhost:8080/welcome", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cnpj: cnpj }),
        });
        const data: ResponseIa = await response.json();
        setMessages((oldMessages) => {
          return [
            ...oldMessages,
            { role: "assistant", content: data.answer, id: uuidv4() },
          ];
        });
      } else {
        const response = await fetch("http://localhost:8080/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cnpj: cnpj, user_input: input }),
        });
        const data: ResponseIa = await response.json();
        setMessages((oldMessages) => {
          return [
            ...oldMessages,
            { role: "assistant", content: data.answer, id: uuidv4() },
          ];
        });
      }
      setLoadingSubmit(true);
    } catch (error) {
    } finally {
      setLoadingSubmit(false);
    }

    // e.preventDefault();
    // setLoadingSubmit(true);
    // if (messages.length === 0) {
    //   // Generate a random id for the chat
    //   console.log("Generating chat id");
    //   const id = uuidv4();
    //   setChatId(id);
    // }
    // if (selectedModel === "Browser Model") {
    //   try {
    //     // Add the user message to the chat
    //     addMessage({ role: "user", content: input, id: chatId });
    //     setInput("");
    //     if (gamma === null) {
    //       const gammaInstance = Gamma.getInstance();
    //       setGamma(gammaInstance);
    //     }
    //     // Generate a response
    //     const responseGenerator = gamma
    //       ? await gamma.summarize(input)
    //       : (async function* () {})();
    //     console.log("Response from Browser Model:", responseGenerator);
    //     let responseMessage = "";
    //     // Display response chunks as they arrive and append them to the message
    //     for await (const chunk of responseGenerator) {
    //       responseMessage += chunk;
    //       window.dispatchEvent(new Event("storage"));
    //       setMessages([
    //         ...messages,
    //         { role: "assistant", content: responseMessage, id: chatId },
    //       ]);
    //       setLoadingSubmit(false);
    //     }
    //   } catch (error) {
    //     console.error("Error processing message with Browser Model:", error);
    //   }
    // } else {
    //   setMessages([...messages]);
    //   // Prepare the options object with additional body data, to pass the model.
    //   const requestOptions: ChatRequestOptions = {
    //     options: {
    //       body: {
    //         selectedModel: selectedModel,
    //       },
    //     },
    //   };
    //   if (env === "production" && selectedModel !== "REST API") {
    //     handleSubmitProduction(e);
    //   } else {
    //     // use the /api/chat route
    //     // Call the handleSubmit function with the options
    //     handleSubmit(e, requestOptions);
    //   }
    // }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleUpdateData = async () => {
    const cnpj = localStorage.getItem("ifood_cnpj");
    const response = await fetch("http://localhost:8080/welcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cnpj: cnpj }),
    });
    const data: ResponseIa = await response.json();
    setMessages((oldMessages) => {
      return [
        ...oldMessages,
        { role: "assistant", content: data.answer, id: uuidv4() },
      ];
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("ifood_cnpj")) {
      setOpen(true);
    } else {
      handleUpdateData();
    }
  }, []);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <Dialog open={open} onOpenChange={setOpen}>
        <ChatLayout
          input={input}
          messages={messages}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={loadingSubmit}
          loadingSubmit={loadingSubmit}
          error={error}
          stop={stop}
          navCollapsedSize={10}
          defaultLayout={[30, 160]}
        />
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Bem vindo ao Chat do Beni</DialogTitle>
            <DialogDescription>
              Preencha seu nome. Isso será usado para personalizar sua
              experiência
            </DialogDescription>
            <UsernameForm
              setOpen={setOpen}
              handleUpdateData={handleUpdateData}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
