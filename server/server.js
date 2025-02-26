const body = require('body-parser');
const cookie = require('cookie-parser');
const express = require('express');
const path = require('path');

const host = '127.0.0.1';
const port = 3000;

const root = __dirname;
const public_root = '../public';

const users = {
    test: {
        username: 'test',
        email: 'test',
        password: 'password',
    },
};

const sessions = [];

function createSession(user) {
    const token = crypto.randomUUID();
    sessions[token] = user;
    return token;
}

const artists = ['Iron Maiden', 'Metallica'];

const albums = [
    {
        title: 'The number of the beast',
        artist: artists[0],
        img: 'https://upload.wikimedia.org/wikipedia/ru/8/8f/The_Number_Of_The_Beast.jpg',
    },
    {
        title: 'Black album',
        artist: artists[1],
        img: 'https://upload.wikimedia.org/wikipedia/ru/c/c2/Metallica_Album.jpg',
    },
];

const songs = [
    {
        title: 'Enter Sandman',
        album: albums[1],
        duration: '5:32',
    },
    {
        title: 'Sad But True',
        album: albums[1],
        duration: '5:25',
    },
    {
        title: 'Run to the Hills',
        album: albums[0],
        duration: '3:51',
    },
];

const app = express();

app.use(body());
app.use(cookie());
app.use('/static', express.static(path.join(root, public_root)));

app.get('/', (req, res) => {
    res.sendFile(path.join(root, public_root, 'index.html'));
});

app.get('/api/songs', (req, res) => {
    const data = songs.map((song) => ({
        title: song.title,
        artist: song.album.artist,
        duration: song.duration,
        img: song.album.img,
    }));
    res.json({
        status: 'ok',
        data: data,
    });
});

app.get('/api/albums', (req, res) => {
    const data = albums;
    res.json({
        status: 'ok',
        data: data,
    });
});

app.get('/api/artists', (req, res) => {
    const data = artists;
    res.json({
        status: 'ok',
        data: data,
    });
});

app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({
            status: 'error',
            message: 'Missing username, password or email',
        });
        return;
    }

    if (users[username] || users[email]) {
        res.status(400).json({
            status: 'error',
            message: 'User already exists',
        });
    } else {
        users[username] = {
            username,
            email,
            password,
        };
        users[email] = {
            username,
            email,
            password,
        };
        res.cookie('token', createSession(users[username]), {
            expires: new Date(Date.now() + 1000 * 60 * 10),
            secure: false, // no https right now
            httpOnly: true,
        });
        res.json({
            status: 'ok',
            message: 'User created',
        });
    }
});

app.post('/api/login', (req, res) => {
    const { identifier, password } = req.body;
    const user = users[identifier];
    if (user && user.password === password) {
        const token = createSession(user);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1000 * 60 * 10),
            secure: false, // no https right now
            httpOnly: true,
        });
        res.json({ 
            status: 'ok',
            username: user.username,
        });
    } else {
        res.json({
            status: 'error',
            message: 'Wrong username or password',
        });
    }
});

app.get('/api/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized',
        });
        return;
    }

    const user = sessions[token];
    if (user) {
        res.status(401).json({
            status: 'ok',
            data: {
                username: user.username,
            },
        });
    } else {
        res.json({
            status: 'error',
            message: 'Unauthorized',
        });
    }
});

// async function printSessions() {
//     while (true) {
//         console.log(sessions);
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
// }
// printSessions();

app.listen(port, host, () => {
    console.log(`Example app listening on http://${host}:${port}`);
});
