

"use client"

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, FileText, CheckCircle, Search, ChevronDown, Download, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, Expand, Menu } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';
import { courseDataMap, mockCourses, fallbackCourseData } from '@/lib/mock-data';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


type CourseItem = typeof fallbackCourseData.sessions[0]['items'][0];

// Helper to get course name from slug
const getCourseNameFromSlug = (slug: string) => {
    const course = mockCourses.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === slug);
    return course ? course.name : "Mata Pelajaran Tidak Ditemukan";
};

const CourseSidebarContent = ({ courseData, overallProgress, searchTerm, setSearchTerm, selectedItem, onSelectAndComplete, isMobile }: {
    courseData: any,
    overallProgress: number,
    searchTerm: string,
    setSearchTerm: (term: string) => void,
    selectedItem: CourseItem | null,
    onSelectAndComplete: (item: CourseItem) => void,
    isMobile: boolean | undefined
}) => {

    const filteredSessions = useMemo(() => {
        if (!searchTerm) {
            return courseData.sessions;
        }
        return courseData.sessions.map((session: any) => {
            const filteredItems = session.items.filter((item: any) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return { ...session, items: filteredItems };
        }).filter((session: any) => session.items.length > 0);
    }, [courseData.sessions, searchTerm]);
    
    return (
        <div className="flex flex-col h-full bg-card">
            <div className="p-4 border-b">
                <Button variant="ghost" asChild className="mb-4 text-primary hover:text-primary">
                    <Link href="/dashboard/student/subjects">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Kembali ke Mata Pelajaran
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">{courseData.title}</h1>
                <div className="mt-2">
                    <Progress value={overallProgress} />
                    <span className="text-sm text-muted-foreground mt-1 block">{Math.round(overallProgress)}% selesai</span>
                </div>
            </div>

            <div className="p-4 border-b">
                 <div className="relative">
                    <Input 
                        placeholder="Cari..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <Accordion type="single" collapsible defaultValue="session-0" className="w-full">
                    {filteredSessions.map((session: any, sessionIndex: number) => {
                         const completedInSession = session.items.filter((i: any) => i.completed).length;
                         const totalInSession = session.items.length;
                         const isSessionComplete = completedInSession === totalInSession && totalInSession > 0;
                        return (
                            <AccordionItem value={`session-${sessionIndex}`} key={session.title}>
                                <AccordionTrigger className="p-4 hover:no-underline">
                                    <div className="flex items-center gap-3 text-left">
                                        <CheckCircle className={cn("h-6 w-6 transition-colors flex-shrink-0", isSessionComplete ? "text-primary" : "text-muted-foreground/20")} />
                                        <span className="font-bold text-base">{session.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <span className="text-sm text-muted-foreground">{completedInSession}/{totalInSession}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-6">
                                    <ul className="relative space-y-1">
                                         {/* Vertical line */}
                                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
                                        {session.items.map((item: any) => {
                                            const ItemLink = ({ children }: { children: React.ReactNode }) => isMobile ? (
                                                <SheetClose asChild>{children}</SheetClose>
                                            ) : (
                                                <>{children}</>
                                            );
                                            
                                            return (
                                                <li key={item.id} className="cursor-pointer">
                                                    <ItemLink>
                                                        <div onClick={() => onSelectAndComplete(item)} className={cn("flex items-start gap-3 p-2 rounded-md relative", selectedItem?.id === item.id ? "bg-muted font-semibold" : "hover:bg-muted/50")}>
                                                            <div className="z-10 bg-background">
                                                                <CheckCircle className={cn("h-6 w-6 transition-colors", item.completed ? "text-primary" : "text-muted-foreground/20")} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm leading-tight">{item.title}</p>
                                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                                                    <FileText className="h-3.5 w-3.5" />
                                                                    <span>{item.type}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ItemLink>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>
        </div>
    )
}

export default function SubjectDetailPage() {
    const params = useParams();
    const subjectId = params.subjectId as string;
    const isMobile = useIsMobile();
    
    const [courseData, setCourseData] = useState({ ...fallbackCourseData, title: "" });
    const [isLoading, setIsLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState<CourseItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const savedProgress = localStorage.getItem(`course-progress-${subjectId}`);
        const baseCourseData = courseDataMap[subjectId] || { ...fallbackCourseData, title: getCourseNameFromSlug(subjectId) };
        
        let initialData;
        if (savedProgress) {
            initialData = JSON.parse(savedProgress);
        } else {
            initialData = baseCourseData;
        }

        setCourseData(initialData);
        
        if (initialData.sessions[0]?.items[0]) {
            setSelectedItem(initialData.sessions[0].items[0]);
        }
        setIsLoading(false);

    }, [subjectId]);


    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(`course-progress-${subjectId}`, JSON.stringify(courseData));
        }
    }, [courseData, subjectId, isLoading]);


    const allItems = courseData.sessions.flatMap(s => s.items);
    const completedItemsCount = allItems.filter(item => item.completed).length;
    const totalItemsCount = allItems.length;
    const overallProgress = totalItemsCount > 0 ? (completedItemsCount / totalItemsCount) * 100 : 0;

    const handleCompletion = (itemId: string, isCompleted: boolean) => {
        setCourseData(prevData => {
            const newSessions = prevData.sessions.map(session => ({
                ...session,
                items: session.items.map(item => 
                    item.id === itemId ? { ...item, completed: isCompleted } : item
                ),
            }));
            return { ...prevData, sessions: newSessions };
        });
    };
    
    const selectAndComplete = (item: CourseItem) => {
        setSelectedItem(item);
        if (!item.completed) {
            handleCompletion(item.id, true);
        }
    };

    const handleNext = () => {
        if (!selectedItem) return;
        const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
        if (currentIndex < allItems.length - 1) {
            const nextItem = allItems[currentIndex + 1];
            selectAndComplete(nextItem);
        }
    };
    
    const handlePrevious = () => {
        if (!selectedItem) return;
        const currentIndex = allItems.findIndex(item => item.id === selectedItem.id);
        if (currentIndex > 0) {
            const prevItem = allItems[currentIndex - 1];
            setSelectedItem(prevItem);
        }
    };

    const toggleCurrentItemCompletion = () => {
        if (selectedItem) {
            handleCompletion(selectedItem.id, !selectedItem.completed);
        }
    };

    const currentItemIndex = selectedItem ? allItems.findIndex(item => item.id === selectedItem.id) : -1;

    if (isLoading) {
        return <div className="flex h-full bg-background"><div className="w-96 flex-shrink-0 border-r flex flex-col"/><div className="flex-1 flex flex-col"/></div>;
    }

    const sidebarProps = {
        courseData,
        overallProgress,
        searchTerm,
        setSearchTerm,
        selectedItem,
        onSelectAndComplete: selectAndComplete,
        isMobile
    };


    return (
        <div className="flex h-full bg-background">
            {/* Sidebar for Desktop */}
            {!isMobile && (
                <aside className="w-96 flex-shrink-0 border-r flex flex-col">
                    <CourseSidebarContent {...sidebarProps} />
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {isMobile && (
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 p-0">
                                        <CourseSidebarContent {...sidebarProps} />
                                    </SheetContent>
                                </Sheet>
                            )}
                            <h2 className="text-lg font-semibold truncate ml-2 md:ml-0">{selectedItem?.title || ''}</h2>
                            <div className="hidden md:flex items-center gap-2">
                                <Button variant="ghost" size="icon"><ZoomIn className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon"><ZoomOut className="h-5 w-5" /></Button>
                                <Button variant="ghost" size="icon"><Download className="h-5 w-5" /></Button>
                                <Separator orientation="vertical" className="h-6 mx-2" />
                                <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={currentItemIndex <= 0}><ArrowLeft className="h-5 w-5" /></Button>
                                <span>{currentItemIndex + 1} dari {totalItemsCount}</span>
                                <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentItemIndex >= totalItemsCount - 1}><ArrowRight className="h-5 w-5" /></Button>
                                <Separator orientation="vertical" className="h-6 mx-2" />
                                <Button variant="ghost" size="icon"><Expand className="h-5 w-5" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 bg-muted/20">
                     {selectedItem ? (
                        <>
                            <Card>
                                <CardContent className="p-0 aspect-video overflow-hidden rounded-lg">
                                   {selectedItem.contentType === 'iframe' && selectedItem.href ? (
                                        <iframe src={selectedItem.href} className="w-full h-full border-0" allowFullScreen></iframe>
                                    ) : selectedItem.contentType === 'component' ? (
                                        <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                                            <div className="text-center p-4">
                                                <h3 className="text-2xl font-bold">Catat Kehadiran Anda</h3>
                                                <p className="text-muted-foreground mb-4">Klik tombol di bawah untuk mencatat kehadiran Anda di sesi ini.</p>
                                                <Button size="lg" onClick={() => selectAndComplete(selectedItem)}>Hadir</Button>
                                            </div>
                                        </div>
                                   ) : (
                                        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                                            <p className="text-white">Tipe konten tidak didukung.</p>
                                        </div>
                                   )}
                                </CardContent>
                            </Card>
                            <div className="p-4 mt-4 border-t bg-card flex justify-end items-center gap-2 rounded-lg">
                                <Button variant="outline" onClick={toggleCurrentItemCompletion}>
                                    {selectedItem.completed ? "TANDAI BELUM SELESAI" : "TANDAI SELESAI"}
                                </Button>
                                <Button onClick={handleNext} disabled={currentItemIndex >= totalItemsCount - 1}>
                                    LANJUTKAN <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                           <div className="text-center">
                                <p className="text-muted-foreground">Pilih item dari menu untuk memulai.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

