'use client';
import React from "react";
import { Award } from "lucide-react";
import { getAuth } from "firebase/auth";

const ProfileHero = ({ athlete }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <div className="relative w-full  animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-3xl"></div>
      <div className="glass rounded-3xl p-8 md:p-12 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-purple to-purple-light p-1">
            <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm"></div>
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-5xl font-bold text-white">
              {user?.displayName?.charAt(0) || "U"}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{user?.displayName || "User"}</h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple/20 text-purple-light mb-4">
              <span className="mr-2">{athlete.sport}</span>
              <Award className="h-4 w-4" />
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Elite athlete specializing in {athlete.sport} with a focus on peak performance and
              continuous improvement. Currently on a {athlete.streak}-day training streak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
