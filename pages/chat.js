import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import {
    Container,
    Paper,
    Typography,
    Divider,
    Button,
} from '@mui/material';
import { MessageList, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import SendIcon from '@mui/icons-material/Send';
import {API_URL as SOCKET_URL} from "@/config";


export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentRoom, setCurrentRoom] = useState(null);
    const socket = useRef(null); // Ref for socket instance
    const router = useRouter();
    const chatEndRef = useRef(null); // Ref for scrolling to bottom

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const { roomname, roomid } = router.query; // Read roomname from query parameter

        if (roomname) {
            setCurrentRoom(roomid); // Set currentRoom state based on query parameter
        }

        // Initialize socket connection
        socket.current = io(SOCKET_URL, {
            withCredentials: true,
            extraHeaders: {
                'my-custom-header': 'abcd',
            },
        });

        // Event listener for incoming messages
        socket.current.on('message', (message) => {
            console.log('Received message:', message);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    position:
                        message.username ===
                        (JSON.parse(localStorage.getItem('user'))?.username ||
                            'Anonymous')
                            ? 'right'
                            : 'left',
                    type: 'text',
                    text: message.content,
                    title: message.username,
                    date: new Date(message.createdAt),
                },
            ]);
        });

        // Event listener for receiving all existing messages
        socket.current.on('allMessages', (allMessages) => {
            console.log('Received all messages:', allMessages);
            setMessages(
                allMessages[0].map((msg) => ({
                    position:
                        msg.username ===
                        (JSON.parse(localStorage.getItem('user'))?.username ||
                            'Anonymous')
                            ? 'right'
                            : 'left',
                    type: 'text',
                    text: msg.content,
                    title: msg.username,
                    date: new Date(msg.createdAt),
                }))
            );
        });

        // Event listener for receiving current room name
        socket.current.on('roomName', (roomName) => {
            console.log('Current room:', roomName);
            setCurrentRoom(roomName);
        });

        return () => {
            socket.current.disconnect(); // Disconnect socket on component unmount
        };
    }, [router]);

    useEffect(() => {
        if (!socket.current || !currentRoom) return;
        const userId = JSON.parse(localStorage.getItem('user')).id;
        socket.current.emit('joinRoom', currentRoom, userId);

        return () => {
            socket.current.off('allMessages');
            socket.current.off('roomName');
        };
    }, [currentRoom]);

    // Scroll to the bottom of the chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Function to handle sending messages
    const sendMessage = () => {
        if (input && currentRoom) {
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);
            const userName =
                JSON.parse(localStorage.getItem('user'))?.username || 'Anonymous';

            const message = {
                userId: decoded.id,
                content: input,
                roomName: currentRoom,
                userName: userName,
                roomId: router.query.roomid,
                createdAt: new Date().toISOString(), // Add a createdAt timestamp
            };
            console.log(message);
            socket.current.emit('sendMessage', message); // Emit message using socket ref
            setInput('');
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '90vh',
                padding: 2,
            }}
        >
            <Typography variant="h6" gutterBottom>
                You are in: {router?.query?.roomname || 'Public'}
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                    marginBottom: 2,
                    height: '70vh', // Set a fixed height for the chat container
                }}
            >
                <MessageList
                    className="message-list"
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />
                <div ref={chatEndRef} />
            </Paper>

            <Divider sx={{ marginY: 1 }} />

            <Input
                placeholder="Type here..."
                multiline={false}
                rightButtons={
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={sendMessage}
                        disabled={!input}
                        startIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
        </Container>
    );
}
