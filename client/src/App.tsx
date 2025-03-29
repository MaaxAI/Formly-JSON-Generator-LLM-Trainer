import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Generator from "@/pages/generator";
import Trainer from "@/pages/trainer";
import Assistant from "@/pages/assistant";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-2xl">dynamic_form</span>
            <h1 className="text-xl font-medium">Formly JSON Generator & LLM Trainer</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button 
                  onClick={() => setActiveTab("generator")} 
                  className={`px-3 py-2 rounded-md transition-colors ${activeTab === "generator" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Generator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("trainer")} 
                  className={`px-3 py-2 rounded-md transition-colors ${activeTab === "trainer" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  LLM Trainer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("assistant")} 
                  className={`px-3 py-2 rounded-md transition-colors ${activeTab === "assistant" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Assistant
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 overflow-hidden">
        <Switch>
          <Route path="/" component={() => {
            if (activeTab === "generator") return <Generator />;
            if (activeTab === "trainer") return <Trainer />;
            if (activeTab === "assistant") return <Assistant />;
            return <NotFound />;
          }} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;
