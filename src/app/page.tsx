import type { ReactElement } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TabView } from "@/components/TabView";

export default function Home(): ReactElement {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <TabView />
      </main>
      <Footer />
    </>
  );
}
