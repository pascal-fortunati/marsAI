import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-50"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.39 0l.707.707a1 1 0 01-1.39 1.39L15.22 5.15a1 1 0 010-1.39zm2.83 2.83a1 1 0 011.39 0l.707.707a1 1 0 01-1.39 1.39l-.707-.707a1 1 0 010-1.39zm0 5.66a1 1 0 010 1.39l-.707.707a1 1 0 01-1.39-1.39l.707-.707a1 1 0 011.39 0zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-4.22-1.78a1 1 0 011.39 0l.707.707a1 1 0 01-1.39 1.39L5.78 16.85a1 1 0 010-1.39zm-2.83-2.83a1 1 0 011.39 0l.707.707a1 1 0 01-1.39 1.39L2.22 13.22a1 1 0 010-1.39zm0-5.66a1 1 0 010-1.39l.707-.707a1 1 0 011.39 1.39l-.707.707a1 1 0 01-1.39 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
};
