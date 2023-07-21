import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import HomePage from '../app/page';

vi.mock("@clerk/nextjs", () => {
  return {
    auth: () => new Promise(
      (resolve) => resolve({userId: "kljaskjflks"})
    ),
    ClerkProvider: ({ children }) => <div>{ children }</div>,
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: "kljaskjflks",
        fullName: "Fake User",
      },
    }),
  }
});

vi.mock('next/font/google', () => {
  return {
    Inter: () => ({ className: 'inter' }),
  }
});

test("Home", async () => {
  render( await HomePage() );
  expect( screen.getByText("get started") ).toBeTruthy();
});