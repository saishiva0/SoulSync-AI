import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { ChatProvider } from './contexts/ChatContext';
import Chat from './components/Chat/Chat';
import Sidebar from './components/Sidebar/Sidebar';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ChatProvider>
        <CssBaseline />
        <Box className="app-container">
          <Sidebar />
          <Chat />
        </Box>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;