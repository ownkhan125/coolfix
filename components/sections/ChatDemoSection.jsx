"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import GlassCard from "@/components/ui/GlassCard";
import Tabs from "@/components/ui/Tabs";
import TabButton from "@/components/ui/TabButton";
import TabPanel from "@/components/ui/TabPanel";
import AcNotCoolingChat from "./chat-demo/AcNotCoolingChat";
import FridgeNoiseChat from "./chat-demo/FridgeNoiseChat";
import GasLeakChat from "./chat-demo/GasLeakChat";

// Chat demo: intro text, a tab bar with three demo problems, and the glass chat card showing the chosen conversation
export default function ChatDemoSection() {
  // Which demo conversation is shown: "ac-not-cooling", "fridge-noise" or "gas-leak"
  const [activeTab, setActiveTab] = useState("ac-not-cooling");

  return (
    <section id="chat-demo" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 md:py-28 lg:grid-cols-2">
      {/* Text: heading and intro */}
      <div>
        <h2>
          See the assistant <span className="text-gradient-cool">in action</span>
        </h2>
        <p className="text-lead text-muted mt-4">
          It reads the message, looks at the photo, scores the lead and books the visit, all in one short chat.
        </p>
      </div>

      {/* Demo: tab bar above the glass chat card */}
      <div className="flex flex-col gap-6">
        <Tabs label="Demo conversations">
          <TabButton
            id="chat-tab-ac-not-cooling"
            label="AC not cooling"
            panelId="chat-demo-panel"
            isActive={activeTab === "ac-not-cooling"}
            onSelect={() => setActiveTab("ac-not-cooling")}
          />
          <TabButton
            id="chat-tab-fridge-noise"
            label="Fridge noise"
            panelId="chat-demo-panel"
            isActive={activeTab === "fridge-noise"}
            onSelect={() => setActiveTab("fridge-noise")}
          />
          <TabButton
            id="chat-tab-gas-leak"
            label="Gas leak"
            panelId="chat-demo-panel"
            isActive={activeTab === "gas-leak"}
            onSelect={() => setActiveTab("gas-leak")}
          />
        </Tabs>

        <GlassCard>
          {/* Chat header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="logo-text">CoolFix assistant</p>
            <p className="text-small text-muted">Online</p>
          </div>

          {/* Conversation: only the active tab's panel is shown; mode="wait" lets the old one leave first */}
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "ac-not-cooling" && (
              <TabPanel key="ac-not-cooling" id="chat-demo-panel" tabId="chat-tab-ac-not-cooling">
                <AcNotCoolingChat />
              </TabPanel>
            )}
            {activeTab === "fridge-noise" && (
              <TabPanel key="fridge-noise" id="chat-demo-panel" tabId="chat-tab-fridge-noise">
                <FridgeNoiseChat />
              </TabPanel>
            )}
            {activeTab === "gas-leak" && (
              <TabPanel key="gas-leak" id="chat-demo-panel" tabId="chat-tab-gas-leak">
                <GasLeakChat />
              </TabPanel>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}
