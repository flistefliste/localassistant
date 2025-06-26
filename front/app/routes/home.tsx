import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";
import  Chat from "../chat/chat";


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
   </div>
  )
}
