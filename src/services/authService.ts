import { demoUser } from "@/data/orders";

const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock auth service. There is no real authentication in this prototype —
 * sign-in simply resolves so the account UI can be demonstrated.
 */
export const authService = {
  async signIn() {
    await delay();
    return { user: demoUser };
  },

  async register(name: string) {
    await delay();
    return { user: { ...demoUser, name } };
  },

  async signOut() {
    await delay(200);
    return { ok: true };
  },
};
