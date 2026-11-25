// Mock Data cho Tài khoản
let accounts = [
    { id: 'ACC001', username: 'admin', name: 'Nguyễn Thị Thanh Tâm', role: 'Quản trị viên', status: 'active', phone: '0901234567', email: 'tam.ntt@example.com', lastLogin: '08:30 10/08/2026', ip: '192.168.1.5' },
    { id: 'ACC002', username: 'gv.nguyenvananh', name: 'Nguyễn Văn Anh', role: 'Giáo viên', status: 'active', phone: '0901111111', email: 'anh.nv@example.com', lastLogin: '09:15 09/08/2026', ip: '192.168.1.12' },
    { id: 'ACC003', username: 'gv.tranthibich', name: 'Trần Thị Bích', role: 'Giáo viên', status: 'locked', phone: '0902222222', email: 'bich.tt@example.com', lastLogin: '14:20 01/08/2026', ip: '192.168.1.45' },
    { id: 'ACC004', username: 'thungan01', name: 'Lê Minh Tuấn', role: 'Thu ngân', status: 'active', phone: '0905555555', email: 'tuan.lm@example.com', lastLogin: '07:45 10/08/2026', ip: '192.168.1.100' },
    { id: 'ACC005', username: 'hs.phamthidung', name: 'Phạm Thu Dung', role: 'Học sinh', status: 'active', phone: '0904444444', email: 'dung.pt@example.com', lastLogin: '18:30 08/08/2026', ip: '192.168.1.200' },
];

// Mock Data: Profiles without accounts
let pendingProfiles = [
    { id: 'HS009', name: 'Nguyễn Minh Tuấn', role: 'Học sinh', phone: '0912 345 678', email: 'tuan.nm@gmail.com' },
    { id: 'HS010', name: 'Trần Thị Bảo Châu', role: 'Học sinh', phone: '0987 654 321', email: 'chau.ttb@gmail.com' },
    { id: 'GV011', name: 'Lê Văn Hùng', role: 'Giáo viên', phone: '0905 111 222', email: 'hung.lv@hoathaotien.edu.vn' },
    { id: 'PH012', name: 'Phạm Thị Thu Hà', role: 'Phụ huynh', phone: '0938 777 888', email: 'ha.ptt@gmail.com' },
    { id: 'GV013', name: 'Võ Quang Vinh', role: 'Giáo viên', phone: '0963 222 333', email: 'vinh.vq@hoathaotien.edu.vn' },
    { id: 'HS014', name: 'Đinh Thị Ngọc Mai', role: 'Học sinh', phone: '0901 444 555', email: 'mai.dtn@gmail.com' },
];

let selectedAccountId = null;
let confirmActionType = null; // 'lock' or 'unlock'

// DOM Elements
const tbody = document.getElementById('account-table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const roleFilter = document.getElementById('role-filter');
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statLocked = document.getElementById('stat-locked');
const rightPanel = document.getElementById('detail-panel');

// Create Modal DOM Elements
const createProfileTable = document.getElementById('create-profile-table-body');
const createSearchInput = document.getElementById('create-search-input');
const createRoleFilter = document.getElementById('create-role-filter');
const createCount = document.getElementById('create-profile-count');

// Initialize
function init() {
    renderTable();
    updateStats();

    // Event Listeners for Main View
    searchInput.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
    roleFilter.addEventListener('change', renderTable);

    // Event Listeners for Create Modal
    createSearchInput.addEventListener('input', renderCreateProfileTable);
    createRoleFilter.addEventListener('change', renderCreateProfileTable);
}

// Helpers
function generateId() {
    const maxId = accounts.reduce((max, acc) => {
        const num = parseInt(acc.id.replace('ACC', ''));
        return num > max ? num : max;
    }, 0);
    return `ACC${(maxId + 1).toString().padStart(3, '0')}`;
}

function getInitials(name) {
    const words = name.split(' ');
    if (words.length > 1) {
        return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function getRoleBadgeClass(role) {
    if (role === 'Học sinh') return 'role-student';
    if (role === 'Giáo viên') return 'role-teacher';
    if (role === 'Phụ huynh') return 'role-parent';
    return 'role-student'; // default
}

function generateUsername(name) {
    // Basic logic: tuannm from Nguyễn Minh Tuấn
    const words = name.toLowerCase().split(' ');
    let un = words[words.length - 1]; // last name
    for (let i = 0; i < words.length - 1; i++) {
        un += words[i].charAt(0);
    }
    // Remove vietnamese accents
    un = un.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    
    // Check for duplicates
    let baseUn = un;
    let counter = 1;
    while(accounts.some(acc => acc.username === un)) {
        un = baseUn + counter;
        counter++;
    }
    
    return un;
}

function generatePassword() {
    return 'Tmp@' + Math.floor(100000 + Math.random() * 900000);
}

// MAIN RENDER (List View)
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = statusFilter.value;
    const filterRole = roleFilter.value;

    const filtered = accounts.filter(acc => {
        const matchSearch = acc.name.toLowerCase().includes(searchTerm) || acc.username.toLowerCase().includes(searchTerm);
        const matchStatus = filterStatus === 'all' || acc.status === filterStatus;
        const matchRole = filterRole === 'all' || acc.role === filterRole;
        return matchSearch && matchStatus && matchRole;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy kết quả</td></tr>`;
        return;
    }

    filtered.forEach(acc => {
        const tr = document.createElement('tr');
        if (selectedAccountId === acc.id) {
            tr.style.backgroundColor = 'var(--bg-color)';
        }

        const statusHtml = acc.status === 'active' 
            ? '<span class="status-badge status-active">Đang hoạt động</span>'
            : '<span class="status-badge status-inactive">Bị khóa</span>';

        tr.innerHTML = `
            <td style="font-weight: 500;">${acc.username}</td>
            <td>${acc.name}</td>
            <td>${acc.role}</td>
            <td>${statusHtml}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="openDetailPanel('${acc.id}')" title="Xem chi tiết">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    ${acc.status === 'active' ? `
                    <button class="btn-icon delete" onclick="openConfirmModal('${acc.id}', 'lock')" title="Khóa tài khoản">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </button>
                    ` : `
                    <button class="btn-icon" style="color: var(--icon-color-green);" onclick="openConfirmModal('${acc.id}', 'unlock')" title="Mở khóa tài khoản">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                    </button>
                    `}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStats() {
    statTotal.textContent = accounts.length;
    statActive.textContent = accounts.filter(a => a.status === 'active').length;
    statLocked.textContent = accounts.filter(a => a.status === 'locked').length;
}

// Right Panel Logic
function openDetailPanel(id) {
    selectedAccountId = id;
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    document.getElementById('detail-avatar').textContent = getInitials(acc.name);
    document.getElementById('detail-name').textContent = acc.name;
    document.getElementById('detail-role').textContent = acc.role;
    document.getElementById('detail-username').textContent = acc.username;
    document.getElementById('detail-phone').textContent = acc.phone || 'Chưa cập nhật';
    document.getElementById('detail-email').textContent = acc.email || 'Chưa cập nhật';
    document.getElementById('detail-last-login').textContent = acc.lastLogin;
    document.getElementById('detail-ip').textContent = acc.ip;

    const actionsContainer = document.getElementById('detail-actions');
    if (acc.status === 'active') {
        actionsContainer.innerHTML = `
            <button class="btn btn-outline" style="color: #ef4444; border-color: #ef4444;" onclick="openConfirmModal('${acc.id}', 'lock')">Khóa tài khoản</button>
            <button class="btn btn-outline" onclick="resetPassword('${acc.id}')">Cấp lại mật khẩu</button>
        `;
    } else {
        actionsContainer.innerHTML = `
            <button class="btn btn-primary" style="background-color: var(--icon-color-green); border-color: var(--icon-color-green);" onclick="openConfirmModal('${acc.id}', 'unlock')">Mở khóa tài khoản</button>
        `;
    }

    rightPanel.classList.add('open');
    renderTable(); 
}

function closeDetailPanel() {
    selectedAccountId = null;
    rightPanel.classList.remove('open');
    renderTable(); 
}

// Create Account Modal Logic
function openCreateModal() {
    // Reset search
    createSearchInput.value = '';
    createRoleFilter.value = 'all';
    
    renderCreateProfileTable();
    document.getElementById('create-modal').classList.add('active');
}

function closeCreateModal() {
    document.getElementById('create-modal').classList.remove('active');
}

function renderCreateProfileTable() {
    const searchTerm = createSearchInput.value.toLowerCase();
    const filterRole = createRoleFilter.value;

    const filtered = pendingProfiles.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm) || 
                            p.id.toLowerCase().includes(searchTerm) ||
                            p.phone.includes(searchTerm) ||
                            p.email.toLowerCase().includes(searchTerm);
        const matchRole = filterRole === 'all' || p.role === filterRole;
        return matchSearch && matchRole;
    });

    createProfileTable.innerHTML = '';
    createCount.textContent = pendingProfiles.length;
    
    if (filtered.length === 0) {
        createProfileTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy hồ sơ phù hợp</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const tr = document.createElement('tr');
        const badgeClass = getRoleBadgeClass(p.role);

        tr.innerHTML = `
            <td style="color: var(--text-muted);">${p.id}</td>
            <td style="font-weight: 500;">${p.name}</td>
            <td><span class="role-badge ${badgeClass}">${p.role}</span></td>
            <td>${p.phone}</td>
            <td>${p.email}</td>
            <td style="text-align: right;">
                <button class="btn btn-primary" style="padding: 4px 12px; font-size: 0.8rem;" onclick="handleCreateAccount('${p.id}')">Tạo</button>
            </td>
        `;
        createProfileTable.appendChild(tr);
    });
}

// Handle the actual creation process
function handleCreateAccount(profileId) {
    const profileIndex = pendingProfiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) return;
    
    const profile = pendingProfiles[profileIndex];

    // Simulate error for specific user (e.g., Lê Văn Hùng)
    if (profile.name === 'Lê Văn Hùng') {
        closeCreateModal();
        showErrorCreateModal(profile.name, profile.role);
        return;
    }

    // Success logic
    const username = generateUsername(profile.name);
    const password = generatePassword();

    // Create new account object
    const newAcc = {
        id: generateId(),
        username: username,
        name: profile.name,
        role: profile.role,
        status: 'active',
        phone: profile.phone,
        email: profile.email,
        lastLogin: 'Chưa đăng nhập',
        ip: ''
    };

    // Add to accounts array
    accounts.unshift(newAcc);
    
    // Remove from pending
    pendingProfiles.splice(profileIndex, 1);

    // Update UI
    closeCreateModal();
    renderTable();
    updateStats();
    
    // Show success modal
    showSuccessCreateModal(username, password, profile.role);
}

// Success Modal
function showSuccessCreateModal(username, password, role, isReset = false) {
    if (isReset) {
        document.getElementById('success-modal-title').textContent = 'Cấp lại mật khẩu thành công';
        document.getElementById('success-modal-desc').textContent = 'Mật khẩu mới đã được khởi tạo và gửi qua Email';
    } else {
        document.getElementById('success-modal-title').textContent = 'Tạo tài khoản thành công';
        document.getElementById('success-modal-desc').textContent = 'Thông tin đăng nhập đã được gửi qua Email';
    }

    document.getElementById('success-username').textContent = username;
    document.getElementById('success-password').textContent = password;
    
    const badgeHtml = `<span class="role-badge ${getRoleBadgeClass(role)}">${role}</span>`;
    document.getElementById('success-role').innerHTML = badgeHtml;

    document.getElementById('success-create-modal').classList.add('active');
}

function resetPassword(accountId) {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;
    
    const newPassword = generatePassword();
    showSuccessCreateModal(acc.username, newPassword, acc.role, true);
    showToast('Đã cấp lại mật khẩu thành công', 'success');
}

function closeSuccessCreateModal() {
    document.getElementById('success-create-modal').classList.remove('active');
}

// Error Modal
function showErrorCreateModal(name, role) {
    document.getElementById('error-name').textContent = name;
    
    const badgeHtml = `<span class="role-badge ${getRoleBadgeClass(role)}">${role}</span>`;
    document.getElementById('error-role').innerHTML = badgeHtml;

    document.getElementById('error-create-modal').classList.add('active');
}

function closeErrorCreateModal() {
    document.getElementById('error-create-modal').classList.remove('active');
}

// Confirm Modal Logic (Lock/Unlock)
function openConfirmModal(id, type) {
    confirmActionType = type;
    selectedAccountId = id; 
    
    const titleEl = document.getElementById('confirm-title');
    const descEl = document.getElementById('confirm-desc');
    const iconContainer = document.getElementById('confirm-icon');
    const btn = document.getElementById('confirm-btn');

    if (type === 'lock') {
        titleEl.textContent = 'Khóa tài khoản';
        descEl.textContent = 'Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ không thể đăng nhập vào hệ thống.';
        iconContainer.style.backgroundColor = '#fee2e2';
        iconContainer.style.color = '#ef4444';
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        btn.textContent = 'Khóa tài khoản';
        btn.className = 'btn btn-danger';
    } else {
        titleEl.textContent = 'Mở khóa tài khoản';
        descEl.textContent = 'Bạn có chắc chắn muốn mở khóa tài khoản này? Người dùng sẽ có thể đăng nhập lại bình thường.';
        iconContainer.style.backgroundColor = '#dcfce7';
        iconContainer.style.color = 'var(--icon-color-green)';
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>';
        btn.textContent = 'Mở khóa';
        btn.className = 'btn btn-primary';
        btn.style.backgroundColor = 'var(--icon-color-green)';
        btn.style.borderColor = 'var(--icon-color-green)';
    }

    document.getElementById('confirm-modal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
    
    const btn = document.getElementById('confirm-btn');
    btn.className = 'btn btn-primary';
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
}

document.getElementById('confirm-btn').addEventListener('click', function() {
    if (selectedAccountId && confirmActionType) {
        const index = accounts.findIndex(a => a.id === selectedAccountId);
        if (index !== -1) {
            if (confirmActionType === 'lock') {
                accounts[index].status = 'locked';
                showToast('Đã khóa tài khoản thành công', 'success');
            } else {
                accounts[index].status = 'active';
                showToast('Đã mở khóa tài khoản thành công', 'success');
            }
            
            renderTable();
            updateStats();
            
            if (rightPanel.classList.contains('open')) {
                openDetailPanel(selectedAccountId);
            }
        }
    }
    closeConfirmModal();
});

// Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
        iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if(toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Run init on load
window.addEventListener('DOMContentLoaded', init);
