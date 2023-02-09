import { grey } from '@mui/material/colors';

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            ...(mode === 'dark' && {
                main: "#22223B",
                // special: "#424b54"
            }),
            ...(mode === 'light' && {
                main: "#4A4E69",
                secondary: "#001845"
            }),
        },
        secondary: {
            ...(mode === 'dark' && {
                // main: "#424b54",
                // main: "#4A4E69",
                // main: "#22333b",
                // main: "#3d405b",
                // main: "#3d405b",
                // main: "#2f3e46",
                // main: "#333d29",
                main: "#001d3d",
                // dark: "#414535"
                // dark: "#546a7b"
                // dark: "#424b54"
            }),
            ...(mode === 'light' && {
                // main: "#C9ADA7",
                // main: "#d6ccc2",
                main: "#e5e5e5",
            }),
        },
        // special: {
        //     dark: "#424b54",
        // },
        ...(mode === 'dark' && {
            background: {
                default: "#4A4E69",
                // paper: "#22223B",
                // paper: "#22333b",
                paper: "#283044",
                // navBG: "#1976d2"
            },
            info: {
                // main: "#001845"
                // main: "#001f54"
                // main: "#373d20",
                // main: "#1976d2",
                // navBG: "#1976d2"
                main: "#bcbd8b",
            }
        }),
        ...(mode === 'light' && {
            background: {
                default: "#F2E9E4",
                // default: "#edede9",
                // paper: "#edede9"
                paper: "#ced4da"
            },
            info: {
                // main: "#FEFAE0",
                main: "#bcbd8b",
            }
        }),
        text: {
            ...(mode === 'light'
                ? {
                    primary: grey[900],
                    // secondary: grey[800],
                    secondary: "#343a40",
                }
                : {
                    // primary: grey[400],
                    primary: "#edede9",
                    secondary: "#6c757d",
                }),
        },
    },
});