// Initialize data structures
let menuItems = [];
let cart = [];
let invoices = [];
let isPaid = false;
let uploadedImageData = null;
let editingItemId = null;
let currentFilter = 'all';
let customDateFrom = null;
let customDateTo = null;
let currentPage = 1;
let itemsPerPage = 10;

// Default menu items
const defaultMenu = [
    { id: 1, name: 'Idly', price: 30, image: 'https://media.istockphoto.com/id/1145169012/photo/many-idli-or-idly-and-coconut-chutney-south-indian-breakfast.jpg?s=612x612&w=0&k=20&c=DlFMZMRfuSh2PLVereW2Ow-7DtniaCbubHNasNva1B8=' },
    { id: 2, name: 'Dosa', price: 30, image: 'https://media.istockphoto.com/id/638506124/photo/dosa-is-a-south-indian-thin-pancake-made-of-rice-dal-batter.jpg?s=612x612&w=0&k=20&c=hGABU_BTINXwCVlBdOz1DJ8UF7hJjwpbhQT3DGB7eBg=' },
    { id: 3, name: 'Vada', price: 20, image: 'https://media.istockphoto.com/id/1306083224/photo/medu-vada-also-known-as-urad-vada-udid-vada-is-a-savoury-fritter-from-south-india.jpg?s=612x612&w=0&k=20&c=wJWy1H0Hx_KTlbSfqmZlIxnKdCZKCPdBoPR1BLs-RKo=' },
    { id: 4, name: 'Poori', price: 45, image: 'https://media.istockphoto.com/id/1292633701/photo/puri-bhaji-is-a-traditional-indian-breakfast-served-in-a-plate-isolated-on-plain-background.jpg?s=612x612&w=0&k=20&c=MxsD0gHRjXaGD0lOzqsZxcaZUNFXy6xQlmVXL5GpqWc=' },
    { id: 5, name: 'Pongal', price: 35, image: 'https://media.istockphoto.com/id/1291946287/photo/pongal-or-khichdi-or-khichadi.jpg?s=612x612&w=0&k=20&c=4jAlmKzZ4UaYhxM8A-qvRhLN2RJQyMQQF9J5sGvGrXI=' },
    { id: 6, name: 'Tea', price: 15, image: 'https://media.istockphoto.com/id/1181811066/photo/tea-in-a-glass-cup-and-saucer-cinnamon-stick-on-brown.jpg?s=612x612&w=0&k=20&c=ChBj4FzOzuI-8Eo4Wkl8KP5Wrc-OZKh7D-YHYKGCPFk=' },
    { id: 7, name: 'Samosa', price: 20, image: 'https://media.istockphoto.com/id/1302605531/photo/samosa-is-a-fried-south-asian-pastry-with-a-savory-filling-including-ingredients-such-as.jpg?s=612x612&w=0&k=20&c=zSx0GlKbhIG9cxBjEu79T83FU3KzejQ8qLkF86_cZJk=' },
    { id: 8, name: 'Bajji', price: 25, image: 'https://media.istockphoto.com/id/1143756502/photo/pakora-also-called-pikodi-pakodi-fakkada-bhajiya-bhajji-bhaji-or-ponako.jpg?s=612x612&w=0&k=20&c=HwwTbjWnqwFZd64x0GqXlBMG_zGtVzKUGvgJAV0PRGA=' }
];

// Load data from localStorage
function loadData() {
    const savedMenu = localStorage.getItem('menuItems');
    const savedInvoices = localStorage.getItem('invoices');
    const lastResetDate = localStorage.getItem('lastResetDate');
    
    menuItems = savedMenu ? JSON.parse(savedMenu) : defaultMenu;
    invoices = savedInvoices ? JSON.parse(savedInvoices) : [];
    
    // Check if we need to auto-reset (midnight passed)
    checkAndResetDaily(lastResetDate);
    
    // Don't load cart from storage - start fresh each session
    cart = [];
}

// Check if midnight has passed and reset if needed
function checkAndResetDaily(lastResetDate) {
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
        // Midnight has passed, backup and reset
        if (invoices.length > 0) {
            autoBackupAndReset();
        }
        localStorage.setItem('lastResetDate', today);
    }
}

// Auto backup invoices to CSV and reset
function autoBackupAndReset() {
    if (invoices.length === 0) return;
    
    // Create backup CSV
    const allItemNames = new Set();
    invoices.forEach(invoice => {
        invoice.items.forEach(item => {
            allItemNames.add(item.name);
        });
    });
    
    const itemNamesArray = Array.from(allItemNames).sort();
    
    let csv = 'Invoice Number,Date,';
    itemNamesArray.forEach(itemName => {
        csv += `${itemName} (Qty),`;
    });
    csv += 'Total Amount\n';
    
    invoices.forEach(invoice => {
        csv += `"${invoice.id}","${invoice.date}",`;
        itemNamesArray.forEach(itemName => {
            const item = invoice.items.find(i => i.name === itemName);
            csv += item ? item.quantity : 0;
            csv += ',';
        });
        csv += `${invoice.total}\n`;
    });
    
    // Store backup in localStorage with date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const backupKey = `backup-${yesterday.toISOString().split('T')[0]}`;
    localStorage.setItem(backupKey, csv);
    
    // Clear invoices for new day
    invoices = [];
    saveInvoices();
    
    console.log('Daily auto-backup completed and invoices reset');
}

// Save data to localStorage
function saveMenu() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

function saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(invoices));
}

// Create floating particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 100 + 50;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        
        container.appendChild(particle);
    }
}

// Toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.remove('active');
}

// Render menu items
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card glass rounded-2xl overflow-hidden';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-bold text-white mb-2">${item.name}</h3>
                <p class="text-green-400 font-semibold text-lg mb-4">₹${item.price.toFixed(2)}</p>
                <div class="flex items-center gap-2">
                    <button onclick="addToCart(${item.id})" class="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;
    
    const cartItem = cart.find(c => c.id === itemId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    // Reset payment status when cart is modified
    if (isPaid) {
        isPaid = false;
    }
    
    renderCart();
    showToast(`${item.name} added to cart`, 'success');
}

// Update quantity
function updateQuantity(itemId, change) {
    const cartItem = cart.find(c => c.id === itemId);
    if (!cartItem) return;
    
    cartItem.quantity += change;
    
    if (cartItem.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    // Reset payment status when cart is modified
    if (isPaid) {
        isPaid = false;
    }
    
    renderCart();
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    
    // Reset payment status when cart is modified
    if (isPaid) {
        isPaid = false;
    }
    
    renderCart();
    showToast('Item removed from cart', 'info');
}

// Render cart
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-300 text-center py-8">Cart is empty</p>';
        document.getElementById('subtotal').textContent = '₹0.00';
        document.getElementById('total').textContent = '₹0.00';
        updateCartPaymentStatus();
        return;
    }
    
    cartContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="text-white font-semibold">${item.name}</h4>
                    <p class="text-gray-300 text-sm">₹${item.price.toFixed(2)} each</p>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-300">
                    ✕
                </button>
            </div>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn">−</button>
                    <span class="text-white font-semibold w-8 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                </div>
                <span class="text-white font-bold">₹${itemTotal.toFixed(2)}</span>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${subtotal.toFixed(2)}`;
    updateCartPaymentStatus();
}

// Clear cart
function confirmClearCart() {
    if (cart.length === 0) {
        showToast('Cart is already empty', 'info');
        return;
    }
    document.getElementById('clear-cart-modal').classList.add('active');
}

function clearCart() {
    cart = [];
    isPaid = false;
    renderCart();
    closeClearCartModal();
    showToast('Cart cleared successfully', 'success');
}

function closeClearCartModal() {
    document.getElementById('clear-cart-modal').classList.remove('active');
}

// Payment functions
function payNow() {
    if (cart.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('payment-amount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('payment-modal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function completePayment() {
    // Save invoice before clearing cart
    const invoiceNumber = `INV${Date.now()}`;
    const date = new Date().toLocaleString();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const invoice = {
        id: invoiceNumber,
        date: date,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: subtotal
    };
    
    invoices.push(invoice);
    saveInvoices();
    
    // Clear cart and reset payment status
    cart = [];
    isPaid = false;
    
    closePaymentModal();
    renderCart();
    
    showToast('Payment completed! Invoice saved to reports ✓', 'success');
}

function updateCartPaymentStatus() {
    const cartPanel = document.querySelector('.lg\\:w-96 .glass-strong');
    let statusBadge = document.getElementById('payment-status-badge');
    
    if (!statusBadge) {
        statusBadge = document.createElement('div');
        statusBadge.id = 'payment-status-badge';
        cartPanel.insertBefore(statusBadge, cartPanel.firstChild);
    }
    
    if (isPaid && cart.length > 0) {
        statusBadge.className = 'mb-4 px-4 py-3 bg-green-500/20 border-2 border-green-400 rounded-lg';
        statusBadge.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-2xl">✓</span>
                <div>
                    <p class="text-green-400 font-bold">Payment Completed</p>
                    <p class="text-green-300 text-sm">Invoice saved to reports</p>
                </div>
            </div>
        `;
    } else if (cart.length > 0) {
        statusBadge.className = 'mb-4 px-4 py-3 bg-orange-500/20 border-2 border-orange-400 rounded-lg';
        statusBadge.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-2xl">⏳</span>
                <div>
                    <p class="text-orange-400 font-bold">Payment Pending</p>
                    <p class="text-orange-300 text-sm">Please complete payment</p>
                </div>
            </div>
        `;
    } else {
        statusBadge.innerHTML = '';
        statusBadge.className = '';
    }
}

// Generate invoice
function generateInvoice() {
    if (cart.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }
    
    if (!isPaid) {
        showToast('Please complete payment first', 'error');
        return;
    }
    
    // Find the most recent invoice for this cart
    const lastInvoice = invoices[invoices.length - 1];
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const invoiceNumber = lastInvoice.id;
    const date = lastInvoice.date;
    const subtotal = lastInvoice.total;
    
    // Header
    doc.setFontSize(20);
    doc.text('RESTAURANT INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 35);
    doc.text(`Date: ${date}`, 20, 42);
    
    // Table header
    doc.setFontSize(12);
    doc.text('Item', 20, 55);
    doc.text('Qty', 110, 55);
    doc.text('Price', 135, 55);
    doc.text('Total', 165, 55);
    
    doc.line(20, 58, 190, 58);
    
    // Items
    let y = 68;
    
    lastInvoice.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        doc.setFontSize(10);
        doc.text(item.name, 20, y);
        doc.text(item.quantity.toString(), 110, y);
        doc.text(`Rs.${item.price.toFixed(2)}`, 135, y);
        doc.text(`Rs.${itemTotal.toFixed(2)}`, 165, y);
        
        y += 10;
    });
    
    // Total
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(12);
    doc.text('TOTAL:', 135, y);
    doc.text(`Rs.${subtotal.toFixed(2)}`, 165, y);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your order!', 105, y + 20, { align: 'center' });
    
    // Download PDF
    doc.save(`invoice-${invoiceNumber}.pdf`);
    
    showToast('Invoice downloaded successfully!', 'success');
    
    // Clear cart after invoice download
    cart = [];
    isPaid = false;
    renderCart();
}

// Menu management
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageData = e.target.result;
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        previewImg.src = uploadedImageData;
        preview.classList.remove('hidden');
        
        // Clear URL input if image is uploaded
        document.getElementById('item-image-url').value = '';
    };
    reader.readAsDataURL(file);
}

function addMenuItem() {
    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const imageUrl = document.getElementById('item-image-url').value.trim();
    const image = uploadedImageData || imageUrl;
    
    if (!name || !price || !image) {
        showToast('Please fill all fields and provide an image', 'error');
        return;
    }
    
    if (editingItemId) {
        // Update existing item
        const itemIndex = menuItems.findIndex(item => item.id === editingItemId);
        if (itemIndex !== -1) {
            menuItems[itemIndex] = {
                id: editingItemId,
                name: name,
                price: price,
                image: image
            };
            showToast('Item updated successfully', 'success');
            cancelEdit();
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now(),
            name: name,
            price: price,
            image: image
        };
        menuItems.push(newItem);
        showToast('Item added successfully', 'success');
        
        // Clear form
        document.getElementById('item-name').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-image-url').value = '';
        document.getElementById('item-image-file').value = '';
        document.getElementById('image-preview').classList.add('hidden');
        uploadedImageData = null;
    }
    
    saveMenu();
    renderMenu();
    renderManageMenu();
}

function editMenuItem(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;
    
    // Populate form with item data
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-price').value = item.price;
    
    // Handle image
    if (item.image.startsWith('data:')) {
        // Base64 image
        uploadedImageData = item.image;
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        previewImg.src = item.image;
        preview.classList.remove('hidden');
    } else {
        // URL image
        document.getElementById('item-image-url').value = item.image;
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        previewImg.src = item.image;
        preview.classList.remove('hidden');
    }
    
    editingItemId = itemId;
    
    // Update UI for edit mode
    const addBtn = document.querySelector('#manage-menu-page button[onclick="addMenuItem()"]');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    addBtn.textContent = '✓ Update Item';
    addBtn.className = 'px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition md:col-span-2';
    cancelBtn.classList.remove('hidden');
    
    // Scroll to form
    document.querySelector('#manage-menu-page .glass-strong').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    showToast('Edit mode activated', 'info');
}

function cancelEdit() {
    editingItemId = null;
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-image-url').value = '';
    document.getElementById('item-image-file').value = '';
    document.getElementById('image-preview').classList.add('hidden');
    uploadedImageData = null;
    
    // Reset UI
    const addBtn = document.querySelector('#manage-menu-page button[onclick="addMenuItem()"]');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    addBtn.textContent = '➕ Add Item';
    addBtn.className = 'px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition md:col-span-2';
    cancelBtn.classList.add('hidden');
}

function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    menuItems = menuItems.filter(item => item.id !== itemId);
    saveMenu();
    renderMenu();
    renderManageMenu();
    showToast('Item deleted successfully', 'success');
}

function renderManageMenu() {
    const list = document.getElementById('manage-menu-list');
    list.innerHTML = '';
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'glass rounded-xl p-4';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover rounded-lg mb-3">
            <h4 class="text-white font-semibold mb-1">${item.name}</h4>
            <p class="text-green-400 font-semibold mb-3">₹${item.price.toFixed(2)}</p>
            <div class="flex gap-2">
                <button onclick="editMenuItem(${item.id})" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                    ✏️ Edit
                </button>
                <button onclick="deleteMenuItem(${item.id})" class="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                    🗑️ Delete
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Filter functions
function filterReports(filterType) {
    currentFilter = filterType;
    currentPage = 1; // Reset to first page when filter changes
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-white/20');
        btn.classList.remove('bg-purple-600');
    });
    
    const activeBtn = document.getElementById(`filter-${filterType}`);
    activeBtn.classList.add('active');
    activeBtn.classList.remove('bg-white/20');
    activeBtn.classList.add('bg-purple-600');
    
    // Hide custom date range
    document.getElementById('custom-date-range').classList.add('hidden');
    
    renderSalesReports();
}

function showCustomDateFilter() {
    currentFilter = 'custom';
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-white/20');
        btn.classList.remove('bg-purple-600');
    });
    
    const activeBtn = document.getElementById('filter-custom');
    activeBtn.classList.add('active');
    activeBtn.classList.remove('bg-white/20');
    activeBtn.classList.add('bg-purple-600');
    
    // Show custom date range
    document.getElementById('custom-date-range').classList.remove('hidden');
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-to').value = today;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    document.getElementById('date-from').value = weekAgo.toISOString().split('T')[0];
}

function applyCustomDateFilter() {
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    if (!dateFrom || !dateTo) {
        showToast('Please select both dates', 'error');
        return;
    }
    
    if (new Date(dateFrom) > new Date(dateTo)) {
        showToast('From date must be before To date', 'error');
        return;
    }
    
    customDateFrom = new Date(dateFrom);
    customDateFrom.setHours(0, 0, 0, 0);
    
    customDateTo = new Date(dateTo);
    customDateTo.setHours(23, 59, 59, 999);
    
    currentPage = 1; // Reset to first page
    renderSalesReports();
    showToast('Custom filter applied', 'success');
}

// Download historical backups
function downloadHistoricalBackup() {
    const backupDate = prompt('Enter date to download backup (YYYY-MM-DD):');
    if (!backupDate) return;
    
    const backupKey = `backup-${backupDate}`;
    const backupData = localStorage.getItem(backupKey);
    
    if (!backupData) {
        showToast('No backup found for this date', 'error');
        return;
    }
    
    const blob = new Blob([backupData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${backupDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Backup downloaded successfully', 'success');
}

function getFilteredInvoices() {
    const now = new Date();
    
    return invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        
        switch(currentFilter) {
            case 'today':
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return invoiceDate >= today && invoiceDate < tomorrow;
                
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
                weekStart.setHours(0, 0, 0, 0);
                return invoiceDate >= weekStart;
                
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                return invoiceDate >= monthStart;
                
            case 'custom':
                if (customDateFrom && customDateTo) {
                    return invoiceDate >= customDateFrom && invoiceDate <= customDateTo;
                }
                return true;
                
            case 'all':
            default:
                return true;
        }
    });
}

// Sales reports
function renderSalesReports() {
    const filteredInvoices = getFilteredInvoices();
    
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalTransactions = filteredInvoices.length;
    
    // Calculate top selling item
    const itemSales = {};
    filteredInvoices.forEach(invoice => {
        invoice.items.forEach(item => {
            if (itemSales[item.name]) {
                itemSales[item.name] += item.quantity;
            } else {
                itemSales[item.name] = item.quantity;
            }
        });
    });
    
    let topItem = '-';
    let topCount = 0;
    Object.keys(itemSales).forEach(itemName => {
        if (itemSales[itemName] > topCount) {
            topCount = itemSales[itemName];
            topItem = itemName;
        }
    });
    
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById('total-transactions').textContent = totalTransactions;
    
    if (topItem !== '-') {
        document.getElementById('top-selling-item').textContent = topItem;
        document.getElementById('top-selling-count').textContent = `${topCount} units sold`;
    } else {
        document.getElementById('top-selling-item').textContent = '-';
        document.getElementById('top-selling-count').textContent = 'No sales yet';
    }
    
    const tbody = document.getElementById('invoice-list');
    const table = document.getElementById('invoice-table');
    const noInvoicesMsg = document.getElementById('no-invoices-msg');
    const paginationContainer = document.getElementById('pagination-controls');
    
    if (filteredInvoices.length === 0) {
        table.classList.add('hidden');
        noInvoicesMsg.classList.remove('hidden');
        paginationContainer.classList.add('hidden');
        noInvoicesMsg.textContent = currentFilter === 'all' ? 'No invoices yet' : 'No invoices found for selected period';
        return;
    }
    
    table.classList.remove('hidden');
    noInvoicesMsg.classList.add('hidden');
    
    // Pagination logic
    const reversedInvoices = filteredInvoices.slice().reverse();
    const totalPages = Math.ceil(reversedInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedInvoices = reversedInvoices.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    paginatedInvoices.forEach(invoice => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-white/10';
        
        tr.innerHTML = `
            <td class="py-3 px-2">${invoice.id}</td>
            <td class="py-3 px-2 text-sm">${invoice.date}</td>
            <td class="py-3 px-2 text-right font-semibold text-green-400">₹${invoice.total.toFixed(2)}</td>
            <td class="py-3 px-2 text-center">
                <button onclick="downloadInvoice('${invoice.id}')" class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition mr-2 mb-1">
                    Download
                </button>
                <button onclick="deleteInvoice('${invoice.id}')" class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Render pagination
    renderPagination(totalPages, filteredInvoices.length);
}

function renderPagination(totalPages, totalItems) {
    const container = document.getElementById('pagination-controls');
    
    if (totalPages <= 1) {
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    container.innerHTML = '';
    
    // Info text
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const info = document.createElement('div');
    info.className = 'text-white text-sm';
    info.textContent = `Showing ${startItem}-${endItem} of ${totalItems} invoices`;
    container.appendChild(info);
    
    // Buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'flex gap-2 flex-wrap';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white transition`;
    prevBtn.textContent = '← Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderSalesReports();
        }
    };
    buttonsDiv.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white transition';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => {
            currentPage = 1;
            renderSalesReports();
        };
        buttonsDiv.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'text-white px-2';
            dots.textContent = '...';
            buttonsDiv.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-purple-600' : 'bg-white/20 hover:bg-white/30'} text-white transition`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            renderSalesReports();
        };
        buttonsDiv.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'text-white px-2';
            dots.textContent = '...';
            buttonsDiv.appendChild(dots);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white transition';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => {
            currentPage = totalPages;
            renderSalesReports();
        };
        buttonsDiv.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white transition`;
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderSalesReports();
        }
    };
    buttonsDiv.appendChild(nextBtn);
    
    container.appendChild(buttonsDiv);
}

function downloadInvoice(invoiceId) {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('RESTAURANT INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.id}`, 20, 35);
    doc.text(`Date: ${invoice.date}`, 20, 42);
    
    doc.setFontSize(12);
    doc.text('Item', 20, 55);
    doc.text('Qty', 110, 55);
    doc.text('Price', 135, 55);
    doc.text('Total', 165, 55);
    doc.line(20, 58, 190, 58);
    
    let y = 68;
    invoice.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        doc.setFontSize(10);
        doc.text(item.name, 20, y);
        doc.text(item.quantity.toString(), 110, y);
        doc.text(`Rs.${item.price.toFixed(2)}`, 135, y);
        doc.text(`Rs.${itemTotal.toFixed(2)}`, 165, y);
        y += 10;
    });
    
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(12);
    doc.text('TOTAL:', 135, y);
    doc.text(`Rs.${invoice.total.toFixed(2)}`, 165, y);
    doc.setFontSize(10);
    doc.text('Thank you for your order!', 105, y + 20, { align: 'center' });
    
    doc.save(`invoice-${invoice.id}.pdf`);
}

function deleteInvoice(invoiceId) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    invoices = invoices.filter(inv => inv.id !== invoiceId);
    saveInvoices();
    renderSalesReports();
    showToast('Invoice deleted successfully', 'success');
}

function clearAllReports() {
    if (!confirm('Are you sure you want to clear all reports? This cannot be undone.')) return;
    
    invoices = [];
    saveInvoices();
    renderSalesReports();
    showToast('All reports cleared', 'success');
}

function exportCSV() {
    const filteredInvoices = getFilteredInvoices();
    
    if (filteredInvoices.length === 0) {
        showToast('No data to export', 'error');
        return;
    }
    
    // Get all unique item names across filtered invoices
    const allItemNames = new Set();
    filteredInvoices.forEach(invoice => {
        invoice.items.forEach(item => {
            allItemNames.add(item.name);
        });
    });
    
    const itemNamesArray = Array.from(allItemNames).sort();
    
    // Create CSV header
    let csv = 'Invoice Number,Date,';
    itemNamesArray.forEach(itemName => {
        csv += `${itemName} (Qty),`;
    });
    csv += 'Total Amount\n';
    
    // Add data rows
    filteredInvoices.forEach(invoice => {
        csv += `"${invoice.id}","${invoice.date}",`;
        
        // For each item column, add the quantity (or 0 if not in this invoice)
        itemNamesArray.forEach(itemName => {
            const item = invoice.items.find(i => i.name === itemName);
            csv += item ? item.quantity : 0;
            csv += ',';
        });
        
        csv += `${invoice.total}\n`;
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Add filter type to filename
    const filterSuffix = currentFilter !== 'all' ? `-${currentFilter}` : '';
    a.download = `sales-report${filterSuffix}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Report exported successfully', 'success');
}

// Page navigation
function showMenu() {
    document.getElementById('menu-page').classList.remove('hidden');
    document.getElementById('manage-menu-page').classList.add('hidden');
    document.getElementById('sales-reports-page').classList.add('hidden');
    closeMobileMenu();
}

function showManageMenu() {
    document.getElementById('menu-page').classList.add('hidden');
    document.getElementById('manage-menu-page').classList.remove('hidden');
    document.getElementById('sales-reports-page').classList.add('hidden');
    renderManageMenu();
    closeMobileMenu();
}

function showSalesReports() {
    document.getElementById('menu-page').classList.add('hidden');
    document.getElementById('manage-menu-page').classList.add('hidden');
    document.getElementById('sales-reports-page').classList.remove('hidden');
    renderSalesReports();
    closeMobileMenu();
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadData();
    renderMenu();
    renderCart();
});