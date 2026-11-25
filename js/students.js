// Mock Data
let students = [
    { id: 'HS001', name: 'Nguyễn Đình Khôi', dob: '2010-05-15', gender: 'Nam', class: 'Toán 6A', subject: 'Toán học', schedule: 'Ca 1', admissionDate: '2023-08-01', status: 'active', notes: '', parentName: 'Nguyễn Văn A', parentRel: 'Bố', parentPhone: '0901234567', parentEmail: '', address: 'Hà Nội', tuitionStatus: 'Đã nộp' },
    { id: 'HS002', name: 'Trần Bình Hiếu', dob: '2009-02-10', gender: 'Nam', class: 'Tiếng Anh 7B', subject: 'Tiếng Anh', schedule: 'Ca 2', admissionDate: '2022-08-15', status: 'active', notes: '', parentName: 'Trần Văn B', parentRel: 'Bố', parentPhone: '0912345678', parentEmail: '', address: 'Đà Nẵng', tuitionStatus: 'Đã nộp' },
    { id: 'HS003', name: 'Lê Thị Cẩm Tú', dob: '2010-11-20', gender: 'Nữ', class: 'Toán 6A', subject: 'Toán học', schedule: 'Ca 1', admissionDate: '2023-08-01', status: 'active', notes: '', parentName: 'Lê Văn C', parentRel: 'Mẹ', parentPhone: '0987654321', parentEmail: '', address: 'TP HCM', tuitionStatus: 'Quá hạn' },
    { id: 'HS004', name: 'Hoàng Phương Thảo', dob: '2008-07-05', gender: 'Nữ', class: '', subject: '', schedule: '', admissionDate: '2021-08-10', status: 'inactive', notes: 'Chuyển trường', parentName: 'Hoàng Văn D', parentRel: 'Bố', parentPhone: '0909090909', parentEmail: '', address: 'Hà Nội', tuitionStatus: 'Chưa nộp' }
];

let deleteTargetId = null;
let currentViewStudentId = null;

// DOM Elements
const tbody = document.getElementById('student-table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statInactive = document.getElementById('stat-inactive');
const breadcrumb = document.getElementById('breadcrumb-text');

// Forms
const formCreate = document.getElementById('create-student-form');
const formEdit = document.getElementById('edit-student-form');

// Initialize
function init() {
    renderTable();
    updateStats();

    // Event Listeners
    searchInput.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
    formCreate.addEventListener('submit', handleCreateSubmit);
    formEdit.addEventListener('submit', handleEditSubmit);
}

// Format date to DD/MM/YYYY
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Generate new ID
function generateId() {
    if (students.length === 0) return 'HS001';
    const maxId = students.reduce((max, student) => {
        const num = parseInt(student.id.replace('HS', ''));
        return num > max ? num : max;
    }, 0);
    return `HS${(maxId + 1).toString().padStart(3, '0')}`;
}

// Render Table
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = statusFilter.value;

    const filtered = students.filter(student => {
        const matchSearch = student.name.toLowerCase().includes(searchTerm) || 
                            student.id.toLowerCase().includes(searchTerm) ||
                            student.parentPhone.includes(searchTerm); // BR1-13
        const matchStatus = filterStatus === 'all' || student.status === filterStatus;
        return matchSearch && matchStatus;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy kết quả</td></tr>`;
        return;
    }

    filtered.forEach(student => {
        const tr = document.createElement('tr');
        
        const statusHtml = student.status === 'active' 
            ? '<span class="status-badge status-active">Đang học</span>'
            : '<span class="status-badge status-inactive">Nghỉ học</span>';

        let tuitionBadgeHtml = '';
        if (student.tuitionStatus) {
            if (student.tuitionStatus === 'Đã nộp') {
                tuitionBadgeHtml = '<span style="color: var(--icon-color-green); font-weight: 500;">' + student.tuitionStatus + '</span>';
            } else if (student.tuitionStatus === 'Quá hạn') {
                tuitionBadgeHtml = '<span style="color: #ef4444; font-weight: 500;">' + student.tuitionStatus + '</span>';
            } else {
                tuitionBadgeHtml = '<span style="color: var(--icon-color-yellow); font-weight: 500;">' + student.tuitionStatus + '</span>';
            }
        } else {
            tuitionBadgeHtml = '<span style="color: var(--text-muted);">Chưa áp dụng</span>';
        }

        tr.innerHTML = `
            <td>${student.id}</td>
            <td style="font-weight: 500;">${student.name}</td>
            <td>${student.class ? student.class : '<span style="color: var(--text-muted); font-style: italic;">Chưa xếp lớp</span>'}</td>
            <td>${student.parentPhone}</td>
            <td>${statusHtml}</td>
            <td>${tuitionBadgeHtml}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="showDetailView('${student.id}')" title="Xem chi tiết" style="color: var(--primary-light);">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button class="btn-icon" onclick="showForm('edit', '${student.id}')" title="Sửa">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button class="btn-icon delete" onclick="openDeleteModal('${student.id}')" title="Xóa">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update Stats Cards
function updateStats() {
    statTotal.textContent = students.length;
    statActive.textContent = students.filter(s => s.status === 'active').length;
    statInactive.textContent = students.filter(s => s.status === 'inactive').length;
}

// Show Views (SPA logic)
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    if (viewId === 'view-list') {
        breadcrumb.innerHTML = 'Quản lý học sinh';
    }
}

// Show Detail View
function showDetailView(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    currentViewStudentId = id;
    
    // Header
    document.getElementById('v-name').textContent = student.name;
    document.getElementById('v-id').textContent = student.id;
    document.getElementById('v-status').textContent = student.status === 'active' ? 'Đang học' : 'Nghỉ học';
    document.getElementById('v-status').className = student.status === 'active' ? 'status-badge status-active' : 'status-badge status-inactive';

    // Tab info
    document.getElementById('v-gender').textContent = student.gender;
    document.getElementById('v-dob').textContent = formatDate(student.dob);
    document.getElementById('v-address').textContent = student.address || 'Chưa cập nhật';
    document.getElementById('v-notes').textContent = student.notes || 'Không có';
    
    document.getElementById('v-pname').textContent = student.parentName;
    document.getElementById('v-prel').textContent = student.parentRel || 'Khác';
    document.getElementById('v-pphone').textContent = student.parentPhone;
    document.getElementById('v-pemail').textContent = student.parentEmail || 'Chưa cập nhật';

    // Tab history
    const historyList = document.getElementById('v-history-list');
    if (student.class) {
        historyList.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-title">Xếp lớp thành công</div>
                    <div class="timeline-date">Tháng 08/2023</div>
                    <div class="timeline-desc">Đã tham gia lớp ${student.class} - Môn: ${student.subject} - Ca: ${student.schedule}</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-marker" style="border-color: var(--border-color);"></div>
                <div class="timeline-content">
                    <div class="timeline-title">Nhập học</div>
                    <div class="timeline-date">${formatDate(student.admissionDate)}</div>
                    <div class="timeline-desc">Tạo hồ sơ học sinh</div>
                </div>
            </div>
        `;
    } else {
        historyList.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-marker" style="border-color: var(--border-color);"></div>
                <div class="timeline-content">
                    <div class="timeline-title">Nhập học</div>
                    <div class="timeline-date">${formatDate(student.admissionDate)}</div>
                    <div class="timeline-desc">Tạo hồ sơ học sinh. Chưa phân lớp.</div>
                </div>
            </div>
        `;
    }

    breadcrumb.innerHTML = `<a href="#" onclick="showView('view-list')" style="color:var(--text-muted); text-decoration:none;">Quản lý học sinh</a> &nbsp;/&nbsp; Xem chi tiết`;
    showView('view-detail');
}

function triggerEditFromDetail() {
    if (currentViewStudentId) {
        showForm('edit', currentViewStudentId);
    }
}

function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    btnElement.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Show Form (Add / Edit)
function showForm(mode, id = null) {
    if (mode === 'add') {
        showView('view-create');
        formCreate.reset();
        breadcrumb.innerHTML = '<a href="#" onclick="showView(\'view-list\')" style="color:var(--text-muted); text-decoration:none;">Quản lý học sinh</a> &nbsp;/&nbsp; Thêm học sinh';
    } else {
        showView('view-edit');
        breadcrumb.innerHTML = '<a href="#" onclick="showView(\'view-list\')" style="color:var(--text-muted); text-decoration:none;">Quản lý học sinh</a> &nbsp;/&nbsp; Chỉnh sửa thông tin';
        
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('e-student-id').value = student.id;
            document.getElementById('e-code').value = student.id;
            document.getElementById('e-status').value = student.status;
            document.getElementById('e-fullname').value = student.name;
            document.getElementById('e-dob').value = student.dob;
            document.getElementById('e-gender').value = student.gender;
            document.getElementById('e-address').value = student.address;
            document.getElementById('e-notes').value = student.notes;
            
            // Read-only class info
            document.getElementById('e-class-info').textContent = student.class || 'Chưa xếp lớp';
            if(student.class) {
                document.getElementById('e-subject-info').textContent = `${student.subject} - ${student.schedule}`;
            } else {
                document.getElementById('e-subject-info').textContent = 'Chưa áp dụng';
            }

            document.getElementById('e-parent-name').value = student.parentName;
            document.getElementById('e-parent-phone').value = student.parentPhone;
            document.getElementById('e-parent-rel').value = student.parentRel || 'Khác';
            document.getElementById('e-parent-email').value = student.parentEmail;
        }
    }
}

// Validation logic
function validateStudent(dobStr, phoneStr) {
    // BR1-3: Ngày sinh phải nhỏ hơn ngày hiện tại
    const dob = new Date(dobStr);
    const today = new Date();
    if (dob >= today) {
        showToast('Ngày sinh không hợp lệ. Phải nhỏ hơn ngày hiện tại.', 'error');
        return false;
    }
    
    // BR1-4: SĐT đúng định dạng (VD: 10 chữ số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneStr)) {
        showToast('Số điện thoại phụ huynh không hợp lệ.', 'error');
        return false;
    }

    return true;
}

// Handle Form Submit Create
function handleCreateSubmit(e) {
    e.preventDefault();
    
    const dob = document.getElementById('c-dob').value;
    const parentPhone = document.getElementById('c-parent-phone').value;

    if (!validateStudent(dob, parentPhone)) return;

    // BR1-8: Sau khi thêm thành công, học sinh chưa thuộc lớp nào
    const studentData = {
        id: generateId(),
        name: document.getElementById('c-fullname').value,
        dob: dob,
        gender: document.getElementById('c-gender').value,
        address: document.getElementById('c-address').value,
        notes: document.getElementById('c-notes').value,
        parentName: document.getElementById('c-parent-name').value,
        parentPhone: parentPhone,
        parentRel: document.getElementById('c-parent-rel').value,
        parentEmail: document.getElementById('c-parent-email').value,
        class: '',
        subject: '',
        schedule: '',
        status: 'active', // default
        admissionDate: new Date().toISOString().split('T')[0],
        tuitionStatus: null
    };

    students.push(studentData);
    showToast('Thêm học sinh thành công!', 'success');
    renderTable();
    updateStats();
    showView('view-list');
}

// Handle Form Submit Edit
function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('e-student-id').value;
    const dob = document.getElementById('e-dob').value;
    const parentPhone = document.getElementById('e-parent-phone').value;

    if (!validateStudent(dob, parentPhone)) return;

    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        // BR1-7: Mã học sinh không được phép chỉnh sửa
        students[index].status = document.getElementById('e-status').value;
        students[index].name = document.getElementById('e-fullname').value;
        students[index].dob = dob;
        students[index].gender = document.getElementById('e-gender').value;
        students[index].address = document.getElementById('e-address').value;
        students[index].notes = document.getElementById('e-notes').value;
        students[index].parentName = document.getElementById('e-parent-name').value;
        students[index].parentPhone = parentPhone;
        students[index].parentRel = document.getElementById('e-parent-rel').value;
        students[index].parentEmail = document.getElementById('e-parent-email').value;

        showToast('Cập nhật thông tin học sinh thành công!', 'success');
    }

    renderTable();
    updateStats();
    showView('view-list');
}

// Delete Modal Logic
function openDeleteModal(id) {
    const student = students.find(s => s.id === id);
    
    // BR1-10: Không được xóa học sinh đang tham gia lớp học
    if (student.class !== '' && student.status === 'active') {
        showToast('Học sinh đang tham gia lớp học, không thể thực hiện chức năng này', 'error');
        return;
    }

    deleteTargetId = id;
    document.getElementById('delete-student-name').textContent = student.name;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.remove('active');
}

function confirmDelete() {
    if (deleteTargetId) {
        students = students.filter(s => s.id !== deleteTargetId);
        renderTable();
        updateStats();
        showToast('Xóa thành công học sinh!', 'success');
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
