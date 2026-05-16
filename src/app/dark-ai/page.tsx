import DarkAiClient from "./components/DarkAiClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dark Ai - Your Intelligent Assistant",
    description: "Chat with Dark Ai, the premium intelligent assistant on Vidgram. Get help with coding, writing, and creative ideas.",
    openGraph: {
        title: "Dark Ai - Your Intelligent Assistant",
        description: "Chat with Dark Ai, the premium intelligent assistant on Vidgram.",
        type: "website",
    }
};

export default function DarkAiPage() {
    return <DarkAiClient />;
}
