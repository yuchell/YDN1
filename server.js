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

// ============================================
// VERCEL UYUMLULUK - Upload Dizini Ayarı
// ============================================
const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/tmp/catalog' : path.join(__dirname, 'catalog');

// Katalog klasörünü oluştur (var değilse)
try {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
} catch (err) {
    console.warn('⚠️ Upload klasörü oluşturulamadı (Vercel\'de normal):', err.message);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destPath = isVercel ? '/tmp/catalog/' : 'catalog/';
        cb(null, destPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File size and type validation
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'));
        }
    }
});

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// ============================================
// PRODUCT OPERATIONS
// ============================================

// Read products
const getProducts = () => {
    try {
        if (!fs.existsSync(PRODUCTS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading products:', err);
        return [];
    }
};

// Write products
const saveProducts = (products) => {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (err) {
        console.error('Error writing products:', err);
    }
};

// GET all products
app.get('/api/products', (req, res) => {
    try {
        const products = getProducts();
        res.json(products);
    } catch (e) {
        console.error('Error reading products:', e);
        res.status(500).json({ error: 'Ürünler yüklenirken hata oluştu' });
    }
});

// POST new product
app.post('/api/products', (req, res) => {
    try {
        const { name, price, oldPrice, description, isFeatured, image } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ error: 'Ürün adı ve fiyatı gereklidir' });
        }
        
        const products = getProducts();
        const newProduct = {
            id: Date.now().toString(),
            name: name.trim(),
            price: price.trim(),
            oldPrice: oldPrice || '',
            description: description || '',
            isFeatured: isFeatured || false,
            image: image || '',
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        saveProducts(products);
        
        res.status(201).json(newProduct);
    } catch (e) {
        console.error('Error creating product:', e);
        res.status(500).json({ error: 'Ürün kaydedilirken hata oluştu' });
    }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const products = getProducts();
        const filtered = products.filter(p => p.id !== id);
        
        if (filtered.length === products.length) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }
        
        saveProducts(filtered);
        res.json({ success: true, message: 'Ürün silindi' });
    } catch (e) {
        console.error('Error deleting product:', e);
        res.status(500).json({ error: 'Ürün silinirken hata oluştu' });
    }
});

// POST upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Görsel yüklenmedi' });
        }
        
        const imageUrl = '/catalog/' + req.file.filename;
        res.json({ imageUrl });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Görsel yüklenirken hata oluştu: ' + err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        environment: isVercel ? 'vercel' : 'local',
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(PORT, () => {
    const env = isVercel ? '☁️  VERCEL' : '💻 LOCAL';
    console.log(`✅ Server ${env}: http://localhost:${PORT}`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin.html`);
});
