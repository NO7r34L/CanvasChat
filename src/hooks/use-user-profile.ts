import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Example hook using TanStack Query for user profile data
 * This demonstrates the pattern for creating data-fetching hooks
 */

interface UserProfile {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  createdAt: string;
}

interface UpdateProfileData {
  displayName?: string;
}

/**
 * Fetch user profile data
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch("/api/user/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<{ success: boolean }> => {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user profile after successful update
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}

