import { Application } from './framework/Application.js';
import { jsonParser } from './framework/middleware.js';
import { readData, writeData } from './app/utils.js';

const app = new Application();
const PORT = 5001;

app.use(jsonParser);

// --- Books Routes ---

// GET /books
app.get('/books', async (req, res) => {
    const books = await readData('books.json');
    res.json(books);
});

// GET /books/:id
app.get('/books/:id', async (req, res) => {
    const books = await readData('books.json');
    const book = books.find(b => b.id === Number(req.params.id));
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// POST /books
app.post('/books', async (req, res) => {
    const books = await readData('books.json');
    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: req.body.title || 'Unknown Title',
        author: req.body.author || 'Unknown Author',
        isAvailable: typeof req.body.isAvailable === 'boolean' ? req.body.isAvailable : true,
        publishedAt: req.body.publishedAt || new Date().toISOString(),
        tags: Array.isArray(req.body.tags) ? req.body.tags : []
    };
    books.push(newBook);
    await writeData('books.json', books);
    res.status(201).json(newBook);
});

// PUT /books/:id
app.put('/books/:id', async (req, res) => {
    const books = await readData('books.json');
    const index = books.findIndex(b => b.id === Number(req.params.id));
    
    if (index !== -1) {
        const updatedBook = {
            id: Number(req.params.id),
            title: req.body.title || books[index].title,
            author: req.body.author || books[index].author,
            isAvailable: typeof req.body.isAvailable === 'boolean' ? req.body.isAvailable : books[index].isAvailable,
            publishedAt: req.body.publishedAt || books[index].publishedAt,
            tags: Array.isArray(req.body.tags) ? req.body.tags : books[index].tags
        };
        books[index] = updatedBook;
        await writeData('books.json', books);
        res.json(updatedBook);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// PATCH /books/:id
app.patch('/books/:id', async (req, res) => {
    const books = await readData('books.json');
    const index = books.findIndex(b => b.id === Number(req.params.id));

    if (index !== -1) {
        const book = books[index];
        // Merge existing with new data
        const updatedBook = { ...book, ...req.body, id: book.id }; // Ensure ID doesn't change
        books[index] = updatedBook;
        await writeData('books.json', books);
        res.json(updatedBook);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// DELETE /books/:id
app.delete('/books/:id', async (req, res) => {
    let books = await readData('books.json');
    const initialLength = books.length;
    books = books.filter(b => b.id !== Number(req.params.id));
    
    if (books.length < initialLength) {
        await writeData('books.json', books);
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// --- Readers Routes ---

// GET /readers
app.get('/readers', async (req, res) => {
    const readers = await readData('readers.json');
    res.json(readers);
});

// GET /readers/:id
app.get('/readers/:id', async (req, res) => {
    const readers = await readData('readers.json');
    const reader = readers.find(r => r.id === Number(req.params.id));
    if (reader) {
        res.json(reader);
    } else {
        res.status(404).json({ error: 'Reader not found' });
    }
});

// POST /readers
app.post('/readers', async (req, res) => {
    const readers = await readData('readers.json');
    const newReader = {
        id: readers.length > 0 ? Math.max(...readers.map(r => r.id)) + 1 : 1,
        name: req.body.name || 'Anonymous',
        membershipActive: typeof req.body.membershipActive === 'boolean' ? req.body.membershipActive : false,
        registeredAt: req.body.registeredAt || new Date().toISOString(),
        borrowedBooks: Array.isArray(req.body.borrowedBooks) ? req.body.borrowedBooks : []
    };
    readers.push(newReader);
    await writeData('readers.json', readers);
    res.status(201).json(newReader);
});

// PUT /readers/:id
app.put('/readers/:id', async (req, res) => {
    const readers = await readData('readers.json');
    const index = readers.findIndex(r => r.id === Number(req.params.id));
    
    if (index !== -1) {
        const updatedReader = {
            id: Number(req.params.id),
            name: req.body.name || readers[index].name,
            membershipActive: typeof req.body.membershipActive === 'boolean' ? req.body.membershipActive : readers[index].membershipActive,
            registeredAt: req.body.registeredAt || readers[index].registeredAt,
            borrowedBooks: Array.isArray(req.body.borrowedBooks) ? req.body.borrowedBooks : readers[index].borrowedBooks
        };
        readers[index] = updatedReader;
        await writeData('readers.json', readers);
        res.json(updatedReader);
    } else {
        res.status(404).json({ error: 'Reader not found' });
    }
});

// PATCH /readers/:id
app.patch('/readers/:id', async (req, res) => {
    const readers = await readData('readers.json');
    const index = readers.findIndex(r => r.id === Number(req.params.id));

    if (index !== -1) {
        const reader = readers[index];
        const updatedReader = { ...reader, ...req.body, id: reader.id };
        readers[index] = updatedReader;
        await writeData('readers.json', readers);
        res.json(updatedReader);
    } else {
        res.status(404).json({ error: 'Reader not found' });
    }
});

// DELETE /readers/:id
app.delete('/readers/:id', async (req, res) => {
    let readers = await readData('readers.json');
    const initialLength = readers.length;
    readers = readers.filter(r => r.id !== Number(req.params.id));
    
    if (readers.length < initialLength) {
        await writeData('readers.json', readers);
        res.json({ message: 'Reader deleted' });
    } else {
        res.status(404).json({ error: 'Reader not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
