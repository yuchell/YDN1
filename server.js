const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Setup upload directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Read products
const getProducts = () => {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
};

// Write products
const saveProducts = (products) => {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

// API Routes
app.get('/api/products', (req, res) => {
    try {
        const products = getProducts();
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: 'Failed to read products' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const products = getProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...req.body
        };
        products.push(newProduct);
        saveProducts(products);
        res.status(201).json(newProduct);
    } catch (e) {
        res.status(500).json({ error: 'Failed to save product' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    try {
        const products = getProducts();
        const filtered = products.filter(p => p.id !== req.params.id);
        saveProducts(filtered);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    // Return relative path
    const imageUrl = '/uploads/' + req.file.filename;
    res.json({ imageUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Admin Panel available at http://localhost:${PORT}/admin.html`);
});
