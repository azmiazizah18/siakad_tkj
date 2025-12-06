
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { mockCourses, courseDataMap, mockClassrooms, users } from "@/lib/mock-data";
import Link from "next/link";
import type { Course, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to get user from localStorage.
function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userEmail = localStorage.getItem('loggedInUser');
  if (!userEmail) return null;
  return users.find(u => u.email === userEmail) || null;
}

// Helper function to calculate progress from course data
const calculateProgress = (courseData: typeof courseDataMap[string]): number => {
    if (!courseData || !courseData.sessions) return 0;
    const allItems = courseData.sessions.flatMap(s => s.items);
    const completedItemsCount = allItems.filter(item => item.completed).length;
    const totalItemsCount = allItems.length;
    return totalItemsCount > 0 ? (completedItemsCount / totalItemsCount) * 100 : 0;
};

// Represents a map from courseId to its detailed data including progress
type CourseProgressData = {
    [courseId: string]: typeof courseDataMap[string];
};

export default function SubjectsPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [courseProgress, setCourseProgress] = useState<CourseProgressData>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        setIsLoading(false); // Stop loading initially

        if (!user) {
            setUserCourses(mockCourses); // Default to all courses if no user
        } else {
            // Determine courses based on role
            let relevantCourses: Course[];
            if (user.role === 'lecturer') {
                const lecturerClasses = mockClassrooms.filter(c => c.lecturerName === user.name);
                const lecturerCourseNames = lecturerClasses.map(c => c.courseName);
                relevantCourses = mockCourses.filter(course => lecturerCourseNames.includes(course.name));
            } else { // 'student' or other roles default to all courses
                relevantCourses = mockCourses;
            }
            setUserCourses(relevantCourses);
        }

        // Always calculate progress for all mock courses for simplicity on client
        const progressData: CourseProgressData = {};
        mockCourses.forEach(course => {
            const courseIdSlug = course.name.toLowerCase().replace(/\s+/g, '-');
            if (typeof window !== 'undefined') {
                const savedProgress = localStorage.getItem(`course-progress-${courseIdSlug}`);
                progressData[course.id] = savedProgress ? JSON.parse(savedProgress) : courseDataMap[courseIdSlug];
            } else {
                 progressData[course.id] = courseDataMap[courseIdSlug];
            }
        });
        
        setCourseProgress(progressData);

    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <PageHeader
                    title="Mata Pelajaran"
                    description="Memuat data mata pelajaran..."
                />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({length: 3}).map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                            <CardContent><Skeleton className="h-4 w-full" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-24 ml-auto" /></CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!currentUser) {
         // This case handles when the user is not logged in, but we still want to show content for students by default
        return (
             <div className="container mx-auto p-4 md:p-6">
                <PageHeader
                    title="Mata Pelajaran"
                    description="Semangat Belajar!"
                />
                <CourseList courses={mockCourses} courseProgress={courseProgress} role="student" />
            </div>
        );
    }
    
    const pageTitle = currentUser.role === 'lecturer' ? "Manajemen Mata Pelajaran" : "Mata Pelajaran";
    const pageDescription = currentUser.role === 'lecturer' ? "Kelola kelas dan materi yang Anda ajar." : "Semangat Belajar!";

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      />
      <CourseList courses={userCourses} courseProgress={courseProgress} role={currentUser.role} />
    </div>
  );
}


interface CourseListProps {
    courses: Course[];
    courseProgress: CourseProgressData;
    role: 'student' | 'lecturer' | 'admin';
}

function CourseList({ courses, courseProgress, role }: CourseListProps) {
    if (courses.length === 0) {
        return (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>Tidak ada mata pelajaran yang ditugaskan untuk Anda saat ini.</p>
            </div>
        );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
            const courseIdSlug = course.name.toLowerCase().replace(/\s+/g, '-');
            const progressValue = courseProgress[course.id] ? calculateProgress(courseProgress[course.id]) : 0;
            const progressDisplay = Math.round(progressValue);
            const classroom = mockClassrooms.find(c => c.courseName === course.name);
            const lecturerName = classroom ? classroom.lecturerName : "N/A";

            return (
                <Card key={course.id} className="flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="p-6">
                        <CardTitle className="text-lg font-bold leading-snug">
                            <Link href={`/dashboard/student/subjects/${courseIdSlug}`} className="hover:text-primary transition-colors">
                                {course.name}
                            </Link>
                        </CardTitle>
                        <CardDescription>{lecturerName}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow">
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-muted-foreground">{progressDisplay}% selesai</span>
                        </div>
                        <Progress value={progressValue} aria-label={`${course.name} progress`} />
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-4 flex justify-end items-center">
                        <Button asChild>
                            <Link href={`/dashboard/student/subjects/${courseIdSlug}`}>
                                {role === 'lecturer' ? 'Kelola Materi' : 'Lanjut Belajar'}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            );
            })
        }
      </div>
    );
}

