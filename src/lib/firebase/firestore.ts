import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Student, Classroom } from '@/lib/types';

const STUDENTS_COLLECTION = 'students';
const CLASSROOMS_COLLECTION = 'classrooms';

// Type for data being sent to Firestore (handles date conversion)
type StudentFirestoreData = Omit<Student, 'id' | 'enrollmentDate'> & {
    enrollmentDate: Timestamp;
};


// Function to fetch all students from Firestore
export const getStudents = async (): Promise<Student[]> => {
    try {
        const q = query(collection(db, STUDENTS_COLLECTION), orderBy("enrollmentDate", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                nis: data.nis,
                name: data.name,
                email: data.email,
                class: data.class,
                enrollmentDate: (data.enrollmentDate as Timestamp).toDate().toISOString().split('T')[0], // Convert Timestamp to YYYY-MM-DD string
                status: data.status,
            } as Student;
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
};

// Function to add a new student to Firestore
export const addStudent = async (studentData: Omit<Student, 'id' | 'enrollmentDate'>) => {
    try {
        const docData = {
            ...studentData,
            enrollmentDate: Timestamp.fromDate(new Date()),
        };
        const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), docData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to add student to database.");
    }
};

// Function to update an existing student in Firestore
export const updateStudent = async (studentId: string, studentData: Partial<Omit<Student, 'id'>>) => {
    try {
        const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
        await updateDoc(studentRef, studentData);
        console.log("Document updated with ID: ", studentId);
    } catch (error) {
        console.error("Error updating document: ", error);
        throw new Error("Failed to update student in database.");
    }
};


// Function to delete a student from Firestore
export const deleteStudent = async (studentId: string) => {
    try {
        await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
        console.log("Document deleted with ID: ", studentId);
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw new Error("Failed to delete student from database.");
    }
};

// Function to update only the status of a student
export const updateStudentStatus = async (studentId: string, newStatus: Student['status']) => {
    try {
        const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
        await updateDoc(studentRef, { status: newStatus });
        console.log(`Status updated for document with ID: ${studentId}`);
    } catch (error) {
        console.error("Error updating status: ", error);
        throw new Error("Failed to update student status in database.");
    }
};
