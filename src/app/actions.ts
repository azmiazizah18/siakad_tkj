
'use server';

import { users } from '@/lib/users';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['student', 'lecturer', 'admin']),
});

const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['student', 'lecturer', 'admin'], { required_error: "You must select a role." }),
  className: z.string().optional(),
});

export async function authenticate(formData: unknown) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    throw new Error('Invalid email or password format.');
  }

  const { email, password, role } = validatedFields.data;
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials. Please try again.');
  }

  if (user.role !== role) {
    throw new Error(`Login Gagal. Peran yang Anda pilih tidak sesuai dengan data akun Anda`);
  }

  // This is a simple simulation. In a real app, use secure session management.
  // We are passing the email to the redirect URL to simulate user-specific context.
  const params = new URLSearchParams({ user: user.email });

  let redirectUrl = '/';
  switch (user.role) {
    case 'admin':
      redirectUrl = `/dashboard/admin?${params.toString()}`;
      break;
    case 'lecturer':
      redirectUrl = `/dashboard/lecturer?${params.toString()}`;
      break;
    case 'student':
      redirectUrl = `/dashboard/student?${params.toString()}`;
      break;
  }

  redirect(redirectUrl);
}


export async function registerUser(formData: unknown) {
  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors).join(' ');
    throw new Error(errorMessages || 'Invalid registration data.');
  }

  const { name, email, password, role, className } = validatedFields.data;

  // In a real application, you would check if the user already exists in a database.
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // This is where you would save the new user to your database.
  // For this prototype, we'll just log it. The new user is NOT persisted.
  // Therefore, you cannot log in with this newly created user.
  console.log('New user registered (simulation):', { name, email, role, className });
  
  redirect('/login');
}

export async function handleGoogleSignInSuccess(role: 'student' | 'lecturer' | 'admin', user: { uid: string, email: string | null, displayName: string | null }, className?: string) {
    const { firestore } = initializeFirebase();
    
    // This logic now correctly runs on the server after client-side sign-in
    const userRef = doc(firestore, `${role}s`, user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        const newUserProfile: any = {
            id: user.uid,
            email: user.email,
            fullName: user.displayName,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        };

        if (role === 'student') {
            newUserProfile.dateOfBirth = '2000-01-01'; // Placeholder
            newUserProfile.enrollmentDate = new Date().toISOString().split('T')[0];
            newUserProfile.class = className || 'Not Assigned';
        } else if (role === 'lecturer') {
            newUserProfile.hireDate = new Date().toISOString().split('T')[0];
        }
        
        await setDoc(userRef, newUserProfile);
    } else {
        // Update last login time for existing user
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }

    // Redirect based on role
    const params = new URLSearchParams({ user: user.email! });
    let redirectUrl = '/';
    switch (role) {
        case 'admin':
            redirectUrl = `/dashboard/admin?${params.toString()}`;
            break;
        case 'lecturer':
            redirectUrl = `/dashboard/lecturer?${params.toString()}`;
            break;
        case 'student':
            redirectUrl = `/dashboard/student?${params.toString()}`;
            break;
    }
    
    redirect(redirectUrl);
}
    