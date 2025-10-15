"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, Users, Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { SelectTeam } from "@/lib/db/schema";

export function TeamsListPage() {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const { data: teams, isLoading, refetch } = useQuery<SelectTeam[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    },
  });

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName }),
      });

      if (response.ok) {
        const team = await response.json() as { id: number; name: string };
        setOpen(false);
        setTeamName("");
        refetch();
        router.push(`/teams/${team.id}`);
      }
    } catch (error) {
      console.error("Failed to create team:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Teams</h1>
              <p className="text-sm text-muted-foreground">
                Collaborate with your team on canvases
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>
                    Start collaborating with your team members
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      placeholder="My Awesome Team"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isCreating) {
                          handleCreateTeam();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim() || isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Teams Grid */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : teams && teams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => router.push(`/teams/${team.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {team.name}
                      </CardTitle>
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/teams/${team.id}`);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Team
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <Users className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No teams yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create a team to start collaborating
              </p>
              <Button onClick={() => setOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Team
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

