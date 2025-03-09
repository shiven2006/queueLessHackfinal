
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-queue-primary to-queue-secondary bg-clip-text text-transparent">
            Queue Society
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-medium">{currentUser.displayName}</span>
                <span className="text-sm text-gray-500">{currentUser.email}</span>
                <span className="text-xs text-queue-accent">{currentUser.role}</span>
              </div>
              <Avatar className="h-10 w-10 border-2 border-queue-primary">
                <AvatarImage src={currentUser.photoURL || ""} alt={currentUser.displayName || "User"} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-queue-danger text-queue-danger hover:bg-queue-danger/10"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
