'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { AntdRegistry } from "@ant-design/nextjs-registry";

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('dark');

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
        if (savedMode) {
            setMode(savedMode);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setMode('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ConfigProvider
                theme={{
                    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        // Keep consistency with existing rules
                        borderRadius: 6,
                    },
                }}
            >
                <AntdRegistry>
                    {children}
                </AntdRegistry>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useDarkMode = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a ThemeProvider');
    }
    return context;
};
