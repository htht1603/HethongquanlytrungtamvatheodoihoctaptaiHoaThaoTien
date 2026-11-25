// Mock Data for Classes
let classesData = [
    { id: 'L001', name: 'Toán 6A', subject: 'Toán học', grade: 'Lớp 6', year: '2024-2025', teacher: 'Trần Văn Khai', current: 24, max: 30, status: 'open', schedule: 'T2, T4 - 18:00', room: 'P.201' },
    { id: 'L002', name: 'Văn 7B', subject: 'Ngữ văn', grade: 'Lớp 7', year: '2024-2025', teacher: 'Nguyễn Thị Mai', current: 28, max: 30, status: 'open', schedule: 'T3, T5 - 19:30', room: 'P.202' },
    { id: 'L003', name: 'Anh Văn 6C', subject: 'Tiếng Anh', grade: 'Lớp 6', year: '2024-2025', teacher: 'Lê Hoàng Nam', current: 0, max: 25, status: 'closed', schedule: 'T7, CN - 09:00', room: 'P.203' },
    { id: 'L004', name: 'Toán 9A', subject: 'Toán học', grade: 'Lớp 9', year: '2024-2025', teacher: 'Phạm Minh Tuấn', current: 30, max: 30, status: 'open', schedule: 'T2, T6 - 18:00', room: 'P.204' },
    { id: 'L005', name: 'Lý 8C', subject: 'Vật lý', grade: 'Lớp 8', year: '2024-2025', teacher: 'Hà Thùy Linh', current: 22, max: 25, status: 'open', schedule: 'T3, CN - 14:00', room: 'P.205' },
    { id: 'L006', name: 'Hóa 10B', subject: 'Hóa học', grade: 'Lớp 10', year: '2024-2025', teacher: 'Đặng Quốc Huy', current: 27, max: 27, status: 'open', schedule: 'T4, T7 - 19:30', room: 'P.206' }
];

// Mock students in class L001
const mockStudentsInClass = [
    { id: 'HS002', name: 'Trần Gia Huy', dob: '15/04/2012', parentName: 'Trần Văn Mạnh', parentPhone: '0905123456', status: 'Đang học' },
    { id: 'HS005', name: 'Nguyễn Bảo Ngọc', dob: '22/08/2012', parentName: 'Nguyễn Hữu Tài', parentPhone: '0988654321', status: 'Đang học' }
];

let classToDelete = null;
let currentClassId = null;

// DOM Elements
const tbody = document.getElementById('classes-table-body');
const searchInput = document.getElementById('search-input');
const subjectFilter = document.getElementById('subject-filter');
const statusFilter = document.getElementById('status-filter');

// Views
const listView = document.getElementById('list-view');
const formView = document.getElementById('form-view');
const addStuView = document.getElementById('add-student-view');
const remStuView = document.getElementById('remove-student-view');
const detailView = document.getElementById('detail-view');

// Modals
const deleteModal = document.getElementById('delete-class-modal');
const confirmRemModal = document.getElementById('confirm-remove-modal');

// Init
function init() {
    renderTable();
    
    // Add event listeners for radio buttons in remove student view
    const radios = document.querySelectorAll('.rem-stu-radio');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('rem-stu-selected-name').textContent = e.target.value;
        });
    });

    // Set today for remove date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rem-stu-date').value = today;
}

// Format Helpers
function getStatusBadge(status) {
    switch(status) {
        case 'open': return '<span class="class-badge class-badge-open"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#16a34a;margin-right:4px;"></span>Đang mở</span>';
        case 'closed': return '<span class="class-badge class-badge-closed"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ea580c;margin-right:4px;"></span>Chưa mở</span>';
        case 'ended': return '<span class="class-badge class-badge-ended"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#64748b;margin-right:4px;"></span>Đã kết thúc</span>';
        default: return '';
    }
}

// Render Table
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterSub = subjectFilter.value;
    const filterStatus = statusFilter.value;

    const filtered = classesData.filter(cls => {
        const matchSearch = cls.name.toLowerCase().includes(searchTerm) || cls.id.toLowerCase().includes(searchTerm) || cls.teacher.toLowerCase().includes(searchTerm);
        const matchSub = filterSub === 'all' || cls.subject === filterSub;
        const matchStatus = filterStatus === 'all' || cls.status === filterStatus;
        return matchSearch && matchSub && matchStatus;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy lớp học nào</td></tr>`;
        updateStats();
        return;
    }

    filtered.forEach(cls => {
        const tr = document.createElement('tr');
        
        const isFull = cls.current >= cls.max;
        const capacityStyle = isFull ? 'color: #ea580c; font-weight: 600;' : '';

        const actionButtons = `
            <button class="btn-icon" title="Xem chi tiết" onclick="showDetailView('${cls.id}')" style="color: var(--primary-light);">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="btn-icon" title="Sửa" onclick="showFormView('edit', '${cls.id}')">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon" title="Thêm học sinh" onclick="showAddStudentView('${cls.id}')" style="color: #16a34a;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </button>
            <button class="btn-icon" title="Rút học sinh" onclick="showRemoveStudentView('${cls.id}')" style="color: #ea580c;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </button>
            <button class="btn-icon delete" title="Xóa lớp" onclick="openDeleteModal('${cls.id}')" style="color: #ef4444;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;

        tr.innerHTML = `
            <td style="color: var(--text-muted);">${cls.id}</td>
            <td style="font-weight: 500; color: var(--primary-color); cursor: pointer;" onclick="showDetailView('${cls.id}')">${cls.name}</td>
            <td>${cls.subject}</td>
            <td>${cls.teacher}</td>
            <td style="text-align: center; ${capacityStyle}">${cls.current}/${cls.max}</td>
            <td>${getStatusBadge(cls.status)}</td>
            <td style="display: flex; gap: 8px;">${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });

    updateStats();
}

function updateStats() {
    const totalCount = classesData.length;
    const openCount = classesData.filter(c => c.status === 'open').length;
    const closedCount = classesData.filter(c => c.status === 'closed').length;

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-open').textContent = openCount;
    document.getElementById('stat-closed').textContent = closedCount;
}

// Views Navigation
function hideAllViews() {
    document.querySelectorAll('.view-container').forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });
}

function showListView() {
    hideAllViews();
    listView.style.display = 'block';
    setTimeout(() => listView.classList.add('active'), 10);
    renderTable();
}

// DETAIL VIEW (UC3.4)
function showDetailView(id) {
    const cls = classesData.find(c => c.id === id);
    if (!cls) return;
    
    currentClassId = id;
    hideAllViews();
    
    document.getElementById('v-name').textContent = cls.name;
    document.getElementById('v-id').textContent = cls.id;
    document.getElementById('v-status').outerHTML = getStatusBadge(cls.status).replace('class-badge', 'class-badge" id="v-status');
    
    document.getElementById('v-subject').textContent = cls.subject;
    document.getElementById('v-grade').textContent = cls.grade || 'Không xác định';
    document.getElementById('v-year').textContent = cls.year || 'Không xác định';
    document.getElementById('v-teacher').textContent = cls.teacher;
    
    document.getElementById('v-current').textContent = cls.current;
    document.getElementById('v-max').textContent = cls.max;
    document.getElementById('v-schedule').textContent = cls.schedule || 'Chưa xếp lịch';
    document.getElementById('v-room').textContent = cls.room || 'Chưa xếp phòng';
    
    // Render students
    const vTbody = document.getElementById('v-students-body');
    vTbody.innerHTML = '';
    
    if (cls.current === 0) {
        vTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">Lớp học chưa có học sinh.</td></tr>';
    } else {
        // Use mock data for first class, generate dummy for others
        const studentsToRender = id === 'L001' ? mockStudentsInClass : Array(cls.current).fill(0).map((_, i) => ({
            id: `HS0${i+10}`, name: `Học sinh ${i+1}`, dob: '01/01/2012', parentName: 'Phụ huynh', parentPhone: '090xxxxxxx', status: 'Đang học'
        }));
        
        studentsToRender.forEach(stu => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color: var(--text-muted);">${stu.id}</td>
                <td style="font-weight: 500;">${stu.name}</td>
                <td>${stu.dob}</td>
                <td>${stu.parentName}</td>
                <td>${stu.parentPhone}</td>
                <td><span style="color: #16a34a; font-weight: 500;">${stu.status}</span></td>
            `;
            vTbody.appendChild(tr);
        });
    }
    
    detailView.style.display = 'block';
    setTimeout(() => detailView.classList.add('active'), 10);
}

function triggerEditFromDetail() {
    if (currentClassId) showFormView('edit', currentClassId);
}

// FORM VIEW (Create/Edit)
function showFormView(mode, id = null) {
    hideAllViews();
    formView.style.display = 'block';
    setTimeout(() => formView.classList.add('active'), 10);

    const titleEl = document.getElementById('form-page-title');
    const descEl = document.getElementById('form-page-desc');
    const formId = document.getElementById('form-id');
    const fIdGroup = document.getElementById('f-id-group-wrapper');

    if (mode === 'create') {
        titleEl.textContent = 'Thêm lớp học';
        descEl.textContent = 'Thiết lập thông tin lớp học mới trong hệ thống';
        formId.value = '';
        fIdGroup.style.display = 'none';
        document.getElementById('class-form').reset();
        
        // Reset radio buttons UI
        document.querySelectorAll('.radio-box').forEach(el => el.classList.remove('active'));
        document.querySelector('.radio-box input[value="open"]').parentNode.classList.add('active');
        document.querySelector('.radio-box input[value="open"]').checked = true;

    } else if (mode === 'edit') {
        titleEl.textContent = 'Chỉnh sửa thông tin lớp học';
        descEl.textContent = 'Cập nhật thông tin chi tiết của lớp học trong hệ thống';
        const cls = classesData.find(c => c.id === id);
        if (cls) {
            formId.value = cls.id;
            fIdGroup.style.display = 'grid';
            document.getElementById('f-id').value = cls.id;
            document.getElementById('f-subject').value = cls.subject;
            document.getElementById('f-grade').value = cls.grade || 'Lớp 6';
            document.getElementById('f-name').value = cls.name;
            document.getElementById('f-year').value = cls.year || '2024-2025';
            document.getElementById('f-teacher').value = cls.teacher;
            document.getElementById('f-max').value = cls.max;
            
            // Handle radio buttons
            document.querySelectorAll('.radio-box').forEach(el => el.classList.remove('active'));
            const rb = document.querySelector(`.radio-box input[value="${cls.status}"]`);
            if(rb) {
                rb.parentNode.classList.add('active');
                rb.checked = true;
            }
        }
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-id').value;
    const name = document.getElementById('f-name').value.trim();
    const subject = document.getElementById('f-subject').value;
    const grade = document.getElementById('f-grade').value;
    const year = document.getElementById('f-year').value.trim();
    const teacher = document.getElementById('f-teacher').value;
    const max = parseInt(document.getElementById('f-max').value);
    const status = document.querySelector('input[name="f-status"]:checked').value;

    if (!name || !max || !year) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    // BR3-1 & BR3-7: Tên lớp không trùng trong cùng năm
    const isDuplicate = classesData.some(c => c.name.toLowerCase() === name.toLowerCase() && c.year === year && c.id !== id);
    if (isDuplicate) {
        showToast(`Tên lớp "${name}" đã tồn tại trong năm học ${year}. Vui lòng chọn tên khác!`, 'error');
        return;
    }

    if (id) {
        // Edit Mode
        const idx = classesData.findIndex(c => c.id === id);
        if (idx !== -1) {
            // BR3-8: Sĩ số tối đa >= hiện tại
            if (max < classesData[idx].current) {
                showToast(`Sĩ số tối đa (${max}) không được nhỏ hơn sĩ số hiện tại (${classesData[idx].current}).`, 'error');
                return;
            }
            
            classesData[idx] = { ...classesData[idx], name, subject, grade, year, teacher, max, status };
            showToast('Cập nhật thông tin lớp học thành công!', 'success');
        }
    } else {
        // Create Mode
        const nextId = `L${(classesData.length + 1).toString().padStart(3, '0')}`;
        classesData.unshift({
            id: nextId,
            name, subject, grade, year, teacher, max, current: 0, status,
            schedule: 'Chưa xếp lịch', room: 'Chưa xếp phòng'
        });
        showToast('Thêm lớp học mới thành công!', 'success');
    }

    showListView();
}

// DELETE CLASS (UC3.3)
function openDeleteModal(id) {
    const cls = classesData.find(c => c.id === id);
    if (!cls) return;

    // BR3-10: Không xóa lớp đang hoạt động
    if (cls.status === 'open') {
        showToast('Không thể xóa lớp đang mở (hoạt động). Hãy đóng lớp trước.', 'error');
        return;
    }
    
    // BR3-11: Không xóa lớp còn học sinh
    if (cls.current > 0) {
        showToast(`Không thể xóa lớp học vì vẫn còn ${cls.current} học sinh.`, 'error');
        return;
    }

    classToDelete = id;
    deleteModal.classList.add('active');
}

function confirmDeleteClass() {
    if (classToDelete) {
        classesData = classesData.filter(c => c.id !== classToDelete);
        classToDelete = null;
        closeModals();
        renderTable();
        showToast('Xóa lớp học thành công!', 'success');
    }
}

// ADD STUDENT VIEW (UC3.6)
function showAddStudentView(id) {
    const cls = classesData.find(c => c.id === id);
    if (!cls) return;
    currentClassId = id;

    document.getElementById('add-stu-title').textContent = `Thêm học sinh vào lớp ${cls.name}`;
    document.getElementById('add-stu-class-name').textContent = cls.name;
    document.getElementById('add-stu-class-id').textContent = `Mã lớp: ${cls.id}`;
    document.getElementById('add-stu-current').textContent = `${cls.current} học sinh`;

    // Check capacity
    const alertBox = document.getElementById('full-capacity-alert');
    const submitBtn = document.getElementById('btn-add-stu-submit');
    const checkboxes = document.querySelectorAll('.add-stu-cb');
    const checkAll = document.getElementById('add-stu-check-all');

    // Uncheck all
    checkboxes.forEach(cb => cb.checked = false);
    checkAll.checked = false;

    if (cls.current >= cls.max) {
        alertBox.style.display = 'flex';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        checkAll.disabled = true;
        checkboxes.forEach(cb => cb.disabled = true);
    } else {
        alertBox.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        checkAll.disabled = false;
        checkboxes.forEach(cb => cb.disabled = false);
    }

    hideAllViews();
    addStuView.style.display = 'block';
    setTimeout(() => addStuView.classList.add('active'), 10);
}

function submitAddStudents() {
    const checkboxes = document.querySelectorAll('.add-stu-cb:checked');
    if (checkboxes.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 học sinh', 'error');
        return;
    }

    const cls = classesData.find(c => c.id === currentClassId);
    if (cls) {
        if (cls.current + checkboxes.length > cls.max) {
            showToast('Sĩ số vượt quá giới hạn tối đa', 'error');
            return;
        }
        
        cls.current += checkboxes.length;
        showToast('Đã thêm học sinh vào lớp thành công', 'success');
        showListView();
    }
}

// Check all logic for add student
document.getElementById('add-stu-check-all')?.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const cls = classesData.find(c => c.id === currentClassId);
    if(cls && cls.current >= cls.max) return;

    document.querySelectorAll('.add-stu-cb').forEach(cb => {
        cb.checked = isChecked;
    });
});

// REMOVE STUDENT VIEW (UC3.7)
function showRemoveStudentView(id) {
    const cls = classesData.find(c => c.id === id);
    if (!cls) return;
    currentClassId = id;

    document.getElementById('rem-stu-class-name').textContent = cls.name;
    document.getElementById('rem-stu-subject').textContent = cls.subject;
    document.getElementById('rem-stu-teacher').textContent = cls.teacher;
    
    // Reset selection
    document.querySelectorAll('.rem-stu-radio').forEach(r => r.checked = false);
    document.getElementById('rem-stu-selected-name').textContent = 'Vui lòng chọn học sinh';
    document.getElementById('rem-stu-selected-name').style.color = 'var(--text-muted)';
    
    // Default reason
    document.getElementById('rem-stu-reason').value = 'Chuyển lớp';

    hideAllViews();
    remStuView.style.display = 'block';
    setTimeout(() => remStuView.classList.add('active'), 10);
}

function openConfirmRemoveModal() {
    const selected = document.querySelector('.rem-stu-radio:checked');
    if (!selected) {
        showToast('Vui lòng chọn học sinh cần rút', 'error');
        return;
    }

    const cls = classesData.find(c => c.id === currentClassId);
    
    document.getElementById('cr-stu-name').textContent = selected.value;
    document.getElementById('cr-class-name').textContent = cls.name;

    confirmRemModal.classList.add('active');
}

function processRemoveStudent() {
    const cls = classesData.find(c => c.id === currentClassId);
    if (cls && cls.current > 0) {
        cls.current -= 1;
        closeModals();
        showToast('Đã rút học sinh khỏi lớp học thành công', 'success');
        showListView(); 
    }
}

// Modal Helpers
function closeModals() {
    deleteModal.classList.remove('active');
    confirmRemModal.classList.remove('active');
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
