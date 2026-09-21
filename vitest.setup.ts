import "@testing-library/jest-dom";
import { vi } from "vitest";

// Extend expect with jest-dom matchers when using globals
// (Vitest already wires expect; this import patches it.)

// Mock next/font/google so layout tests can import font without errors.
vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins" }),
}));

// Mock Firebase Auth so tests don't hit real Firebase or require valid keys.
vi.mock("firebase/auth", () => {
  const authMock = {} as unknown;

  return {
    getAuth: vi.fn(() => authMock),

    onAuthStateChanged: vi.fn((_auth, callback: (user: unknown) => void) => {
      callback(null);
      return () => {};
    }),

    signInWithEmailAndPassword: vi.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve()),

    EmailAuthProvider: {
      credential: vi.fn(() => ({})),
    },
    reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
    deleteUser: vi.fn(() => Promise.resolve()),
    updateEmail: vi.fn(() => Promise.resolve()),
    signOut: vi.fn(() => Promise.resolve()),
  };
});

// Mock Next.js app router hooks used by client components in tests.
vi.mock("next/navigation", () => {
  const push = vi.fn();
  const replace = vi.fn();
  const back = vi.fn();
  const forward = vi.fn();
  const refresh = vi.fn();

  return {
    useRouter: () => ({ push, replace, back, forward, refresh }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
  };
});
