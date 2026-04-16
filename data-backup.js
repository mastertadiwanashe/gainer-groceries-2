// Data Backup and Restore System for Gainer Groceries
class DataBackup {
    constructor() {
        // Don't run on admin dashboard
        if (window.location.pathname.includes('admin')) {
            return;
        }
        this.keys = {
            products: 'adminProducts',
            slides: 'adminSlides',
            orders: 'orders',
            customers: 'customers',
            reviews: 'reviews',
            settings: 'adminSettings'
        };
    }

    // Export all data to JSON file
    exportData() {
        const data = {};
        Object.keys(this.keys).forEach(key => {
            const value = localStorage.getItem(this.keys[key]);
            if (value) {
                data[key] = JSON.parse(value);
            }
        });
        
        // Add timestamp
        data.exportDate = new Date().toISOString();
        data.version = '1.0';
        
        return data;
    }

    // Download data as JSON file
    downloadBackup() {
        const data = this.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gainer-groceries-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Backup downloaded successfully');
        showNotification('Data backup downloaded successfully!');
    }

    // Import data from JSON file
    importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.version || !data.exportDate) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Import data to localStorage
                    Object.keys(this.keys).forEach(key => {
                        if (data[key]) {
                            localStorage.setItem(this.keys[key], JSON.stringify(data[key]));
                        }
                    });
                    
                    console.log('Data imported successfully');
                    showNotification('Data imported successfully! Refreshing page...');
                    
                    // Refresh page after 2 seconds to apply changes
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    
                    resolve(data);
                } catch (error) {
                    console.error('Import failed:', error);
                    showNotification('Import failed: ' + error.message, 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                showNotification('Failed to read backup file', 'error');
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    // Auto-save data periodically
    enableAutoSave(intervalMinutes = 5) {
        setInterval(() => {
            const data = this.exportData();
            localStorage.setItem('autoBackup', JSON.stringify(data));
            console.log('Auto-saved data at', new Date().toLocaleTimeString());
        }, intervalMinutes * 60 * 1000);
    }

    // Restore from auto-backup
    restoreAutoBackup() {
        const autoBackup = localStorage.getItem('autoBackup');
        if (autoBackup) {
            try {
                const data = JSON.parse(autoBackup);
                Object.keys(this.keys).forEach(key => {
                    if (data[key]) {
                        localStorage.setItem(this.keys[key], JSON.stringify(data[key]));
                    }
                });
                console.log('Restored from auto-backup');
                return true;
            } catch (error) {
                console.error('Auto-restore failed:', error);
                return false;
            }
        }
        return false;
    }
}

// Initialize backup system
const dataBackup = new DataBackup();

// Add backup controls to admin dashboard
function addBackupControls() {
    const adminDashboard = document.querySelector('.admin-dashboard');
    if (adminDashboard) {
        const backupSection = document.createElement('div');
        backupSection.className = 'backup-section';
        backupSection.innerHTML = `
            <h3>📦 Data Backup & Restore</h3>
            <div class="backup-controls">
                <button onclick="dataBackup.downloadBackup()" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download Backup
                </button>
                <label class="btn btn-secondary">
                    <i class="fas fa-upload"></i> Restore Backup
                    <input type="file" accept=".json" onchange="handleFileImport(event)" style="display: none;">
                </label>
                <button onclick="dataBackup.restoreAutoBackup()" class="btn btn-warning">
                    <i class="fas fa-history"></i> Restore Auto-Backup
                </button>
            </div>
            <p class="backup-info">
                <small>💡 Tip: Export your data regularly to prevent loss. Changes are stored in browser localStorage and may be lost when clearing browser data.</small>
            </p>
        `;
        
        // Insert after header
        const header = adminDashboard.querySelector('h2');
        if (header) {
            header.parentNode.insertBefore(backupSection, header.nextSibling);
        }
    }
}

// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        dataBackup.importBackup(file);
    }
}

// Add backup styles
const backupStyles = `
    .backup-section {
        background: #f8f9fa;
        padding: 20px;
        margin: 20px 0;
        border-radius: 8px;
        border: 1px solid #dee2e6;
    }
    
    .backup-controls {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin: 15px 0;
    }
    
    .backup-controls .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
    }
    
    .backup-controls .btn-primary {
        background: #007bff;
        color: white;
    }
    
    .backup-controls .btn-secondary {
        background: #6c757d;
        color: white;
    }
    
    .backup-controls .btn-warning {
        background: #ffc107;
        color: #212529;
    }
    
    .backup-controls .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .backup-info {
        color: #6c757d;
        margin-top: 10px;
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = backupStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add backup controls to admin dashboard
    setTimeout(() => {
        addBackupControls();
    }, 1000);
    
    // Enable auto-save every 5 minutes
    dataBackup.enableAutoSave(5);
    
    // Check for auto-backup on page load
    if (localStorage.getItem('autoBackup')) {
        console.log('Auto-backup available');
    }
});

// Make functions globally available
window.dataBackup = dataBackup;
window.handleFileImport = handleFileImport;
