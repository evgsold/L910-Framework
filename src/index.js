import { Application } from './framework/Application.js';
import { jsonParser } from './framework/middleware.js';
import { readData, writeData } from './app/utils.js';

const app = new Application();
const PORT = 5001;

app.use(jsonParser);

// --- Artists Routes ---

// GET /artists
app.get('/artists', async (req, res) => {
    const artists = await readData('artists.json');
    res.json(artists);
});

// GET /artists/:id
app.get('/artists/:id', async (req, res) => {
    const artists = await readData('artists.json');
    const artist = artists.find(a => a.id === Number(req.params.id));
    if (artist) {
        res.json(artist);
    } else {
        res.status(404).json({ error: 'Artist not found' });
    }
});

// POST /artists
app.post('/artists', async (req, res) => {
    const artists = await readData('artists.json');
    const newArtist = {
        id: artists.length > 0 ? Math.max(...artists.map(a => a.id)) + 1 : 1,
        name: req.body.name || 'Unknown Artist',
        actType: req.body.actType || 'General',
        isFullTime: typeof req.body.isFullTime === 'boolean' ? req.body.isFullTime : false,
        hiredAt: req.body.hiredAt || new Date().toISOString(),
        skills: Array.isArray(req.body.skills) ? req.body.skills : []
    };
    artists.push(newArtist);
    await writeData('artists.json', artists);
    res.status(201).json(newArtist);
});

// PUT /artists/:id
app.put('/artists/:id', async (req, res) => {
    const artists = await readData('artists.json');
    const index = artists.findIndex(a => a.id === Number(req.params.id));
    
    if (index !== -1) {
        const updatedArtist = {
            id: Number(req.params.id),
            name: req.body.name || artists[index].name,
            actType: req.body.actType || artists[index].actType,
            isFullTime: typeof req.body.isFullTime === 'boolean' ? req.body.isFullTime : artists[index].isFullTime,
            hiredAt: req.body.hiredAt || artists[index].hiredAt,
            skills: Array.isArray(req.body.skills) ? req.body.skills : artists[index].skills
        };
        artists[index] = updatedArtist;
        await writeData('artists.json', artists);
        res.json(updatedArtist);
    } else {
        res.status(404).json({ error: 'Artist not found' });
    }
});

// PATCH /artists/:id
app.patch('/artists/:id', async (req, res) => {
    const artists = await readData('artists.json');
    const index = artists.findIndex(a => a.id === Number(req.params.id));

    if (index !== -1) {
        const artist = artists[index];
        // Merge existing with new data
        const updatedArtist = { ...artist, ...req.body, id: artist.id }; // Ensure ID doesn't change
        artists[index] = updatedArtist;
        await writeData('artists.json', artists);
        res.json(updatedArtist);
    } else {
        res.status(404).json({ error: 'Artist not found' });
    }
});

// DELETE /artists/:id
app.delete('/artists/:id', async (req, res) => {
    let artists = await readData('artists.json');
    const initialLength = artists.length;
    artists = artists.filter(a => a.id !== Number(req.params.id));
    
    if (artists.length < initialLength) {
        await writeData('artists.json', artists);
        res.json({ message: 'Artist deleted' });
    } else {
        res.status(404).json({ error: 'Artist not found' });
    }
});

// --- Shows Routes ---

// GET /shows
app.get('/shows', async (req, res) => {
    const shows = await readData('shows.json');
    res.json(shows);
});

// GET /shows/:id
app.get('/shows/:id', async (req, res) => {
    const shows = await readData('shows.json');
    const show = shows.find(s => s.id === Number(req.params.id));
    if (show) {
        res.json(show);
    } else {
        res.status(404).json({ error: 'Show not found' });
    }
});

// POST /shows
app.post('/shows', async (req, res) => {
    const shows = await readData('shows.json');
    const newShow = {
        id: shows.length > 0 ? Math.max(...shows.map(s => s.id)) + 1 : 1,
        title: req.body.title || 'Untitled Show',
        durationMinutes: typeof req.body.durationMinutes === 'number' ? req.body.durationMinutes : 60,
        isSoldOut: typeof req.body.isSoldOut === 'boolean' ? req.body.isSoldOut : false,
        premiereDate: req.body.premiereDate || new Date().toISOString(),
        performers: Array.isArray(req.body.performers) ? req.body.performers : []
    };
    shows.push(newShow);
    await writeData('shows.json', shows);
    res.status(201).json(newShow);
});

// PUT /shows/:id
app.put('/shows/:id', async (req, res) => {
    const shows = await readData('shows.json');
    const index = shows.findIndex(s => s.id === Number(req.params.id));
    
    if (index !== -1) {
        const updatedShow = {
            id: Number(req.params.id),
            title: req.body.title || shows[index].title,
            durationMinutes: typeof req.body.durationMinutes === 'number' ? req.body.durationMinutes : shows[index].durationMinutes,
            isSoldOut: typeof req.body.isSoldOut === 'boolean' ? req.body.isSoldOut : shows[index].isSoldOut,
            premiereDate: req.body.premiereDate || shows[index].premiereDate,
            performers: Array.isArray(req.body.performers) ? req.body.performers : shows[index].performers
        };
        shows[index] = updatedShow;
        await writeData('shows.json', shows);
        res.json(updatedShow);
    } else {
        res.status(404).json({ error: 'Show not found' });
    }
});

// PATCH /shows/:id
app.patch('/shows/:id', async (req, res) => {
    const shows = await readData('shows.json');
    const index = shows.findIndex(s => s.id === Number(req.params.id));

    if (index !== -1) {
        const show = shows[index];
        const updatedShow = { ...show, ...req.body, id: show.id };
        shows[index] = updatedShow;
        await writeData('shows.json', shows);
        res.json(updatedShow);
    } else {
        res.status(404).json({ error: 'Show not found' });
    }
});

// DELETE /shows/:id
app.delete('/shows/:id', async (req, res) => {
    let shows = await readData('shows.json');
    const initialLength = shows.length;
    shows = shows.filter(s => s.id !== Number(req.params.id));
    
    if (shows.length < initialLength) {
        await writeData('shows.json', shows);
        res.json({ message: 'Show deleted' });
    } else {
        res.status(404).json({ error: 'Show not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
