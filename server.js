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
// ADMIN AUTHENTICATION (OPTIONAL)
// ============================================
// Eğer backend'de de doğrulama istiyorsanız:
const ADMIN_CREDENTIALS = {
    'admin': 'admin123',
    'yonetici': 'yonetici456'
};

// Basit token sistemi (production'da JWT kullanın!)
const adminSessions = new Map();

// Admin Login Endpoint (OPTIONAL)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
    }
    
    if (ADMIN_CREDENTIALS[username] && ADMIN_CREDENTIALS[username] === password) {
        const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        adminSessions.set(token, {
            username: username,
            loginTime: new Date(),
            lastActivity: new Date()
        });
        
        res.json({ 
            success: true, 
            token: token,
            username: username
        });
    } else {
        res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }
});

// Middleware: Token kontrolü (OPTIONAL)
const verifyAdminToken = (req, res, next) => {
    // OPSIYONEL: Eğer API'yi token ile korumak istiyorsanız
    // const token = req.headers['x-admin-token'];
    // if (!token || !adminSessions.has(token)) {
    //     return res.status(401).json({ error: 'Yetkisiz erişim' });
    // }
    // next();
    
    // Şimdilik, opsiyonel olarak bırakıyoruz (frontend'deki authentication yeterli)
    next();
};

// ============================================
// PRODUCT OPERATIONS
// ============================================

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
app.post('/api/products', verifyAdminToken, (req, res) => {
    try {
        const { name, price, oldPrice, description, isFeatured, image } = req.body;
        
        // Validation
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

// PUT update product (YENİ)
app.put('/api/products/:id', verifyAdminToken, (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, oldPrice, description, isFeatured, image } = req.body;
        
        const products = getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }
        
        products[productIndex] = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            price: price || products[productIndex].price,
            oldPrice: oldPrice || products[productIndex].oldPrice,
            description: description || products[productIndex].description,
            isFeatured: isFeatured !== undefined ? isFeatured : products[productIndex].isFeatured,
            image: image || products[productIndex].image,
            updatedAt: new Date().toISOString()
        };
        
        saveProducts(products);
        res.json(products[productIndex]);
    } catch (e) {
        console.error('Error updating product:', e);
        res.status(500).json({ error: 'Ürün güncellenirken hata oluştu' });
    }
});

// DELETE product
app.delete('/api/products/:id', verifyAdminToken, (req, res) => {
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

// Upload image
app.post('/api/upload', verifyAdminToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Görsel yüklenmedi' });
        }
        
        const imageUrl = '/uploads/' + req.file.filename;
        res.json({ imageUrl });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Görsel yüklenirken hata oluştu: ' + err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(PORT, () => {
    console.log(`✅ Server http://localhost:${PORT} adresinde çalışıyor`);
    console.log(`📊 Admin Paneli: http://localhost:${PORT}/admin.html`);
    console.log(`🏪 Mağaza: http://localhost:${PORT}`);
    console.log(`\n📝 Demo Bilgileri:`);
    console.log(`   Kullanıcı: admin / Şifre: admin123`);
});
