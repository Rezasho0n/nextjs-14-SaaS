import { NextResponse } from "next/server";
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import config from '@/aws-exports';
import { AuthError } from '@aws-amplify/auth';

Amplify.configure(config, { ssr: true });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const { isSignUpComplete, userId } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          name,
          email,
        },
      },
    });

    return NextResponse.json({ 
      message: isSignUpComplete ? "User registered successfully" : "Further action required",
      userId 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error during registration:', error);
    
    if (error instanceof AuthError) {
      if (error.name === 'UsernameExistsException') {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }
      // Handle other specific AuthError types if needed
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // For any other types of errors
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}