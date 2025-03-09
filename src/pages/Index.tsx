
import React from "react";
import Header from "@/components/Header";
import QueueDashboard from "@/components/QueueDashboard";
import QueueList from "@/components/QueueList";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <AnimatedBackground />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <QueueDashboard />
          </div>
          <div className="w-full md:w-2/3">
            <QueueList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
