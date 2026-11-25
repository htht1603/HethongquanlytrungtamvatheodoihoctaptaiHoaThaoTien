// Mock Data
let subjectsData = [
    { code: 'TOAN10', name: 'Toán học Đại số 10', grade: 'Khối 10', status: 'active', desc: 'Chương trình chuẩn của BGD' },
    { code: 'ENG11', name: 'Tiếng Anh giao tiếp', grade: 'Khối 11', status: 'active', desc: 'Luyện kỹ năng nghe nói' },
    { code: 'LIT12', name: 'Ngữ văn cơ bản 12', grade: 'Khối 12', status: 'active', desc: 'Luyện thi Đại học' },
    { code: 'PHY10', name: 'Vật lý 10', grade: 'Khối 10', status: 'inactive', desc: '' },
    { code: 'CHEM11', name: 'Hóa học Hữu cơ 11', grade: 'Khối 11', status: 'active', desc: '' },
    { code: 'BIO12', name: 'Sinh học 12', grade: 'Khối 12', status: 'active', desc: '' }
];

// Mock dependencies (giả lập môn học đang được sử dụng)
const subjectsInUse = ['TOAN10', 'ENG11', 'LIT12'];

let currentEditCode = null;
let currentDeleteCode = null;

// DOM Elements
const listView = document.getElementById('list-view');
const createView = document.getElementById('create-view');
const editView = document.getElementById('edit-view');
const tbody = document.getElementById('subject-tbody');
const toastContainer = document.getElementById('toast-container');
const searchInput = document.getElementById('search-input');
const gradeFilter = document.getElementById('grade-filter');

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    
    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (gradeFilter) gradeFilter.addEventListener('change', renderTable);
});

// Navigation
function showListView() {
    createView.classList.remove('active');
    editView.classList.remove('active');
    setTimeout(() => {
        createView.style.display = 'none';
        editView.style.display = 'none';
        listView.style.display = 'block';
        setTimeout(() => listView.classList.add('active'), 10);
    }, 300);
}

function showCreateView() {
    listView.classList.remove('active');
    editView.classList.remove('active');
    document.getElementById('create-form').reset();
    
    // reset radio UI
    document.getElementById('c-r-active').classList.add('active');
    document.getElementById('c-r-inactive').classList.remove('active');
    document.querySelector('input[name="c-status"][value="active"]').checked = true;

    setTimeout(() => {
        listView.style.display = 'none';
        editView.style.display = 'none';
        createView.style.display = 'block';
        setTimeout(() => createView.classList.add('active'), 10);
    }, 300);
}

function showEditView(code) {
    const subj = subjectsData.find(s => s.code === code);
    if (!subj) return;

    currentEditCode = code;
    
    // Fill data
    document.getElementById('e-title-code').textContent = subj.code;
    document.getElementById('e-name').value = subj.name;
    document.getElementById('e-code').value = subj.code;
    document.getElementById('e-grade').value = subj.grade;
    document.getElementById('e-desc').value = subj.desc || '';
    
    // Status radio
    const radioActive = document.getElementById('e-r-active');
    const radioInactive = document.getElementById('e-r-inactive');
    
    if (subj.status === 'active') {
        radioActive.classList.add('active');
        radioInactive.classList.remove('active');
        document.querySelector('input[name="e-status"][value="active"]').checked = true;
    } else {
        radioInactive.classList.add('active');
        radioActive.classList.remove('active');
        document.querySelector('input[name="e-status"][value="inactive"]').checked = true;
    }

    listView.classList.remove('active');
    createView.classList.remove('active');

    setTimeout(() => {
        listView.style.display = 'none';
        createView.style.display = 'none';
        editView.style.display = 'block';
        setTimeout(() => editView.classList.add('active'), 10);
    }, 300);
}

// Update Stats
function updateStats() {
    document.getElementById('stat-total').textContent = subjectsData.length;
    document.getElementById('stat-active').textContent = subjectsData.filter(s => s.status === 'active').length;
    document.getElementById('stat-inactive').textContent = subjectsData.filter(s => s.status === 'inactive').length;
}

// Render Table
function renderTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filterGrade = gradeFilter ? gradeFilter.value : 'all';

    const filtered = subjectsData.filter(subj => {
        const matchSearch = subj.name.toLowerCase().includes(searchTerm) || subj.code.toLowerCase().includes(searchTerm);
        const matchGrade = filterGrade === 'all' || subj.grade === filterGrade;
        return matchSearch && matchGrade;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy môn học phù hợp</td></tr>`;
    } else {
        filtered.forEach(subj => {
            const tr = document.createElement('tr');
            
            let statusHtml = '';
            if (subj.status === 'active') {
                statusHtml = '<span class="status-badge status-active">Hoạt động</span>';
            } else {
                statusHtml = '<span class="status-badge status-inactive">Tạm dừng</span>';
            }

            tr.innerHTML = `
                <td style="font-weight: 500;">${subj.code}</td>
                <td style="font-weight: 600; color: var(--text-main);">${subj.name}</td>
                <td>${subj.grade}</td>
                <td>${statusHtml}</td>
                <td style="text-align: center;">
                    <div class="action-buttons" style="justify-content: center;">
                        <button class="btn-icon" onclick="showEditView('${subj.code}')" title="Sửa">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon delete" onclick="openDeleteModal('${subj.code}')" title="Xóa" style="color: #ef4444;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateStats();
}

// Radio Interactions
function toggleCreateRadio(radio) {
    document.getElementById('c-r-active').classList.remove('active');
    document.getElementById('c-r-inactive').classList.remove('active');
    radio.closest('.status-radio').classList.add('active');
}

function toggleEditRadio(radio) {
    document.getElementById('e-r-active').classList.remove('active');
    document.getElementById('e-r-inactive').classList.remove('active');
    radio.closest('.status-radio').classList.add('active');
}

// Form Submissions
function handleCreateSubmit(isSaveAndNew, event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById('c-name').value.trim();
    const code = document.getElementById('c-code').value.trim().toUpperCase();
    const grade = document.getElementById('c-grade').value;
    
    if (!name || !code || !grade) {
        showToast("Vui lòng nhập đủ thông tin bắt buộc.", "error");
        return;
    }

    // Check unique code
    if (subjectsData.some(s => s.code === code)) {
        showToast(`Mã môn học "${code}" đã tồn tại. Vui lòng chọn mã khác.`, "error");
        return;
    }

    const status = document.querySelector('input[name="c-status"]:checked').value;
    const desc = document.getElementById('c-desc').value;

    subjectsData.unshift({ name, code, grade, status, desc });
    renderTable();
    showToast('Thêm môn học mới thành công!', 'success');

    if (isSaveAndNew) {
        document.getElementById('create-form').reset();
        document.getElementById('c-r-active').classList.add('active');
        document.getElementById('c-r-inactive').classList.remove('active');
        document.querySelector('input[name="c-status"][value="active"]').checked = true;
        document.getElementById('c-name').focus();
    } else {
        showListView();
    }
}

function handleEditSubmit() {
    const name = document.getElementById('e-name').value.trim();
    const grade = document.getElementById('e-grade').value;
    
    if (!name || !grade) {
        showToast("Vui lòng nhập đủ thông tin bắt buộc.", "error");
        return;
    }

    const status = document.querySelector('input[name="e-status"]:checked').value;
    const desc = document.getElementById('e-desc').value;

    const idx = subjectsData.findIndex(s => s.code === currentEditCode);
    if (idx !== -1) {
        subjectsData[idx].name = name;
        subjectsData[idx].grade = grade;
        subjectsData[idx].status = status;
        subjectsData[idx].desc = desc;
    }

    renderTable();
    showToast('Cập nhật môn học thành công!', 'success');
    showListView();
}

// Modals
function openDeleteModal(code) {
    if (subjectsInUse.includes(code)) {
        showToast(`Không thể xóa môn học "${code}" vì đang được sử dụng ở các lớp học hoặc phân công cho giáo viên.`, 'error');
        return;
    }

    currentDeleteCode = code;
    document.getElementById('d-subj-name').textContent = code;
    document.getElementById('delete-modal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function confirmDelete() {
    subjectsData = subjectsData.filter(s => s.code !== currentDeleteCode);
    renderTable();
    closeModal('delete-modal');
    showToast('Xóa môn học thành công!', 'success');
}

// Toast
function showToast(message, type = 'success') {
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
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
