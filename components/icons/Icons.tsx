
import React from 'react';

export const WorldviewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);
export const NpcIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);
export const MonsterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"></path><path d="M10 5.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"></path><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2Z"></path><path d="M6.5 17.5c0-2.5 5.5-2.5 5.5 0"></path>
    </svg>
);
export const ArmouryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 3.5c.3-.3.8-.3 1.1 0l6 6c.3.3.3.8 0 1.1l-9 9c-.3.3-.8.3-1.1 0l-6-6c-.3-.3-.3-.8 0-1.1l9-9Z"></path><path d="m11.5 6.5-5 5"></path><path d="m17.5 12.5-5 5"></path><path d="m5.5 17.5 5-5"></path>
    </svg>
);
export const CanvasIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.668 0-.92-.722-1.667-1.648-1.667-.926 0-1.648-.746-1.648-1.668 0-.92-.722-1.667-1.648-1.667-1.39 0-2.5-1.11-2.5-2.5 0-1.39 1.11-2.5 2.5-2.5s2.5 1.11 2.5 2.5c0 .92.722 1.668 1.648 1.668.926 0 1.648.746 1.648 1.667 0 .922.722 1.667 1.648 1.667C17.5 22 22 17.5 22 12c0-5.5-4.5-10-10-10zm0 6c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"></path>
    </svg>
);
