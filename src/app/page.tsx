import type { ReactElement } from "react";
import { Navbar } from "@/components/Navbar";
import { TabView } from "@/components/TabView";

export default function Home(): ReactElement {
  return (
    <>
      <Navbar />
      <main className="h-screen pt-20 overflow-hidden flex flex-col">
        <TabView />
      </main>
    </>
  );
}
