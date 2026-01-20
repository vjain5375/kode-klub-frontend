"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createQuiz, deleteQuiz, fetchAllHistory, fetchAllQuizzes, updateQuiz, toggleQuizStatus, fetchAllLeaderboardsAdmin, toggleLeaderboard, toggleOverallLeaderboard } from "@/lib/quiz/api";
import { useRouter } from "next/navigation";
import { IconPlus, IconTrash, IconLoader2, IconCheck, IconPencil, IconX, IconRefresh, IconEye, IconEyeOff, IconTrophy, IconChartBar, IconCode } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'history' | 'leaderboards' | 'dpps'>('create');
    const [loading, setLoading] = useState(false);

    // Create State
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([
        { id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);

    // Manage State
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [editingQuiz, setEditingQuiz] = useState<any | null>(null);

    // History State
    const [history, setHistory] = useState<any[]>([]);

    // Leaderboard State
    const [leaderboardData, setLeaderboardData] = useState<{ showOverallLeaderboard: boolean; quizLeaderboards: any[] }>({ showOverallLeaderboard: false, quizLeaderboards: [] });
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);

    // Paste Modal State
    const [showPasteModal, setShowPasteModal] = useState(false);
    const [pastedJson, setPastedJson] = useState("");

    // DPP State
    const [dpps, setDpps] = useState<any[]>([]);
    const [dppLoading, setDppLoading] = useState(false);
    const [showDppForm, setShowDppForm] = useState(false);
    const [editingDpp, setEditingDpp] = useState<any | null>(null);
    const [dppForm, setDppForm] = useState({
        title: '',
        difficulty: 'Easy',
        tags: [] as string[],
        description: '',
        leetcodeUrl: ''
    });

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }

        if (activeTab === 'manage') loadQuizzes();
        if (activeTab === 'history') loadHistory();
        if (activeTab === 'leaderboards') loadLeaderboards();
        if (activeTab === 'dpps') loadDpps();
    }, [activeTab, user, authLoading, router]);

    const loadQuizzes = async () => {
        try {
            const data = await fetchAllQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    const loadHistory = async () => {
        try {
            const data = await fetchAllHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const loadLeaderboards = async () => {
        setLeaderboardLoading(true);
        try {
            const data = await fetchAllLeaderboardsAdmin();
            setLeaderboardData(data);
        } catch (error) {
            console.error("Failed to load leaderboards", error);
        } finally {
            setLeaderboardLoading(false);
        }
    };

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const loadDpps = async () => {
        setDppLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/dpp/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setDpps(data.dpps || []);
        } catch (error) {
            console.error("Failed to load DPPs", error);
        } finally {
            setDppLoading(false);
        }
    };

    const handleDppSubmit = async () => {
        if (!dppForm.title || !dppForm.description || !dppForm.leetcodeUrl) {
            alert("Please fill all required fields, including LeetCode URL");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editingDpp
                ? `${API_BASE_URL}/api/dpp/${editingDpp._id}`
                : `${API_BASE_URL}/api/dpp/create`;

            const response = await fetch(url, {
                method: editingDpp ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dppForm)
            });

            if (!response.ok) throw new Error('Failed to save DPP');

            alert(editingDpp ? 'DPP updated!' : 'DPP created!');
            setShowDppForm(false);
            setEditingDpp(null);
            setDppForm({ title: '', difficulty: 'Easy', tags: [], description: '', leetcodeUrl: '' });
            loadDpps();
        } catch (error) {
            alert("Failed to save DPP");
        }
    };

    const handleDeleteDpp = async (id: string) => {
        if (!confirm("Delete this DPP?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/api/dpp/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDpps(dpps.filter(d => d._id !== id));
        } catch (error) {
            alert("Failed to delete DPP");
        }
    };

    const handleToggleDpp = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/dpp/${id}/toggle`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setDpps(dpps.map(d => d._id === id ? { ...d, isActive: data.isActive } : d));
        } catch (error) {
            alert("Failed to toggle DPP");
        }
    };

    const handleEditDpp = (dpp: any) => {
        setEditingDpp(dpp);
        setDppForm({
            title: dpp.title,
            difficulty: dpp.difficulty,
            tags: dpp.tags || [],
            description: dpp.description,
            leetcodeUrl: dpp.leetcodeUrl || ''
        });
        setShowDppForm(true);
    };

    const handleToggleQuizLeaderboard = async (quizId: string) => {
        try {
            const result = await toggleLeaderboard(quizId);
            setLeaderboardData(prev => ({
                ...prev,
                quizLeaderboards: prev.quizLeaderboards.map(q =>
                    q.quizId === quizId ? { ...q, showLeaderboard: result.showLeaderboard } : q
                )
            }));
        } catch (error) {
            alert("Failed to toggle leaderboard");
        }
    };

    const handleToggleOverallLeaderboard = async () => {
        try {
            const result = await toggleOverallLeaderboard();
            setLeaderboardData(prev => ({ ...prev, showOverallLeaderboard: result.showOverallLeaderboard }));
        } catch (error) {
            alert("Failed to toggle overall leaderboard");
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: questions.length + 1, question: "", options: ["", "", "", ""], correctAnswer: 0 }
        ]);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleEditQuiz = (quiz: any) => {
        setEditingQuiz(quiz);
        setTitle(quiz.title);
        // Ensure we extract questions correctly from the nested structure or direct structure
        const qs = quiz.quizData?.questions || quiz.questions || [];
        // Map to ensure all fields are present
        const mappedQs = qs.map((q: any, i: number) => ({
            id: q.id || i + 1,
            question: q.question || "",
            options: q.options || ["", "", "", ""],
            correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0
        }));

        setQuestions(mappedQs.length > 0 ? mappedQs : [{ id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
        setActiveTab('create');
    };

    const handleCreateSubmit = async () => {
        if (!title || questions.some(q => !q.question || q.options.some(o => !o))) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const quizPayload = {
                quizTitle: title,
                questions: questions.map(q => ({
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer, // Index
                    explanation: (q as any).explanation || null // Include explanation
                }))
            };

            if (editingQuiz) {
                await updateQuiz(editingQuiz._id, {
                    title: title,
                    quizData: quizPayload
                });
                alert("Quiz updated successfully!");
                setEditingQuiz(null);
            } else {
                await createQuiz(quizPayload);
                alert("Quiz published successfully!");
            }

            // Reset form
            setTitle("");
            setQuestions([{ id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0 }]);

            // If in edit mode, switch back to manage or stay? Let's stay in create but clear.
            if (editingQuiz) setActiveTab('manage');

        } catch (error) {
            console.error(error);
            alert("Failed to save quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        try {
            await deleteQuiz(id);
            setQuizzes(quizzes.filter(q => q._id !== id));
        } catch (error) {
            alert("Failed to delete quiz");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        console.log('Toggle clicked:', id, 'Current status:', currentStatus);
        try {
            const result = await toggleQuizStatus(id);
            console.log('Toggle result:', result);
            setQuizzes(quizzes.map(q => q._id === id ? { ...q, isActive: result.isActive } : q));
        } catch (error) {
            console.error('Toggle error:', error);
            alert("Failed to toggle quiz status: " + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const parseQuizJSON = (jsonString: string) => {
        try {
            const json = JSON.parse(jsonString);

            // Basic validation
            if (!json.title || !Array.isArray(json.questions)) {
                alert("Invalid JSON format. Must have 'title' and 'questions' array.");
                return null;
            }

            const mappedQuestions = json.questions.map((q: any, idx: number) => {
                let correctIdx = -1;

                // 1. Try to find the answer field using common names
                // Added 'correct_answer' and snake_case variants
                const ans = q.correctAnswer ?? q.answer ?? q.correct ?? q.ans ?? q.correctOption ?? q.solution ?? q.correct_answer ?? q.correct_option;

                if (ans !== undefined && ans !== null) {
                    // Start matching logic
                    if (typeof ans === 'number') {
                        // Assumption: If > 3 (for 4 options), might be 1-based? 
                        // But usually 0-based. keeping as is.
                        correctIdx = ans;
                    } else if (typeof ans === 'string') {
                        const cleanAns = ans.trim();
                        const lowerAns = cleanAns.toLowerCase();

                        // Map "Option A", "A)", "A.", "(A)", "[A]" -> "a"
                        // Regex explanation:
                        // ^(?: ... )?  : Optional prefix (Option, Answer, or opening bracket)
                        // \s*          : Optional whitespace
                        // ([a-d])      : The letter A-D (captured)
                        // \s*          : Optional whitespace
                        // (?: ... )?   : Optional suffix (closing bracket, dot, or nothing)
                        // $            : End of string
                        const letterMatch = lowerAns.match(/^(?:option|answer|ans)?[\s\(\[]*([a-d])[\s\)\].]*$/);

                        if (letterMatch) {
                            const letterMap: Record<string, number> = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
                            correctIdx = letterMap[letterMatch[1]];
                        }
                        // Case: Number string "0", "1"
                        else if (!isNaN(parseInt(cleanAns))) {
                            correctIdx = parseInt(cleanAns);
                        }
                        // Case: Text match
                        else {
                            // Try exact match
                            let optIdx = q.options.findIndex((opt: string) => opt === cleanAns);

                            // Try loose match (ignore case/whitespace/punctuation)
                            if (optIdx === -1) {
                                optIdx = q.options.findIndex((opt: string) =>
                                    opt.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") ===
                                    cleanAns.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
                                );
                            }

                            if (optIdx !== -1) correctIdx = optIdx;
                        }
                    }
                }

                return {
                    id: idx + 1,
                    question: q.question,
                    options: q.options,
                    correctAnswer: correctIdx,
                    explanation: q.explanation || null // Preserve explanation
                };
            });

            return { title: json.title, questions: mappedQuestions };
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = parseQuizJSON(e.target?.result as string);
            if (result) {
                setTitle(result.title);
                setQuestions(result.questions);
                alert("Quiz imported successfully!");
            } else {
                alert("Failed to parse JSON file");
            }
        };
        reader.readAsText(file);
    };

    const handlePasteLoad = () => {
        const result = parseQuizJSON(pastedJson);
        if (result) {
            setTitle(result.title);
            setQuestions(result.questions);
            setShowPasteModal(false);
            setPastedJson("");
            alert("Quiz loaded from text! Review and publish.");
        } else {
            alert("Invalid JSON syntax or format.");
        }
    };

    if (authLoading) return null;

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Access Denied
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-neutral-400 mb-8">Manage quizzes and view student progress</p>

            <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                {['create', 'manage', 'history', 'leaderboards', 'dpps'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 font-medium capitalize transition-colors relative ${activeTab === tab ? "text-blue-400" : "text-neutral-400 hover:text-white"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="bubble" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* CREATE TAB */}
            {activeTab === 'create' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowPasteModal(true)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-neutral-700"
                        >
                            <IconPlus className="w-4 h-4" /> Paste JSON
                        </button>
                        <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-neutral-700">
                            <IconPlus className="w-4 h-4" /> Import JSON
                            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>

                    {editingQuiz && (
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex items-center justify-between">
                            <span className="text-blue-400">Editing Quiz: <strong>{editingQuiz.title}</strong></span>
                            <button
                                onClick={() => { setEditingQuiz(null); setTitle(""); setQuestions([{ id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0 }]); }}
                                className="text-sm text-neutral-400 hover:text-white"
                            >
                                Cancel Edit
                            </button>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Quiz Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-neutral-500 text-lg outline-none focus:border-blue-500"
                    />

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                            >
                                <IconTrash className="w-5 h-5" />
                            </button>

                            <div className="mb-4">
                                <label className="text-sm text-neutral-400 mb-2 block">Question {qIndex + 1}</label>
                                <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                                    placeholder="Enter question text"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            className={`w-full bg-black/20 border rounded-lg p-3 text-white outline-none focus:border-blue-500 ${q.correctAnswer === oIndex ? 'border-green-500' : 'border-white/10'}`}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                        <button
                                            onClick={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                                            className={`p-3 rounded-lg border ${q.correctAnswer === oIndex ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-white/10 text-neutral-500 hover:text-white'}`}
                                        >
                                            <IconCheck className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addQuestion}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-neutral-400 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <IconPlus className="w-5 h-5" /> Add Question
                    </button>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleCreateSubmit}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {loading ? <IconLoader2 className="w-5 h-5 animate-spin" /> : (editingQuiz ? "Update Quiz" : "Publish Quiz")}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Paste JSON Modal */}
            {showPasteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Paste JSON Code</h2>
                        <textarea
                            value={pastedJson}
                            onChange={(e) => setPastedJson(e.target.value)}
                            className="w-full h-64 bg-black/40 border border-white/10 rounded-lg p-4 text-white font-mono text-sm outline-none focus:border-blue-500 resize-none transition-colors"
                            placeholder='{ "title": "...", "questions": [...] }'
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowPasteModal(false)}
                                className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasteLoad}
                                disabled={!pastedJson}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Load Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MANAGE TAB */}
            {activeTab === 'manage' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <button onClick={loadQuizzes} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <IconRefresh className="w-4 h-4" /> Refresh
                        </button>
                    </div>
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium flex items-center gap-2">
                                    {quiz.title}
                                    {!quiz.isActive && <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Inactive</span>}
                                    {quiz.isActive && <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">Active</span>}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    {quiz.questionCount || '?'} Questions • Created {new Date(quiz.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 h-full">
                                <button
                                    onClick={() => handleToggleStatus(quiz._id, quiz.isActive)}
                                    className={`p-2 rounded-lg transition-colors ${quiz.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-neutral-500 hover:text-white hover:bg-white/10'}`}
                                    title={quiz.isActive ? "Deactivate Quiz" : "Activate Quiz"}
                                >
                                    {quiz.isActive ? <IconEye className="w-5 h-5" /> : <IconEyeOff className="w-5 h-5" />}
                                </button>
                                <button onClick={() => handleEditQuiz(quiz)} className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                    <IconPencil className="w-5 h-5" />
                                </button>

                                <div className="w-px h-4 bg-white/10 mx-1"></div>

                                <button
                                    onClick={() => handleDeleteQuiz(quiz._id)}
                                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Quiz Permanently"
                                >
                                    <IconTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {quizzes.length === 0 && <p className="text-neutral-500 text-center py-8">No quizzes found.</p>}
                </motion.div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-xl border border-white/10">
                    <div className="flex justify-end p-4 bg-white/5 border-b border-white/10">
                        <button onClick={loadHistory} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <IconRefresh className="w-4 h-4" /> Refresh
                        </button>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-neutral-400 text-sm">
                                <th className="p-4 font-medium border-b border-white/10">Student</th>
                                <th className="p-4 font-medium border-b border-white/10">Quiz</th>
                                <th className="p-4 font-medium border-b border-white/10">Score</th>
                                <th className="p-4 font-medium border-b border-white/10 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.map((attempt) => (
                                <tr key={attempt._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="text-white font-medium">{attempt.studentName}</div>
                                        <div className="text-xs text-neutral-500">{attempt.studentId || attempt.userId?.email || 'Guest'}</div>
                                    </td>
                                    <td className="p-4 text-neutral-300">
                                        {attempt.quizId?.title || attempt.quizId?.quizData?.quizTitle || 'Deleted Quiz'}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-sm font-bold border border-green-500/20">
                                            {attempt.score} pts
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-neutral-500 text-sm">
                                        {new Date(attempt.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {history.length === 0 && <p className="text-neutral-500 text-center py-8">No attempts recorded yet.</p>}
                </motion.div>
            )}

            {/* LEADERBOARDS TAB */}
            {activeTab === 'leaderboards' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <IconTrophy className="w-6 h-6 text-yellow-400" />
                            Leaderboard Management
                        </h2>
                        <button
                            onClick={loadLeaderboards}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors"
                        >
                            <IconRefresh className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>

                    {leaderboardLoading ? (
                        <div className="text-center py-12 text-neutral-400">
                            <IconLoader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            Loading leaderboards...
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Overall Leaderboard Toggle */}
                            <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                            <IconChartBar className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Overall Leaderboard</h3>
                                            <p className="text-neutral-400 text-sm">
                                                Aggregated rankings across all quizzes (by average score)
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleToggleOverallLeaderboard}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${leaderboardData.showOverallLeaderboard
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                            }`}
                                    >
                                        {leaderboardData.showOverallLeaderboard ? (
                                            <><IconEye className="w-4 h-4" /> Published</>
                                        ) : (
                                            <><IconEyeOff className="w-4 h-4" /> Hidden</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Quiz-wise Leaderboards */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Quiz-wise Leaderboards</h3>
                                {leaderboardData.quizLeaderboards.length === 0 ? (
                                    <p className="text-neutral-500 text-center py-8">No quizzes created yet.</p>
                                ) : (
                                    <div className="grid gap-4">
                                        {leaderboardData.quizLeaderboards.map((quiz) => (
                                            <div
                                                key={quiz.quizId}
                                                className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-medium text-white">{quiz.title}</h4>
                                                        <p className="text-sm text-neutral-500">
                                                            {quiz.attemptCount} attempt{quiz.attemptCount !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleToggleQuizLeaderboard(quiz.quizId)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${quiz.showLeaderboard
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                                            }`}
                                                    >
                                                        {quiz.showLeaderboard ? (
                                                            <><IconEye className="w-3 h-3" /> Visible</>
                                                        ) : (
                                                            <><IconEyeOff className="w-3 h-3" /> Hidden</>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Top 3 Preview */}
                                                {quiz.topAttempts.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-neutral-800">
                                                        <p className="text-xs text-neutral-500 mb-2">Top 3:</p>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {quiz.topAttempts.slice(0, 3).map((attempt: any, idx: number) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`text-xs px-2 py-1 rounded ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                                        idx === 1 ? 'bg-neutral-500/20 text-neutral-300' :
                                                                            'bg-orange-500/20 text-orange-400'
                                                                        }`}
                                                                >
                                                                    {idx + 1}. {attempt.studentName} ({attempt.score}pts)
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* DPPS TAB */}
            {activeTab === 'dpps' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <IconCode className="w-6 h-6 text-green-400" />
                            Daily Practice Problems
                        </h2>
                        <button
                            onClick={() => { setShowDppForm(true); setEditingDpp(null); setDppForm({ title: '', difficulty: 'Easy', tags: [], description: '', leetcodeUrl: '' }); }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
                        >
                            <IconPlus className="w-4 h-4" />
                            Add DPP
                        </button>
                    </div>

                    {/* DPP Form Modal */}
                    {showDppForm && (
                        <div className="p-6 rounded-xl bg-neutral-900/80 border border-neutral-800 mb-6">
                            <h3 className="text-lg font-bold text-white mb-4">{editingDpp ? 'Edit DPP' : 'Create New DPP'}</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Problem Title"
                                    value={dppForm.title}
                                    onChange={(e) => setDppForm({ ...dppForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                                />
                                <div className="flex gap-4">
                                    <select
                                        value={dppForm.difficulty}
                                        onChange={(e) => setDppForm({ ...dppForm, difficulty: e.target.value })}
                                        className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="LeetCode URL (required)"
                                        value={dppForm.leetcodeUrl}
                                        onChange={(e) => setDppForm({ ...dppForm, leetcodeUrl: e.target.value })}
                                        className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
                                    />
                                </div>
                                <textarea
                                    placeholder="Problem Description (Markdown supported)"
                                    value={dppForm.description}
                                    onChange={(e) => setDppForm({ ...dppForm, description: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white font-mono text-sm"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDppSubmit}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
                                    >
                                        {editingDpp ? 'Update' : 'Create'} DPP
                                    </button>
                                    <button
                                        onClick={() => { setShowDppForm(false); setEditingDpp(null); }}
                                        className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DPP List */}
                    {dppLoading ? (
                        <div className="text-center py-12 text-neutral-400">
                            <IconLoader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            Loading DPPs...
                        </div>
                    ) : dpps.length === 0 ? (
                        <p className="text-neutral-500 text-center py-8">No DPPs created yet. Click "Add DPP" to create one.</p>
                    ) : (
                        <div className="space-y-3">
                            {dpps.map((dpp) => (
                                <div
                                    key={dpp._id}
                                    className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${dpp.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                dpp.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {dpp.difficulty}
                                            </span>
                                            <div>
                                                <h4 className="font-medium text-white">{dpp.title}</h4>
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(dpp.publishDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleDpp(dpp._id)}
                                                className={`p-2 rounded-lg transition-colors ${dpp.isActive
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-neutral-700 text-neutral-400'
                                                    }`}
                                                title={dpp.isActive ? 'Published' : 'Hidden'}
                                            >
                                                {dpp.isActive ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleEditDpp(dpp)}
                                                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                            >
                                                <IconPencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDpp(dpp._id)}
                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                            >
                                                <IconTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
