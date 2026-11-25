// Mock Data for Timetable (Grid format)
const timeSlots = [
    { id: 't1', label: '07:30', sub: '09:00' },
    { id: 't2', label: '09:15', sub: '10:45' },
    { id: 't3', label: '11:00', sub: '12:30' },
    { id: 't4', label: '14:00', sub: '15:30' },
    { id: 't5', label: '15:45', sub: '17:15' }
];

const daysOfWeek = [
    { id: 'd2', label: 'Thứ 2', date: '12/5' },
    { id: 'd3', label: 'Thứ 3', date: '13/5' },
    { id: 'd4', label: 'Thứ 4', date: '14/5' },
    { id: 'd5', label: 'Thứ 5', date: '15/5' },
    { id: 'd6', label: 'Thứ 6', date: '16/5' },
    { id: 'd7', label: 'Thứ 7', date: '17/5' }
];

// Map of [timeId_dayId] -> array of classes (usually 1, but could be more in complex real scenarios, we'll assume 1 for mockup)
const tkbData = {
    't1_d2': { id: 'tkb1', classId: 'Toán 6A', subject: 'Toán Học', teacher: 'Cô Phương', room: 'P.201', capacity: '18/25', theme: 'theme-blue' },
    't1_d3': { id: 'tkb2', classId: 'Anh văn 7B', subject: 'Tiếng Anh', teacher: 'Thầy Nam', room: 'P.202', capacity: '22/25', theme: 'theme-green' },
    't1_d5': { id: 'tkb3', classId: 'Tiếng Việt 4A', subject: 'Tiếng Việt', teacher: 'Cô Hương', room: 'P.301', capacity: '25/30', theme: 'theme-orange' },
    't1_d6': { id: 'tkb4', classId: 'Toán 6A', subject: 'Toán Học', teacher: 'Cô Phương', room: 'P.201', capacity: '18/25', theme: 'theme-blue' },

    't2_d2': { id: 'tkb5', classId: 'Anh văn 6B', subject: 'Tiếng Anh', teacher: 'Thầy Nam', room: 'P.202', capacity: '15/25', theme: 'theme-green' },
    't2_d3': { id: 'tkb6', classId: 'Toán 9C', subject: 'Toán Học', teacher: 'Thầy Minh', room: 'P.304', capacity: '30/30', theme: 'theme-blue' },
    't2_d4': { id: 'tkb7', classId: 'Tiếng Việt 5A', subject: 'Tiếng Việt', teacher: 'Cô Hương', room: 'P.201', capacity: '20/25', theme: 'theme-orange' },
    't2_d5': { id: 'tkb8', classId: 'Lý 7A', subject: 'Vật lý', teacher: 'Thầy Long', room: 'P.303', capacity: '18/20', theme: 'theme-purple' },
    't2_d6': { id: 'tkb9', classId: 'Hóa 9A', subject: 'Hóa Học', teacher: 'Cô Lan', room: 'P.205', capacity: '18/25', theme: 'theme-pink' },

    't3_d2': { id: 'tkb10', classId: 'Lý 6C', subject: 'Vật lý', teacher: 'Thầy Long', room: 'P.203', capacity: '15/20', theme: 'theme-purple' },
    't3_d4': { id: 'tkb11', classId: 'Toán 7A', subject: 'Toán Học', teacher: 'Cô Phương', room: 'P.201', capacity: '20/25', theme: 'theme-blue' },
    't3_d5': { id: 'tkb12', classId: 'Anh văn 8C', subject: 'Tiếng Anh', teacher: 'Thầy Nam', room: 'P.302', capacity: '24/25', theme: 'theme-green' },
    't3_d6': { id: 'tkb13', classId: 'Ngữ văn 9B', subject: 'Ngữ văn', teacher: 'Cô Hương', room: 'P.201', capacity: '28/30', theme: 'theme-yellow' },

    't4_d2': { id: 'tkb14', classId: 'Toán 8A', subject: 'Toán Học', teacher: 'Thầy Minh', room: 'P.204', capacity: '25/30', theme: 'theme-blue' },
    't4_d3': { id: 'tkb15', classId: 'Anh văn 9C', subject: 'Tiếng Anh', teacher: 'Thầy Nam', room: 'P.302', capacity: '25/25', theme: 'theme-green' },
    't4_d4': { id: 'tkb16', classId: 'Lý 7B', subject: 'Vật lý', teacher: 'Thầy Long', room: 'P.203', capacity: '19/20', theme: 'theme-purple' },
    't4_d5': { id: 'tkb17', classId: 'Hóa 9B', subject: 'Hóa Học', teacher: 'Cô Lan', room: 'P.205', capacity: '20/25', theme: 'theme-pink' },
    't4_d6': { id: 'tkb18', classId: 'Ngữ văn 6A', subject: 'Ngữ văn', teacher: 'Cô Hương', room: 'P.201', capacity: '26/30', theme: 'theme-yellow' },

    't5_d2': { id: 'tkb19', classId: 'Anh văn 7A', subject: 'Tiếng Anh', teacher: 'Thầy Nam', room: 'P.202', capacity: '20/25', theme: 'theme-green' },
    't5_d3': { id: 'tkb20', classId: 'Toán 6B', subject: 'Toán Học', teacher: 'Cô Phương', room: 'P.301', capacity: '22/30', theme: 'theme-blue' },
    't5_d4': { id: 'tkb21', classId: 'Ngữ văn 8B', subject: 'Ngữ văn', teacher: 'Cô Hương', room: 'P.201', capacity: '25/30', theme: 'theme-yellow' },
    't5_d5': { id: 'tkb22', classId: 'Lý 9A', subject: 'Vật lý', teacher: 'Thầy Long', room: 'P.203', capacity: '18/20', theme: 'theme-purple' },
    't5_d6': { id: 'tkb23', classId: 'Hóa 7C', subject: 'Hóa Học', teacher: 'Cô Lan', room: 'P.205', capacity: '15/25', theme: 'theme-pink' }
};

let currentSelectedTkbId = null;

// DOM Elements
const calGrid = document.getElementById('main-cal-grid');
const rightPanel = document.getElementById('detail-panel');
const formView = document.getElementById('form-view');
const calView = document.getElementById('calendar-view');

// Views Swiching
function showFormView(mode = 'create') {
    closeDetailPanel();
    calView.classList.remove('active');
    
    // reset form
    if(mode === 'create') {
        document.getElementById('tkb-form').reset();
        document.getElementById('f-schedule-tbody').innerHTML = '';
        addScheduleRow(); // add 1 default row
        document.getElementById('class-preview').style.display = 'none';
        document.getElementById('form-page-title').textContent = 'Tạo thời khóa biểu';
    }

    setTimeout(() => {
        calView.style.display = 'none';
        formView.style.display = 'block';
        setTimeout(() => formView.classList.add('active'), 10);
    }, 300);
}

function showCalendarView() {
    formView.classList.remove('active');
    setTimeout(() => {
        formView.style.display = 'none';
        calView.style.display = 'block';
        setTimeout(() => calView.classList.add('active'), 10);
    }, 300);
}

function openFormForEdit() {
    closeDetailPanel();
    document.getElementById('form-page-title').textContent = 'Cập nhật thời khóa biểu';
    showFormView('edit');
}

// Right Panel Logic
function openDetailPanel(tkbKey, dayLabel, timeLabel) {
    const data = tkbData[tkbKey];
    if(!data) return;
    currentSelectedTkbId = data.id;

    document.getElementById('dp-class').textContent = data.classId;
    document.getElementById('dp-subject').textContent = data.subject;
    document.getElementById('dp-teacher').textContent = data.teacher;
    document.getElementById('dp-room').textContent = data.room;
    document.getElementById('dp-capacity').textContent = `${data.capacity} học sinh`;
    document.getElementById('dp-day').textContent = dayLabel;
    document.getElementById('dp-time').textContent = timeLabel;

    // Simulate "Đang hoạt động" unless specific
    document.getElementById('dp-status').innerHTML = '<span style="color: #16a34a;">Đang hoạt động</span>';

    rightPanel.style.width = '450px';
    rightPanel.style.opacity = '1';
}

function closeDetailPanel() {
    rightPanel.style.width = '0';
    rightPanel.style.opacity = '0';
    currentSelectedTkbId = null;
}

// Render Calendar Grid
function renderCalendar() {
    calGrid.innerHTML = '';

    const filterClass = document.getElementById('filter-class');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterRoom = document.getElementById('filter-room');
    const filterSearch = document.getElementById('filter-search');

    const fClass = filterClass ? filterClass.value : 'all';
    const fTeacher = filterTeacher ? filterTeacher.value : 'all';
    const fRoom = filterRoom ? filterRoom.value : 'all';
    const fSearch = filterSearch ? filterSearch.value.toLowerCase() : '';

    const tlCell = document.createElement('div');
    tlCell.className = 'cal-header-cell';
    tlCell.innerHTML = `Giờ<br>Học`;
    calGrid.appendChild(tlCell);

    daysOfWeek.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'cal-header-cell';
        cell.innerHTML = `${day.label} <span class="cal-header-date">${day.date}</span>`;
        calGrid.appendChild(cell);
    });

    timeSlots.forEach(time => {
        const timeCell = document.createElement('div');
        timeCell.className = 'cal-time-cell';
        timeCell.innerHTML = `${time.label}<span>- ${time.sub}</span>`;
        calGrid.appendChild(timeCell);

        daysOfWeek.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'cal-cell';
            
            const tkbKey = `${time.id}_${day.id}`;
            const data = tkbData[tkbKey];
            
            if (data) {
                const matchClass = fClass === 'all' || data.classId === fClass;
                const matchTeacher = fTeacher === 'all' || data.teacher === fTeacher;
                const matchRoom = fRoom === 'all' || data.room === fRoom;
                const matchSearch = data.classId.toLowerCase().includes(fSearch) || data.teacher.toLowerCase().includes(fSearch) || data.subject.toLowerCase().includes(fSearch);
                
                if (matchClass && matchTeacher && matchRoom && matchSearch) {
                    const card = document.createElement('div');
                    card.className = `tkb-card ${data.theme}`;
                    card.innerHTML = `
                        <div class="tkb-title">${data.classId}</div>
                        <div class="tkb-teacher">${data.teacher}</div>
                        <div class="tkb-room">${data.room}</div>
                    `;
                    card.onclick = () => openDetailPanel(tkbKey, day.label, `${time.label} - ${time.sub}`);
                    cell.appendChild(card);
                }
            }
            
            calGrid.appendChild(cell);
        });
    });
}

// Form Logic
function updateClassPreview() {
    const classVal = document.getElementById('f-class').value;
    const preview = document.getElementById('class-preview');
    if(classVal) {
        // mock logic
        let sub = 'Toán học', teacher = 'Cô Phương', cap = '18/25';
        if(classVal === 'Anh văn 7B') { sub = 'Tiếng Anh'; teacher = 'Thầy Nam'; cap = '22/25'; }
        if(classVal === 'Hóa 9A') { sub = 'Hóa Học'; teacher = 'Cô Lan'; cap = '18/25'; }

        document.getElementById('cp-subject').textContent = sub;
        document.getElementById('cp-teacher').textContent = teacher;
        document.getElementById('cp-capacity').textContent = `${cap} học sinh`;
        preview.style.display = 'flex';
    } else {
        preview.style.display = 'none';
    }
}

function addScheduleRow() {
    const tbody = document.getElementById('f-schedule-tbody');
    const rowCount = tbody.children.length + 1;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${rowCount}</td>
        <td>
            <select class="form-control" style="padding: 6px;">
                <option>Thứ 2</option><option>Thứ 3</option><option>Thứ 4</option>
                <option>Thứ 5</option><option>Thứ 6</option><option>Thứ 7</option>
            </select>
        </td>
        <td><input type="time" class="form-control" value="07:30" style="padding: 6px;"></td>
        <td><input type="time" class="form-control" value="09:00" style="padding: 6px;"></td>
        <td>
            <select class="form-control" style="padding: 6px;">
                <option>P.201</option><option>P.202</option><option>P.203</option><option>P.204</option>
            </select>
        </td>
        <td style="text-align: center;">
            <button type="button" class="btn-icon" style="color: #ef4444;" onclick="this.closest('tr').remove(); updateRowNumbers();">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
}

function updateRowNumbers() {
    const rows = document.getElementById('f-schedule-tbody').querySelectorAll('tr');
    rows.forEach((tr, index) => {
        tr.cells[0].textContent = index + 1;
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const startDate = document.getElementById('f-start-date').value;
    const endDate = document.getElementById('f-end-date').value;
    const classVal = document.getElementById('f-class').value;

    if (!startDate || !endDate || !classVal) {
        showToast('Nhập đầy đủ các thông tin', 'error');
        return;
    }

    const tbody = document.getElementById('f-schedule-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    if (rows.length === 0) {
        showToast('Vui lòng thêm ít nhất một buổi học', 'error');
        return;
    }
    
    let subject = 'Toán học', teacher = 'Cô Phương', capacity = '18/25', theme = 'theme-blue';
    if(classVal === 'Anh văn 7B') { subject = 'Tiếng Anh'; teacher = 'Thầy Nam'; capacity = '22/25'; theme = 'theme-green'; }
    if(classVal === 'Hóa 9A') { subject = 'Hóa Học'; teacher = 'Cô Lan'; capacity = '18/25'; theme = 'theme-pink'; }
    if(classVal === 'Tiếng Việt 4A') { subject = 'Tiếng Việt'; teacher = 'Cô Hương'; capacity = '25/30'; theme = 'theme-orange'; }

    rows.forEach(tr => {
        const selects = tr.querySelectorAll('select');
        const inputs = tr.querySelectorAll('input[type="time"]');
        
        const dayLabel = selects[0].value;
        const startTime = inputs[0].value;
        const room = selects[1].value;
        
        const dayObj = daysOfWeek.find(d => d.label === dayLabel);
        if (!dayObj) return; 
        
        let timeObj = timeSlots[0];
        if (startTime >= '09:00' && startTime < '11:00') timeObj = timeSlots[1];
        else if (startTime >= '11:00' && startTime < '13:00') timeObj = timeSlots[2];
        else if (startTime >= '13:00' && startTime < '15:30') timeObj = timeSlots[3];
        else if (startTime >= '15:30') timeObj = timeSlots[4];
        
        const tkbKey = `${timeObj.id}_${dayObj.id}`;
        
        tkbData[tkbKey] = {
            id: 'tkb_new_' + Math.floor(Math.random() * 10000),
            classId: classVal,
            subject: subject,
            teacher: teacher,
            room: room,
            capacity: capacity,
            theme: theme
        };
    });

    showToast('Tạo thời khóa biểu thành công', 'success');
    renderCalendar();
    showCalendarView();
}

let tkbToDeleteKey = null;

function handleDeleteFromPanel() {
    const dpClass = document.getElementById('dp-class').textContent;
    if(dpClass === 'Hóa 9A') {
        document.getElementById('error-delete-modal').classList.add('active');
    } else {
        tkbToDeleteKey = Object.keys(tkbData).find(key => tkbData[key].id === currentSelectedTkbId);
        if (tkbToDeleteKey) {
            document.getElementById('confirm-modal').classList.add('active');
        }
    }
}

function closeConfirmModal() {
    tkbToDeleteKey = null;
    document.getElementById('confirm-modal').classList.remove('active');
}

const confirmBtn = document.getElementById('confirm-btn');
if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
        if (tkbToDeleteKey) {
            delete tkbData[tkbToDeleteKey];
            showToast('Xóa thời khóa biểu thành công', 'success');
            renderCalendar();
            closeDetailPanel();
        }
        closeConfirmModal();
    });
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

// Init
window.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    
    const filterClass = document.getElementById('filter-class');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterRoom = document.getElementById('filter-room');
    const filterSearch = document.getElementById('filter-search');

    if (filterClass) filterClass.addEventListener('change', renderCalendar);
    if (filterTeacher) filterTeacher.addEventListener('change', renderCalendar);
    if (filterRoom) filterRoom.addEventListener('change', renderCalendar);
    if (filterSearch) filterSearch.addEventListener('input', renderCalendar);
});
