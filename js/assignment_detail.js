// Mock Data for Assignment Detail
const assignmentMock = {
    id: 'BT001',
    title: 'Bài tập Đại số chương 3',
    class: 'Toán K8A',
    type: 'Tự luận',
    assignedDate: '20/07/2026',
    dueDate: '25/07/2026 23:59',
    content: 'Các em làm bài tập trong sách giáo khoa trang 45, 46. Chú ý trình bày cẩn thận từng bước giải phương trình bậc hai.',
    status: 'Đã giao'
};

const studentsSubmitData = [
    { id: 'K8A001', name: 'Nguyễn Văn An', time: '24/07/2026 14:30', status: 'Đã nộp', score: null, comment: '', content: 'Em thưa cô, đây là bài làm của em ạ.', files: ['bai_lam_toan_1.jpg'] },
    { id: 'K8A002', name: 'Trần Thị Bình', time: '25/07/2026 09:15', status: 'Đã chấm', score: 8.5, comment: 'Bài làm tốt, trình bày sạch sẽ.', content: 'Em nộp bài.', files: ['bai_tap_binh.pdf'] },
    { id: 'K8A003', name: 'Lê Văn Cường', time: '-', status: 'Chưa nộp', score: null, comment: '', content: '', files: [] },
    { id: 'K8A004', name: 'Phạm Thị Dung', time: '26/07/2026 08:00', status: 'Nộp muộn', score: null, comment: '', content: 'Em xin lỗi vì nộp muộn ạ.', files: ['dung_bai.png'] },
    { id: 'K8A005', name: 'Hoàng Văn Em', time: '23/07/2026 20:00', status: 'Đã chấm', score: 9.0, comment: 'Rất tốt!', content: 'Bài tập của em', files: ['bai_tap.docx'] }
];

let selectedStudentId = null;

window.addEventListener('DOMContentLoaded', () => {
    // Load assignment info
    document.getElementById('ad-title').textContent = assignmentMock.title;
    document.getElementById('ad-class').textContent = assignmentMock.class;
    document.getElementById('ad-type').textContent = assignmentMock.type;
    document.getElementById('ad-due').textContent = assignmentMock.dueDate;
    document.getElementById('ad-start').textContent = assignmentMock.assignedDate;
    document.getElementById('ad-content').textContent = assignmentMock.content;

    renderStudents();
});

function getSubmitBadge(status) {
    switch(status) {
        case 'Đã nộp': return '<span class="badge badge-success" style="background:#eff6ff;color:#2563eb;">Đã nộp</span>';
        case 'Đã chấm': return '<span class="badge badge-success">Đã chấm</span>';
        case 'Nộp muộn': return '<span class="badge badge-danger">Nộp muộn</span>';
        case 'Chưa nộp': return '<span class="badge badge-warning" style="background:#f1f5f9;color:#64748b;">Chưa nộp</span>';
        default: return '';
    }
}

function renderStudents() {
    const tbody = document.getElementById('students-tbody');
    tbody.innerHTML = '';

    studentsSubmitData.forEach(s => {
        const tr = document.createElement('tr');
        
        const scoreHtml = s.score !== null ? `<strong style="color:#1e40af;">${s.score}</strong>` : '<span style="color:#94a3b8;">-</span>';
        
        tr.innerHTML = `
            <td style="color: #64748b; font-size: 0.85rem;">${s.id}</td>
            <td>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div class="avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">${s.name.charAt(0)}</div>
                    <div>
                        <div class="t-font-medium">${s.name}</div>
                    </div>
                </div>
            </td>
            <td style="color: #475569; font-size: 0.85rem;">${s.time}</td>
            <td>${getSubmitBadge(s.status)}</td>
            <td>${scoreHtml}</td>
            <td>
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.85rem; border-color: #3b82f6; color: #3b82f6;" onclick="openGradingModal('${s.id}')" ${s.status === 'Chưa nộp' ? 'disabled' : ''}>
                    ${s.status === 'Đã chấm' ? 'Xem/Sửa điểm' : 'Chấm bài'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openGradingModal(studentId) {
    selectedStudentId = studentId;

    const student = studentsSubmitData.find(s => s.id === studentId);
    
    // Populate grading modal
    document.getElementById('g-student-name').textContent = student.name;
    document.getElementById('g-student-id').textContent = student.id;
    document.getElementById('g-submit-time').textContent = student.time;
    document.getElementById('g-status-badge').outerHTML = getSubmitBadge(student.status).replace('<span', '<span id="g-status-badge"');
    
    // Work content
    let filesHtml = student.files.map(f => `
        <div class="file-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>${f}</span>
        </div>
    `).join('');
    
    document.getElementById('g-work-content').textContent = student.content;
    document.getElementById('g-files-container').innerHTML = filesHtml;

    // Form
    document.getElementById('g-score').value = student.score !== null ? student.score : '';
    document.getElementById('g-comment').value = student.comment;

    // Show modal
    document.getElementById('grading-modal').classList.add('active');
}

function closeGradingModal() {
    selectedStudentId = null;
    document.getElementById('grading-modal').classList.remove('active');
}

function saveGrading() {
    const scoreVal = document.getElementById('g-score').value;
    const commentVal = document.getElementById('g-comment').value;

    if (scoreVal === '' || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
        showToast('Điểm số không hợp lệ. Vui lòng nhập từ 0 đến 10.', 'error');
        return;
    }
    
    if (commentVal.length > 1000) {
        showToast('Nhận xét không được vượt quá 1000 ký tự.', 'error');
        return;
    }

    const student = studentsSubmitData.find(s => s.id === selectedStudentId);
    if (student) {
        student.score = parseFloat(scoreVal);
        student.comment = commentVal;
        student.status = 'Đã chấm';
    }

    showToast('Lưu kết quả chấm bài thành công!', 'success');
    renderStudents(); // Refresh table
    closeGradingModal();
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
