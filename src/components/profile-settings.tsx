"use client";

import { useState } from "react";
import { useUserProfile, useUpdateProfile } from "@/hooks/use-user-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Example component demonstrating TanStack Query usage
 * Shows loading states, error handling, and mutations
 */
export function ProfileSettings() {
  const [displayName, setDisplayName] = useState("");
  
  // Using TanStack Query for data fetching
  const { data: profile, isLoading, error } = useUserProfile();
  
  // Using TanStack Query mutation for updates
  const updateProfile = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ displayName });
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load profile: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!profile) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName || profile.displayName || ""}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile.primaryEmail || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={updateProfile.isPending}
            className="w-full"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>

          {updateProfile.isSuccess && (
            <Alert>
              <AlertDescription>
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {updateProfile.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to update profile. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

