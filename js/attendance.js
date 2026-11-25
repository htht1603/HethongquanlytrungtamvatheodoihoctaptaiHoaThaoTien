// Mock Data
const classesData = [
    { id: 'c1', name: 'Toán K8A', size: 30, status: 'unmarked' },
    { id: 'c2', name: 'Toán K9B', size: 28, status: 'unmarked' },
    { id: 'c3', name: 'Toán K10C', size: 29, status: 'unmarked' }
];

const studentsData = [
    { id: 'K8A001', name: 'Nguyễn Văn An' },
    { id: 'K8A002', name: 'Trần Thị Bình' },
    { id: 'K8A003', name: 'Lê Văn Cường' },
    { id: 'K8A004', name: 'Phạm Thị Dung' },
    { id: 'K8A005', name: 'Hoàng Văn Em' },
    { id: 'K8A006', name: 'Đặng Thị Phương' },
    { id: 'K8A007', name: 'Bùi Văn Giang' },
    { id: 'K8A008', name: 'Ngô Thị Hoa' },
    { id: 'K8A009', name: 'Vũ Văn Inh' },
    { id: 'K8A010', name: 'Đinh Thị Kim' },
    { id: 'K8A011', name: 'Lý Văn Long' },
    { id: 'K8A012', name: 'Mai Thị Mỹ' },
    { id: 'K8A013', name: 'Phan Văn Nam' }
];

let currentClassId = null;

const historyData = [
    { id: 'h1', date: '24/07/2026', class: 'Toán K8A', time: '07:30 - 09:00', total: 30, present: 29, absent: 1, status: 'Đã hoàn thành' },
    { id: 'h2', date: '23/07/2026', class: 'Toán K9B', time: '09:15 - 10:45', total: 28, present: 28, absent: 0, status: 'Đã hoàn thành' },
    { id: 'h3', date: '22/07/2026', class: 'Toán K10C', time: '13:30 - 15:00', total: 29, present: 27, absent: 2, status: 'Đã hoàn thành' }
];

// DOM Elements
const listView = document.getElementById('list-view');
const formView = document.getElementById('form-view');
const classesGrid = document.getElementById('classes-grid');
const studentTbody = document.getElementById('student-tbody');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    renderClasses();
    renderHistory();
});

function switchTab(tabId) {
    document.getElementById('tab-attendance').classList.remove('active');
    document.getElementById('tab-history').classList.remove('active');
    
    document.getElementById('section-attendance').style.display = 'none';
    document.getElementById('section-history').style.display = 'none';
    
    if (tabId === 'attendance') {
        document.getElementById('tab-attendance').classList.add('active');
        document.getElementById('section-attendance').style.display = 'block';
    } else {
        document.getElementById('tab-history').classList.add('active');
        document.getElementById('section-history').style.display = 'block';
    }
}

function renderClasses() {
    classesGrid.innerHTML = '';
    classesData.forEach(c => {
        let statusHtml = '';
        let actionHtml = '';

        if (c.status === 'unmarked') {
            statusHtml = `<span class="a-status-badge sb-unmarked">Chưa điểm danh</span>`;
            actionHtml = `<a href="javascript:void(0)" class="a-btn-start" onclick="startAttendance('${c.id}')">Bắt đầu điểm danh <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`;
        } else if (c.status === 'draft') {
            statusHtml = `<span class="a-status-badge sb-draft">Bản nháp</span>`;
            actionHtml = `<a href="javascript:void(0)" class="a-btn-start" onclick="startAttendance('${c.id}')" style="color: #d97706;">Tiếp tục điểm danh <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`;
        } else if (c.status === 'marked') {
            statusHtml = `<span class="a-status-badge sb-marked">Đã điểm danh</span>`;
            actionHtml = `
                <div class="a-progress-wrap" style="margin-top: 12px; margin-bottom: 4px;">
                    <div class="a-progress-bar" style="width: 100%;"></div>
                </div>
                <div class="a-progress-text">
                    <span>Tỉ lệ có mặt</span>
                    <span style="color: #10b981; font-weight: 600;">100%</span>
                </div>
            `;
        }

        const card = document.createElement('div');
        card.className = 'a-class-card';
        card.innerHTML = `
            <div class="a-card-header">
                <div class="a-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                ${statusHtml}
            </div>
            <h4 class="a-card-title">${c.name}</h4>
            <p class="a-card-subtitle"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>${c.size} học sinh</p>
            <div class="a-card-footer">
                ${actionHtml}
            </div>
        `;
        classesGrid.appendChild(card);
    });
}

function showListView() {
    formView.classList.remove('active');
    setTimeout(() => {
        formView.style.display = 'none';
        listView.style.display = 'block';
        setTimeout(() => listView.classList.add('active'), 10);
    }, 300);
}

function startAttendance(classId) {
    currentClassId = classId;
    const cls = classesData.find(c => c.id === classId);
    
    // Update labels
    document.getElementById('detail-class-name').textContent = cls.name;
    document.getElementById('s-class').textContent = cls.name;
    document.getElementById('s-total').textContent = `${studentsData.length} HS`; // using mock length instead of cls.size for demo table
    document.getElementById('students-count-text').textContent = `Danh sách học sinh (${studentsData.length} em)`;

    renderStudents();
    updateStats();

    listView.classList.remove('active');
    setTimeout(() => {
        listView.style.display = 'none';
        formView.style.display = 'block';
        setTimeout(() => formView.classList.add('active'), 10);
    }, 300);
}

function renderStudents() {
    studentTbody.innerHTML = '';
    studentsData.forEach((s, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="color: #64748b; font-size: 0.85rem;">${s.id}</td>
            <td class="t-font-medium">${s.name}</td>
            <td>
                <div class="a-radio-group">
                    <label class="a-radio-label">
                        <input type="radio" name="att_${s.id}" value="present" onchange="updateStats()">
                        <span style="display: flex; flex-direction: column; align-items: center;">
                            <span>Có</span>
                            <span>mặt</span>
                        </span>
                    </label>
                    <label class="a-radio-label">
                        <input type="radio" name="att_${s.id}" value="excused" onchange="updateStats()">
                        <span style="display: flex; flex-direction: column; align-items: center;">
                            <span>Vắng</span>
                            <span>phép</span>
                        </span>
                    </label>
                    <label class="a-radio-label">
                        <input type="radio" name="att_${s.id}" value="unexcused" onchange="updateStats()">
                        <span style="display: flex; flex-direction: column; align-items: center;">
                            <span>Vắng</span>
                            <span>KP</span>
                        </span>
                    </label>
                    <label class="a-radio-label">
                        <input type="radio" name="att_${s.id}" value="late" onchange="updateStats()">
                        <span style="display: flex; flex-direction: column; align-items: center;">
                            <span>Đi</span>
                            <span>muộn</span>
                        </span>
                    </label>
                </div>
            </td>
            <td>
                <input type="text" class="a-input-note" placeholder="Ghi chú...">
            </td>
        `;
        studentTbody.appendChild(tr);

        // Add visual toggle class to labels
        const radios = tr.querySelectorAll(`input[name="att_${s.id}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                // remove classes from siblings
                tr.querySelectorAll('.a-radio-label').forEach(lbl => {
                    lbl.classList.remove('checked-present', 'checked-excused', 'checked-unexcused', 'checked-late');
                });
                // add class to parent
                const val = this.value;
                this.parentElement.classList.add(`checked-${val}`);
            });
        });
    });
}

function updateStats() {
    let present = 0, late = 0, excused = 0, unexcused = 0;
    
    studentsData.forEach(s => {
        const checked = document.querySelector(`input[name="att_${s.id}"]:checked`);
        if (checked) {
            if (checked.value === 'present') present++;
            if (checked.value === 'late') late++;
            if (checked.value === 'excused') excused++;
            if (checked.value === 'unexcused') unexcused++;
        }
    });

    const marked = present + late + excused + unexcused;
    const total = studentsData.length;
    const unmarked = total - marked;
    const absentOrLate = late + excused + unexcused;

    document.getElementById('r-present').textContent = present;
    document.getElementById('r-late').textContent = late;
    document.getElementById('r-excused').textContent = excused;
    document.getElementById('r-unexcused').textContent = unexcused;
    document.getElementById('r-unmarked').textContent = unmarked;
    
    document.getElementById('marked-count-text').textContent = `Đã điểm danh: ${marked}/${total}`;
    document.getElementById('info-absent-count').textContent = absentOrLate;
}

function markAllPresent() {
    studentsData.forEach(s => {
        const presentRadio = document.querySelector(`input[name="att_${s.id}"][value="present"]`);
        if (presentRadio && !presentRadio.checked) {
            presentRadio.checked = true;
            // trigger change visually
            presentRadio.dispatchEvent(new Event('change'));
        }
    });
    updateStats();
}

function saveDraft() {
    // Update state to draft
    const cls = classesData.find(c => c.id === currentClassId);
    if(cls) cls.status = 'draft';
    
    showToast('Lưu nháp điểm danh thành công.', 'success');
    renderClasses();
    showListView();
}

function confirmSave() {
    // Check if all are marked
    const unmarkedText = document.getElementById('r-unmarked').textContent;
    if (parseInt(unmarkedText) > 0) {
        document.getElementById('error-modal').classList.add('active');
    } else {
        document.getElementById('confirm-modal').classList.add('active');
    }
}

function closeErrorModal() {
    document.getElementById('error-modal').classList.remove('active');
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

function submitAttendance() {
    closeConfirmModal();
    // Update state to marked
    const cls = classesData.find(c => c.id === currentClassId);
    if(cls) cls.status = 'marked';
    
    showToast('Lưu điểm danh thành công và đã gửi thông báo đến phụ huynh.', 'success');
    renderClasses();
    showListView();
}

function renderHistory() {
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    historyData.forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="t-font-medium">${h.date}</td>
            <td>${h.class}</td>
            <td>${h.time}</td>
            <td>${h.total}</td>
            <td style="color: #10b981; font-weight: 500;">${h.present}</td>
            <td style="color: #ef4444; font-weight: 500;">${h.absent}</td>
            <td><span class="badge badge-success">${h.status}</span></td>
            <td><a href="javascript:void(0)" class="action-link" onclick="openHistoryModal('${h.id}', '${h.class}')">Xem chi tiết</a></td>
        `;
        tbody.appendChild(tr);
    });
}

function openHistoryModal(id, className) {
    document.getElementById('history-modal-title').textContent = 'Chi tiết điểm danh - ' + className;
    const tbody = document.getElementById('history-detail-tbody');
    tbody.innerHTML = '';
    
    // Mock detail data
    studentsData.forEach((s, index) => {
        const tr = document.createElement('tr');
        // Randomly assign some status for demo
        let status = 'Có mặt';
        let badgeClass = 'badge-success';
        if (index === 2) { status = 'Vắng phép'; badgeClass = 'badge-warning'; }
        else if (index === 5) { status = 'Vắng KP'; badgeClass = 'badge-danger'; }
        else if (index === 8) { status = 'Đi muộn'; badgeClass = 'badge-warning'; }
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="color: #64748b;">${s.id}</td>
            <td class="t-font-medium">${s.name}</td>
            <td><span class="badge ${badgeClass}" style="${status==='Vắng phép' || status==='Đi muộn' ? 'background:#fef3c7;color:#d97706;' : ''}">${status}</span></td>
            <td>${status !== 'Có mặt' ? 'Ghi chú mẫu...' : ''}</td>
        `;
        tbody.appendChild(tr);
    });
    
    document.getElementById('history-modal').classList.add('active');
}

function closeHistoryModal() {
    document.getElementById('history-modal').classList.remove('active');
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
    }, 4000); // 4 seconds for longer message
}
