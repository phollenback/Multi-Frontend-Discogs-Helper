import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";  // Use session logic, but no direct `next/headers`
import { redirect } from "next/navigation";
import axios from "axios"; // Use axios for making the API request to the server

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: unknown, formData: FormData) {
  console.log("Starting login process...");
  console.log("Received form data:", Object.fromEntries(formData));

  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.log("Validation errors:", result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;
  console.log("Validation passed. Sending login request...");

  try {
    // Make the login request to the server
    const response = await axios.post("http://localhost:3000/api/users/auth", { email, password });

    if (response.data.error) {
      console.log("Invalid email or password:", response.data.error);
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    console.log("User authenticated successfully. Creating session...");
    await createSession(response.data.user.id); // Only server-side logic here

    console.log("Session created. Redirecting to /search...");
    redirect("/search");

  } catch (error) {
    console.error("Error during login:", error);
    return {
      errors: {
        email: ["Something went wrong, please try again later"],
      },
    };
  }
}

export async function logout() {
  console.log("Starting logout process...");
  await deleteSession();
  console.log("Session deleted. Redirecting to /login...");
  redirect("/login");
}