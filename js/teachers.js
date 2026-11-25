// Mock Data cho Giáo viên
let teachers = [
    { id: 'GV001', name: 'Nguyễn Văn Anh', phone: '0901111111', email: 'anh.nv@example.com', address: 'Hà Nội', specialty: 'Toán học', degree: 'Cử nhân SP Toán', status: 'active', dob: '1985-05-15', gender: 'Nam', idCard: '001085000111', startDate: '2020-08-01', notes: 'Giáo viên chủ nhiệm lớp 6A', classes: ['Toán 6A', 'Toán 7B'] },
    { id: 'GV002', name: 'Trần Thị Bích', phone: '0902222222', email: 'bich.tt@example.com', address: 'Đà Nẵng', specialty: 'Tiếng Anh', degree: 'Cử nhân Sư phạm Anh', status: 'active', dob: '1990-10-20', gender: 'Nữ', idCard: '001090000222', startDate: '2021-08-15', notes: '', classes: ['Tiếng Anh 7B'] },
    { id: 'GV003', name: 'Lê Hoàng Cường', phone: '0903333333', email: 'cuong.lh@example.com', address: 'Hải Phòng', specialty: 'Vật lý', degree: 'Thạc sĩ Vật lý', status: 'active', dob: '1988-02-28', gender: 'Nam', idCard: '001088000333', startDate: '2019-05-10', notes: '', classes: ['Vật lý 8C'] },
    { id: 'GV004', name: 'Phạm Thu Dung', phone: '0904444444', email: 'dung.pt@example.com', address: 'TP HCM', specialty: 'Hóa học', degree: 'Cử nhân Hóa học', status: 'inactive', dob: '1992-07-05', gender: 'Nữ', idCard: '001092000444', startDate: '2022-01-10', notes: 'Nghỉ thai sản', classes: [] },
    { id: 'GV005', name: 'Hoàng Minh Tuấn', phone: '0905555555', email: 'tuan.hm@example.com', address: 'Cần Thơ', specialty: 'Toán học', degree: 'Tiến sĩ Toán', status: 'active', dob: '1987-12-12', gender: 'Nam', idCard: '001087000555', startDate: '2020-08-01', notes: '', classes: [] }
];

let deleteTargetId = null;
let currentViewTeacherId = null;

// DOM Elements
const tbody = document.getElementById('teacher-table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const specialtyFilter = document.getElementById('specialty-filter');
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statInactive = document.getElementById('stat-inactive');
const breadcrumb = document.getElementById('breadcrumb-text');

// Forms
const formCreate = document.getElementById('create-teacher-form');
const formEdit = document.getElementById('edit-teacher-form');

// Initialize
function init() {
    renderTable();
    updateStats();

    // Event Listeners
    searchInput.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
    specialtyFilter.addEventListener('change', renderTable);
    
    if(formCreate) formCreate.addEventListener('submit', handleCreateSubmit);
    if(formEdit) formEdit.addEventListener('submit', handleEditSubmit);
}

// Format date to DD/MM/YYYY
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Generate new ID
function generateId() {
    if (teachers.length === 0) return 'GV001';
    const maxId = teachers.reduce((max, teacher) => {
        const num = parseInt(teacher.id.replace('GV', ''));
        return num > max ? num : max;
    }, 0);
    return `GV${(maxId + 1).toString().padStart(3, '0')}`;
}

// Render Table
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterStatus = statusFilter.value;
    const filterSpecialty = specialtyFilter.value;

    const filtered = teachers.filter(teacher => {
        // BR2-13: Tìm kiếm theo Mã, Họ tên, SĐT, Email
        const matchSearch = teacher.name.toLowerCase().includes(searchTerm) || 
                            teacher.id.toLowerCase().includes(searchTerm) ||
                            teacher.phone.includes(searchTerm) ||
                            teacher.email.toLowerCase().includes(searchTerm);
                            
        // BR2-14: Lọc theo Môn giảng dạy, Trạng thái
        const matchStatus = filterStatus === 'all' || teacher.status === filterStatus;
        const matchSpecialty = filterSpecialty === 'all' || teacher.specialty === filterSpecialty;
        
        return matchSearch && matchStatus && matchSpecialty;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy kết quả phù hợp</td></tr>`;
        return;
    }

    filtered.forEach(teacher => {
        const tr = document.createElement('tr');
        
        const statusHtml = teacher.status === 'active' 
            ? '<span class="status-badge status-active">Đang hoạt động</span>'
            : '<span class="status-badge status-inactive">Nghỉ việc</span>';

        tr.innerHTML = `
            <td>${teacher.id}</td>
            <td style="font-weight: 500;">${teacher.name}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.email}</td>
            <td>${teacher.specialty}</td>
            <td>${statusHtml}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="showDetailView('${teacher.id}')" title="Xem chi tiết" style="color: var(--primary-light);">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button class="btn-icon" onclick="showForm('edit', '${teacher.id}')" title="Sửa">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button class="btn-icon delete" onclick="openDeleteModal('${teacher.id}')" title="Xóa">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update Stats Cards
function updateStats() {
    statTotal.textContent = teachers.length;
    statActive.textContent = teachers.filter(t => t.status === 'active').length;
    statInactive.textContent = teachers.filter(t => t.status === 'inactive').length;
}

// Show Views (SPA logic)
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    if (viewId === 'view-list') {
        breadcrumb.innerHTML = 'Quản lý giáo viên';
    }
}

// Show Detail View
function showDetailView(id) {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;

    currentViewTeacherId = id;
    
    document.getElementById('v-name').textContent = teacher.name;
    document.getElementById('v-id').textContent = teacher.id;
    document.getElementById('v-status').textContent = teacher.status === 'active' ? 'Đang hoạt động' : 'Nghỉ việc';
    document.getElementById('v-status').className = teacher.status === 'active' ? 'status-badge status-active' : 'status-badge status-inactive';

    document.getElementById('v-gender').textContent = teacher.gender;
    document.getElementById('v-dob').textContent = formatDate(teacher.dob);
    document.getElementById('v-idcard').textContent = teacher.idCard;
    document.getElementById('v-address').textContent = teacher.address || 'Chưa cập nhật';
    document.getElementById('v-startdate').textContent = formatDate(teacher.startDate) || 'Chưa cập nhật';
    
    document.getElementById('v-phone').textContent = teacher.phone;
    document.getElementById('v-email').textContent = teacher.email;
    document.getElementById('v-specialty').textContent = teacher.specialty;
    document.getElementById('v-degree').textContent = teacher.degree || 'Chưa cập nhật';
    
    document.getElementById('v-classes').textContent = teacher.classes && teacher.classes.length > 0 ? teacher.classes.join(', ') : 'Chưa phân công';
    document.getElementById('v-notes').textContent = teacher.notes || 'Không có ghi chú';

    breadcrumb.innerHTML = `<a href="#" onclick="showView('view-list')" style="color:var(--text-muted); text-decoration:none;">Quản lý giáo viên</a> &nbsp;/&nbsp; Xem chi tiết`;
    showView('view-detail');
}

function triggerEditFromDetail() {
    if (currentViewTeacherId) {
        showForm('edit', currentViewTeacherId);
    }
}

// Show Form (Add / Edit)
function showForm(mode, id = null) {
    if (mode === 'add') {
        showView('view-create');
        formCreate.reset();
        breadcrumb.innerHTML = '<a href="#" onclick="showView(\'view-list\')" style="color:var(--text-muted); text-decoration:none;">Quản lý giáo viên</a> &nbsp;/&nbsp; Thêm giáo viên';
    } else {
        showView('view-edit');
        breadcrumb.innerHTML = '<a href="#" onclick="showView(\'view-list\')" style="color:var(--text-muted); text-decoration:none;">Quản lý giáo viên</a> &nbsp;/&nbsp; Chỉnh sửa thông tin';
        
        const teacher = teachers.find(t => t.id === id);
        if (teacher) {
            document.getElementById('e-teacher-id').value = teacher.id;
            document.getElementById('e-code').value = teacher.id;
            document.getElementById('e-status').value = teacher.status;
            document.getElementById('e-fullname').value = teacher.name;
            document.getElementById('e-dob').value = teacher.dob;
            document.getElementById('e-gender').value = teacher.gender;
            document.getElementById('e-id-card').value = teacher.idCard;
            document.getElementById('e-start-date').value = teacher.startDate;
            document.getElementById('e-phone').value = teacher.phone;
            document.getElementById('e-email').value = teacher.email;
            document.getElementById('e-address').value = teacher.address;
            document.getElementById('e-specialty').value = teacher.specialty;
            document.getElementById('e-degree').value = teacher.degree;
            document.getElementById('e-notes').value = teacher.notes;
            
            // Lớp phụ trách (read-only)
            const classesHtml = teacher.classes && teacher.classes.length > 0 
                ? teacher.classes.map(c => `<span class="status-badge" style="background: white; border: 1px solid #bfdbfe; margin-right: 4px; margin-bottom: 4px;">${c}</span>`).join('')
                : 'Chưa được phân công lớp';
            document.getElementById('e-classes-info').innerHTML = classesHtml;
        }
    }
}

// Validate unique Email & Phone
function validateUnique(email, phone, ignoreId = null) {
    const isEmailExist = teachers.some(t => t.email === email && t.id !== ignoreId);
    if (isEmailExist) {
        showToast('Email này đã tồn tại trong hệ thống.', 'error');
        return false;
    }
    
    const isPhoneExist = teachers.some(t => t.phone === phone && t.id !== ignoreId);
    if (isPhoneExist) {
        showToast('Số điện thoại này đã tồn tại trong hệ thống.', 'error');
        return false;
    }
    
    // Check phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
        showToast('Số điện thoại không hợp lệ.', 'error');
        return false;
    }
    
    return true;
}

// Handle Form Submit Create
function handleCreateSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('c-email').value;
    const phone = document.getElementById('c-phone').value;

    if (!validateUnique(email, phone)) return;

    const teacherData = {
        id: generateId(),
        name: document.getElementById('c-fullname').value,
        dob: document.getElementById('c-dob').value,
        gender: document.getElementById('c-gender').value,
        idCard: document.getElementById('c-id-card').value,
        startDate: document.getElementById('c-start-date').value,
        phone: phone,
        email: email,
        address: document.getElementById('c-address').value,
        specialty: document.getElementById('c-specialty').value,
        degree: document.getElementById('c-degree').value,
        notes: document.getElementById('c-notes').value,
        status: 'active',
        classes: []
    };

    teachers.unshift(teacherData);
    showToast('Thêm giáo viên thành công!', 'success');
    
    renderTable();
    updateStats();
    showView('view-list');
}

// Handle Form Submit Edit
function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('e-teacher-id').value;
    const email = document.getElementById('e-email').value;
    const phone = document.getElementById('e-phone').value;

    if (!validateUnique(email, phone, id)) return;

    const index = teachers.findIndex(t => t.id === id);
    if (index !== -1) {
        teachers[index].status = document.getElementById('e-status').value;
        teachers[index].name = document.getElementById('e-fullname').value;
        teachers[index].dob = document.getElementById('e-dob').value;
        teachers[index].gender = document.getElementById('e-gender').value;
        teachers[index].idCard = document.getElementById('e-id-card').value;
        teachers[index].startDate = document.getElementById('e-start-date').value;
        teachers[index].phone = phone;
        teachers[index].email = email;
        teachers[index].address = document.getElementById('e-address').value;
        teachers[index].specialty = document.getElementById('e-specialty').value;
        teachers[index].degree = document.getElementById('e-degree').value;
        teachers[index].notes = document.getElementById('e-notes').value;

        showToast('Cập nhật thông tin thành công!', 'success');
    }

    renderTable();
    updateStats();
    showView('view-list');
}

// Delete Modal Logic
function openDeleteModal(id) {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    
    // BR2-10: Không được xóa giáo viên đang dạy lớp
    if (teacher.classes && teacher.classes.length > 0) {
        openErrorModal(`Giáo viên đang được phân công dạy lớp (${teacher.classes.join(', ')}). Vui lòng chuyển giáo viên phụ trách trước khi xóa.`);
        return;
    }

    deleteTargetId = id;
    document.getElementById('delete-teacher-name').textContent = teacher.name;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.remove('active');
}

function openErrorModal(msg) {
    document.getElementById('error-modal-msg').textContent = msg;
    document.getElementById('error-modal').classList.add('active');
}

function closeErrorModal() {
    document.getElementById('error-modal').classList.remove('active');
}

function confirmDelete() {
    if (deleteTargetId) {
        teachers = teachers.filter(t => t.id !== deleteTargetId);
        renderTable();
        updateStats();
        showToast('Xóa giáo viên thành công!', 'success');
    }
    closeDeleteModal();
}

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
