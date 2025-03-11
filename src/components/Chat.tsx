import React, { useState } from 'react';
import { Shield, Search, LightbulbIcon, Plus, Mic, Home, FileText, Video, FileCheck, LayoutDashboard, Link, Mail, Phone, MapPin, Lock, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import PaperGen from './PaperGen';

function Chat() {
  const [showPaperGen, setShowPaperGen] = useState(false);

  if (showPaperGen) {
    return <PaperGen />;
  }

  return (
    <div className="min-h-screen flex flex-col">


      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">What can I help with?</h1>
        
        {/* Message Input Box */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-gray-400 text-xl mb-6">Message</div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300">
                <Plus className="w-6 h-6 text-gray-500" />
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-400">Search</span>
              </div>
              
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <LightbulbIcon className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-400">Reason</span>
              </div>
            </div>
            
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-black">
              <Mic className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </main>
        
    </div>
  );
}

export default Chat;