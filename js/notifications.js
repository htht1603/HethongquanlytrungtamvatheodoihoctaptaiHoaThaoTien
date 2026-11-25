// Mock Data
let notiData = [
    { id: 'TB-2026-001', title: 'Thông báo nghỉ lễ 30/04 và 01/05', target: ['Học sinh', 'Giáo viên', 'Phụ huynh'], date: '24/04/2026 09:15', status: 'sent', content: 'Kính gửi quý phụ huynh, giáo viên và các em học sinh...\n\nTrung tâm xin thông báo lịch nghỉ lễ 30/04 và 01/05 như sau:\n- Nghỉ từ thứ Tư (30/04/2026) đến hết Chủ nhật (04/05/2026).\n- Đi học lại bình thường vào thứ Hai (05/05/2026).\n\nChúc mọi người kỳ nghỉ vui vẻ!' },
    { id: 'TB-2026-002', title: 'Nhắc nhở đóng học phí tháng 5/2026', target: ['Phụ huynh'], date: '23/04/2026 16:30', status: 'sent', content: 'Kính gửi quý phụ huynh,\n\nHạn đóng học phí tháng 5/2026 là ngày 10/05/2026. Quý phụ huynh vui lòng hoàn thành trước hạn để không ảnh hưởng đến quá trình học tập của các em.' },
    { id: 'TB-2026-003', title: 'Thông báo họp phụ huynh học kỳ II', target: ['Phụ huynh'], date: '22/04/2026 10:00', status: 'sent', content: 'Kính mời quý phụ huynh đến tham dự buổi họp tổng kết học kỳ II vào lúc 8h00 Chủ nhật tuần này.' },
    { id: 'TB-2026-004', title: 'Thay đổi lịch học lớp Toán nâng cao', target: ['Giáo viên'], date: '20/04/2026 14:20', status: 'draft', content: 'Lịch học lớp Toán nâng cao (K8A) sẽ dời từ tối thứ 3 sang tối thứ 5. Các giáo viên lưu ý để sắp xếp lịch trình.' },
    { id: 'TB-2026-005', title: 'Nhắc nhở bài tập về nhà tuần 17', target: ['Học sinh'], date: '19/04/2026 08:45', status: 'draft', content: 'Các em học sinh lưu ý hoàn thành bài tập môn Lý trước buổi học ngày mai.' }
];

let submitAction = 'draft'; // 'draft' or 'send'

// DOM Elements
const tbody = document.getElementById('noti-table-body');
const searchInput = document.getElementById('search-input');
const targetFilter = document.getElementById('target-filter');
const statusFilter = document.getElementById('status-filter');
const rightPanel = document.getElementById('detail-panel');
const errorModal = document.getElementById('error-send-modal');

// Views
const listView = document.getElementById('list-view');
const formView = document.getElementById('form-view');

// Form Elements
const formId = document.getElementById('form-id');
const formTitle = document.getElementById('form-title');
const formContent = document.getElementById('form-content');
const formTargetCheckboxes = document.querySelectorAll('input[name="targets"]');
const formPageTitle = document.getElementById('form-page-title');

// Initialize
function init() {
    renderTable();
    
    // Add event listeners for filters
    searchInput.addEventListener('input', renderTable);
    targetFilter.addEventListener('change', renderTable);
    statusFilter.addEventListener('change', renderTable);
}

// Helpers
function formatDate(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getStatusBadge(status) {
    if (status === 'sent') return '<span class="noti-badge noti-badge-sent">ĐÃ GỬI</span>';
    return '<span class="noti-badge noti-badge-draft">NHÁP</span>';
}

function formatTarget(targets) {
    if (targets.length === 3) return 'Tất cả';
    return targets.join(', ');
}

// Render Table
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterTarget = targetFilter.value;
    const filterStatus = statusFilter.value;

    const filtered = notiData.filter(noti => {
        const matchSearch = noti.title.toLowerCase().includes(searchTerm) || noti.id.toLowerCase().includes(searchTerm);
        const matchStatus = filterStatus === 'all' || noti.status === filterStatus;
        const matchTarget = filterTarget === 'all' || noti.target.includes(filterTarget) || formatTarget(noti.target) === 'Tất cả';
        return matchSearch && matchStatus && matchTarget;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy thông báo nào</td></tr>`;
        updateStats();
        return;
    }

    // Sort by date desc (mock string sort works well enough for format DD/MM/YYYY HH:mm if we reverse parts, but let's just keep original order for mockup)
    
    filtered.forEach(noti => {
        const tr = document.createElement('tr');
        
        // Action buttons based on status
        let actionButtons = `
            <button class="btn-icon" title="Xem chi tiết" onclick="openDetailPanel('${noti.id}')">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
        `;

        if (noti.status === 'draft') {
            actionButtons += `
                <button class="btn-icon" title="Gửi" onclick="quickSend('${noti.id}')" style="color: var(--primary-color);">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
                <button class="btn-icon" title="Sửa" onclick="editNoti('${noti.id}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon delete" title="Xóa" onclick="openConfirmModal('${noti.id}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
        }

        tr.innerHTML = `
            <td>${noti.id}</td>
            <td style="font-weight: 500; color: var(--text-main);">${noti.title}</td>
            <td style="color: var(--text-muted);">${formatTarget(noti.target)}</td>
            <td style="color: var(--text-muted);">${noti.date}</td>
            <td>${getStatusBadge(noti.status)}</td>
            <td style="display: flex; gap: 8px;">${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('pag-total').textContent = filtered.length;
    updateStats();
}

function updateStats() {
    const totalCount = notiData.length;
    const sentCount = notiData.filter(n => n.status === 'sent').length;
    const draftCount = notiData.filter(n => n.status === 'draft').length;

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-sent').textContent = sentCount;
    document.getElementById('stat-draft').textContent = draftCount;
}

// Right Panel Logic
function openDetailPanel(id) {
    const noti = notiData.find(n => n.id === id);
    if (!noti) return;

    document.getElementById('detail-title').textContent = noti.title;
    document.getElementById('detail-id').textContent = noti.id;
    document.getElementById('detail-date').textContent = noti.date;
    document.getElementById('detail-target').textContent = formatTarget(noti.target);
    document.getElementById('detail-status').innerHTML = getStatusBadge(noti.status);
    document.getElementById('detail-content').textContent = noti.content;

    rightPanel.style.width = '450px';
    rightPanel.style.opacity = '1';
}

function closeDetailPanel() {
    rightPanel.style.width = '0';
    rightPanel.style.opacity = '0';
}

// Quick Send from list
function quickSend(id) {
    const noti = notiData.find(n => n.id === id);
    if (!noti) return;

    // Simulate error for specific mockup requirement if needed, let's just make it succeed for now, 
    // or fail randomly to show the error modal
    if (id === 'TB-2026-004' && Math.random() > 0.5) {
        document.getElementById('error-send-msg').textContent = `Mã TB (${id}) đang bị kẹt hoặc mất kết nối mạng. Vui lòng thử lại.`;
        errorModal.classList.add('active');
        return;
    }

    noti.status = 'sent';
    renderTable();
    showToast('Đã gửi thông báo thành công!', 'success');
}

function closeErrorModal() {
    errorModal.classList.remove('active');
}

// Delete Draft Logic
let notiToDelete = null;

function openConfirmModal(id) {
    notiToDelete = id;
    document.getElementById('confirm-modal').classList.add('active');
}

function closeConfirmModal() {
    notiToDelete = null;
    document.getElementById('confirm-modal').classList.remove('active');
}

document.getElementById('confirm-btn').addEventListener('click', function() {
    if (notiToDelete) {
        const index = notiData.findIndex(n => n.id === notiToDelete);
        if (index !== -1) {
            notiData.splice(index, 1);
            showToast('Đã xóa bản nháp thành công', 'success');
            renderTable();
            closeDetailPanel();
        }
    }
    closeConfirmModal();
});

// View Switching
function showFormView() {
    closeDetailPanel();
    
    // Reset Form for "Create"
    formId.value = '';
    formTitle.value = '';
    formContent.value = '';
    formTargetCheckboxes.forEach(cb => cb.checked = true); // Default all
    formPageTitle.textContent = 'Tạo thông báo mới';

    listView.classList.remove('active');
    setTimeout(() => {
        listView.style.display = 'none';
        formView.style.display = 'block';
        setTimeout(() => formView.classList.add('active'), 10);
    }, 300);
}

function showListView() {
    formView.classList.remove('active');
    setTimeout(() => {
        formView.style.display = 'none';
        listView.style.display = 'block';
        setTimeout(() => listView.classList.add('active'), 10);
    }, 300);
    renderTable(); // Ensure fresh data
}

function editNoti(id) {
    const noti = notiData.find(n => n.id === id);
    if (!noti) return;

    formId.value = noti.id;
    formTitle.value = noti.title;
    formContent.value = noti.content;
    
    formTargetCheckboxes.forEach(cb => {
        cb.checked = noti.target.includes(cb.value);
    });
    
    formPageTitle.textContent = 'Sửa thông báo (Nháp)';

    closeDetailPanel();
    listView.classList.remove('active');
    setTimeout(() => {
        listView.style.display = 'none';
        formView.style.display = 'block';
        setTimeout(() => formView.classList.add('active'), 10);
    }, 300);
}

// Form Submit
function handleFormSubmit(action, event) {
    if (event) event.preventDefault();
    
    // Validate
    if (!formTitle.value.trim() || !formContent.value.trim()) {
        showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung', 'error');
        return;
    }

    const selectedTargets = Array.from(formTargetCheckboxes)
                                .filter(cb => cb.checked)
                                .map(cb => cb.value);

    if (selectedTargets.length === 0) {
        showToast("Vui lòng chọn ít nhất một đối tượng nhận.", "error");
        return;
    }

    const isEdit = formId.value !== '';
    let notiObj;

    if (isEdit) {
        notiObj = notiData.find(n => n.id === formId.value);
        if (!notiObj) return;
        notiObj.title = formTitle.value;
        notiObj.target = selectedTargets;
        notiObj.content = formContent.value;
        notiObj.status = action;
        // Optionally update date
    } else {
        const nextId = notiData.length + 1;
        notiObj = {
            id: `TB-2026-${nextId.toString().padStart(3, '0')}`,
            title: formTitle.value,
            target: selectedTargets,
            date: formatDate(new Date()),
            status: action,
            content: formContent.value
        };
        notiData.unshift(notiObj); // Add to top
    }

    showListView();
    
    if (action === 'send') {
        showToast('Gửi thông báo thành công!', 'success');
    } else {
        showToast('Lưu nháp thành công!', 'success');
    }
}

// Intercept form submit event to handle 'send' automatically
document.getElementById('noti-form').addEventListener('submit', function(e) {
    handleFormSubmit(submitAction, e);
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
