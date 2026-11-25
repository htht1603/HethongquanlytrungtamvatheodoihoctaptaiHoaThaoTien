// Mock Data for Assignments
let assignmentsData = [
    { id: 'BT001', title: 'Bài tập Đại số chương 3', class: 'Toán K8A', type: 'Tự luận', assignedDate: '20/07/2026', dueDate: '25/07/2026 23:59', submitted: 23, total: 30, status: 'Đã giao' },
    { id: 'BT002', title: 'Trắc nghiệm Hình học', class: 'Toán K8A', type: 'Trắc nghiệm', assignedDate: '22/07/2026', dueDate: '01/08/2026 23:59', submitted: 10, total: 30, status: 'Đã giao' },
    { id: 'BT003', title: 'Ôn tập cuối kỳ', class: 'Toán K9B', type: 'Tự luận', assignedDate: '01/08/2026', dueDate: '05/08/2026 23:59', submitted: 0, total: 28, status: 'Nháp' },
    { id: 'BT004', title: 'Bài kiểm tra giữa kỳ', class: 'Toán K9B', type: 'Tệp đính kèm', assignedDate: '15/07/2026', dueDate: '20/07/2026 23:59', submitted: 25, total: 28, status: 'Đã giao' },
    { id: 'BT005', title: 'Luyện tập phương trình', class: 'Toán K10C', type: 'Tự luận', assignedDate: '21/07/2026', dueDate: '26/07/2026 23:59', submitted: 29, total: 29, status: 'Đã giao' },
    { id: 'BT006', title: 'Bài tập về nhà số 5', class: 'Toán K8A', type: 'Tự luận', assignedDate: '10/07/2026', dueDate: '15/07/2026 23:59', submitted: 28, total: 30, status: 'Hết hạn' },
    { id: 'BT007', title: 'Trắc nghiệm chương 4', class: 'Toán K10C', type: 'Trắc nghiệm', assignedDate: '05/08/2026', dueDate: '10/08/2026 23:59', submitted: 0, total: 29, status: 'Nháp' },
    { id: 'BT008', title: 'Bài tập nâng cao', class: 'Toán K9B', type: 'Tệp đính kèm', assignedDate: '24/07/2026', dueDate: '03/08/2026 23:59', submitted: 4, total: 28, status: 'Đã giao' }
];

let editingId = null;
let deletingId = null;

window.addEventListener('DOMContentLoaded', () => {
    renderAssignments();

    // File input change
    document.getElementById('form-file').addEventListener('change', function(e) {
        const nameLabel = document.getElementById('file-name');
        if (this.files && this.files.length > 0) {
            nameLabel.textContent = this.files[0].name;
        } else {
            nameLabel.textContent = 'Không có tệp';
        }
    });

    // Filters
    document.getElementById('search-input').addEventListener('input', renderAssignments);
    document.getElementById('class-filter').addEventListener('change', renderAssignments);
    document.getElementById('status-filter').addEventListener('change', renderAssignments);
});

function getStatusBadge(status) {
    switch(status) {
        case 'Đã giao': return '<span class="badge badge-success">Đã giao</span>';
        case 'Nháp': return '<span class="badge badge-warning" style="background:#f1f5f9;color:#64748b;">Nháp</span>';
        case 'Hết hạn': return '<span class="badge badge-danger">Hết hạn</span>';
        default: return '';
    }
}

function getTypeBadge(type) {
    switch(type) {
        case 'Tự luận': return '<span class="type-badge type-essay">Tự luận</span>';
        case 'Trắc nghiệm': return '<span class="type-badge type-quiz">Trắc nghiệm</span>';
        case 'Tệp đính kèm': return '<span class="type-badge type-file">Tệp đính kèm</span>';
        default: return '';
    }
}

function renderAssignments() {
    const tbody = document.getElementById('assignments-tbody');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const classFilter = document.getElementById('class-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    tbody.innerHTML = '';
    
    const filtered = assignmentsData.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(searchTerm) || a.id.toLowerCase().includes(searchTerm);
        const matchClass = classFilter === 'all' || a.class === classFilter;
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchSearch && matchClass && matchStatus;
    });

    filtered.forEach(a => {
        const percent = Math.round((a.submitted / a.total) * 100) || 0;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: #64748b;">${a.id}</td>
            <td class="t-font-medium">${a.title}</td>
            <td>${a.class}</td>
            <td>${getTypeBadge(a.type)}</td>
            <td>${a.assignedDate}</td>
            <td>${a.dueDate.split(' ')[0]}</td>
            <td>
                <div class="td-progress">
                    <span>${a.submitted}/${a.total}</span>
                    <div class="td-progress-bar-bg">
                        <div class="td-progress-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                </div>
            </td>
            <td>${getStatusBadge(a.status)}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <a href="assignment_detail.html?id=${a.id}" class="action-btn" title="Xem chi tiết" style="color: #3b82f6;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </a>
                    <button class="action-btn" title="Cập nhật" style="color: #f59e0b; background: none; border: none; cursor: pointer;" onclick="openEditModal('${a.id}')">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn" title="Xóa" style="color: #ef4444; background: none; border: none; cursor: pointer;" onclick="openDeleteModal('${a.id}')">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openCreateModal() {
    editingId = null;
    document.getElementById('form-modal-title').textContent = 'Tạo bài tập mới';
    document.getElementById('assignment-form').reset();
    document.getElementById('file-name').textContent = 'Không có tệp';
    
    // Set default dates
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('form-start-date').value = now.toISOString().slice(0,16);
    
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.getElementById('form-end-date').value = nextWeek.toISOString().slice(0,16);
    
    document.getElementById('form-modal').classList.add('active');
}

function openEditModal(id) {
    editingId = id;
    const a = assignmentsData.find(x => x.id === id);
    if (!a) return;
    
    document.getElementById('form-modal-title').textContent = 'Cập nhật bài tập';
    
    document.getElementById('form-class').value = a.class;
    document.getElementById('form-title').value = a.title;
    document.getElementById('form-content').value = "Nội dung mẫu của " + a.title;
    document.getElementById('form-type').value = a.type;
    document.getElementById('file-name').textContent = 'Không có tệp';
    
    // Parse dates back to datetime-local format
    // Mock parsing for demo
    document.getElementById('form-start-date').value = "2026-07-20T08:00";
    document.getElementById('form-end-date').value = "2026-07-25T23:59";
    
    document.getElementById('form-modal').classList.add('active');
}

function closeFormModal() {
    document.getElementById('form-modal').classList.remove('active');
}

function saveAssignment(submitType) {
    const title = document.getElementById('form-title').value;
    const className = document.getElementById('form-class').value;
    const type = document.getElementById('form-type').value;
    
    const start = new Date(document.getElementById('form-start-date').value);
    const end = new Date(document.getElementById('form-end-date').value);
    
    if (end <= start) {
        showToast('Hạn nộp phải sau thời gian bắt đầu!', 'error');
        return;
    }
    
    if (editingId) {
        // Update
        const a = assignmentsData.find(x => x.id === editingId);
        if (a) {
            a.title = title;
            a.class = className;
            a.type = type;
            a.status = submitType === 'published' ? 'Đã giao' : 'Nháp';
        }
        showToast('Cập nhật bài tập thành công!', 'success');
    } else {
        // Create
        const newId = 'BT00' + (assignmentsData.length + 1);
        assignmentsData.unshift({
            id: newId,
            title: title,
            class: className,
            type: type,
            assignedDate: start.toLocaleDateString('vi-VN'),
            dueDate: end.toLocaleDateString('vi-VN') + ' ' + end.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
            submitted: 0,
            total: 30, // Mock
            status: submitType === 'published' ? 'Đã giao' : 'Nháp'
        });
        showToast(submitType === 'published' ? 'Giao bài tập thành công!' : 'Lưu nháp thành công!', 'success');
    }
    
    closeFormModal();
    renderAssignments();
}

function openDeleteModal(id) {
    deletingId = id;
    const a = assignmentsData.find(x => x.id === id);
    if (!a) return;
    
    if (a.submitted > 0) {
        showToast('Không thể xóa bài tập vì đã có học sinh nộp bài.', 'error');
        return;
    }
    
    document.getElementById('delete-target-name').textContent = a.title;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
}

function confirmDelete() {
    assignmentsData = assignmentsData.filter(a => a.id !== deletingId);
    showToast('Xóa bài tập thành công.', 'success');
    closeDeleteModal();
    renderAssignments();
}

// Toast
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else {
        iconSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    }

    toast.innerHTML = '<div class="toast-icon">' + iconSvg + '</div><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(() => {
        if(toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 4000);
}
