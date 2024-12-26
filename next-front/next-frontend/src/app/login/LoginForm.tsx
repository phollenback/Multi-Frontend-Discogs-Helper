"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Login
        </h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
          />
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-500">{state.errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={`w-full rounded-md bg-blue-500 p-2 text-white transition hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300`}
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}