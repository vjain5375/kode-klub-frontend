"use client";

import { useEffect, useState } from 'react';
import { fetchPublicAnnouncements, type Announcement } from '@/lib/admin/api';
import { IconSpeakerphone, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementBanner() {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPublicAnnouncements();
                if (data && data.length > 0) {
                    setAnnouncement(data[0]); // Show latest
                }
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    if (!announcement || !visible) return null;

    const colors = {
        info: 'bg-blue-600',
        warning: 'bg-amber-600',
        success: 'bg-green-600',
        alert: 'bg-red-600'
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`${colors[announcement.type]} text-white relative z-50`}
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between text-sm font-medium">
                    <div className="flex items-center gap-3">
                        <IconSpeakerphone className="w-4 h-4" />
                        <span>{announcement.message}</span>
                    </div>
                    <button onClick={() => setVisible(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                        <IconX className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
