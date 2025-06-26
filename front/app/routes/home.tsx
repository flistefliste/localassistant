import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";
import  Chat from "../chat/chat";
import  Summarize from "../summarize/summarize";
import Anomymize from "~/anonymize/anonymize";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
   <div className={`grid md:grid-cols-3 gap-4`}>
      <Chat />
      <Summarize />
      <Anomymize />
   </div>
  )
}
