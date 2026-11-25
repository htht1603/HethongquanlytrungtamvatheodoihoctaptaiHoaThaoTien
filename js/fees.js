// Mock Data cho Hóa đơn học phí
let feesData = [
    { id: 'HD001', name: 'Nguyễn Thị Lan Anh', period: 'Tháng 7/2026', total: 1100000, paid: 1100000, remain: 0, deadline: '10/07/2026', status: 'completed' },
    { id: 'HD002', name: 'Trần Văn Bình', period: 'Tháng 7/2026', total: 1100000, paid: 500000, remain: 600000, deadline: '15/07/2026', status: 'partial' },
    { id: 'HD003', name: 'Lê Thị Cẩm Tú', period: 'Tháng 7/2026', total: 1950000, paid: 0, remain: 1950000, deadline: '20/07/2026', status: 'unpaid' },
    { id: 'HD004', name: 'Phạm Minh Đức', period: 'Tháng 7/2026', total: 2100000, paid: 0, remain: 2100000, deadline: '10/07/2026', status: 'overdue' },
    { id: 'HD005', name: 'Hoàng Thúy Lan', period: 'Tháng 7/2026', total: 850000, paid: 0, remain: 850000, deadline: '25/07/2026', status: 'unpaid' },
    { id: 'HD006', name: 'Vũ Minh Tuấn', period: 'Tháng 7/2026', total: 1200000, paid: 1200000, remain: 0, deadline: '10/07/2026', status: 'completed' },
    { id: 'HD007', name: 'Đặng Bảo Châu', period: 'Tháng 7/2026', total: 950000, paid: 0, remain: 950000, deadline: '05/07/2026', status: 'overdue' },
    { id: 'HD008', name: 'Lương Văn Khoa', period: 'Tháng 7/2026', total: 1500000, paid: 700000, remain: 800000, deadline: '20/07/2026', status: 'partial' }
];

let selectedFeeId = null;
let checkedIds = new Set();
const BASE_DISCOUNT_PER_DAY = 78571; // Giả lập trừ tiền theo buổi vắng

// DOM Elements
const tbody = document.getElementById('fees-table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const monthFilter = document.getElementById('month-filter');
const checkAllInput = document.getElementById('check-all');
const btnRemindAll = document.getElementById('btn-remind-all');
const rightPanel = document.getElementById('detail-panel');

// Initialize
function init() {
    populateMonthFilter();
    renderTable();
    updateStats();

    // Event Listeners
    searchInput.addEventListener('input', renderTable);
    statusFilter.addEventListener('change', renderTable);
    monthFilter.addEventListener('change', renderTable);
    document.getElementById('payment-form').addEventListener('submit', handlePaymentSubmit);

    // Set today for date picker
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pay-date').value = today;
}

function populateMonthFilter() {
    const months = new Set();
    feesData.forEach(fee => months.add(fee.period));
    
    monthFilter.innerHTML = '<option value="all">Tất cả kỳ học phí</option>';
    months.forEach(month => {
        monthFilter.innerHTML += `<option value="${month}" ${month === 'Tháng 7/2026' ? 'selected' : ''}>${month}</option>`;
    });
}

// Format Currency
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

function parseCurrency(str) {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
}

function getStatusBadge(status) {
    switch(status) {
        case 'completed': return '<span class="fee-badge fee-badge-success">Hoàn thành</span>';
        case 'partial': return '<span class="fee-badge fee-badge-partial">Thanh toán một phần</span>';
        case 'unpaid': return '<span class="fee-badge fee-badge-unpaid">Chưa thanh toán</span>';
        case 'overdue': return '<span class="fee-badge fee-badge-overdue">Quá hạn</span>';
        default: return '';
    }
}

// Render Main Table
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = statusFilter.value;
    const filterMonth = monthFilter.value;

    const filtered = feesData.filter(fee => {
        const matchSearch = fee.name.toLowerCase().includes(searchTerm) || fee.id.toLowerCase().includes(searchTerm);
        const matchStatus = filterStatus === 'all' || fee.status === filterStatus;
        const matchMonth = filterMonth === 'all' || fee.period === filterMonth;
        return matchSearch && matchStatus && matchMonth;
    });

    tbody.innerHTML = '';
    
    // Reset checkAll if filtered is empty or sizes differ
    let allChecked = filtered.length > 0;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy hóa đơn</td></tr>`;
        checkAllInput.checked = false;
        updateCheckboxes();
        return;
    }

    filtered.forEach(fee => {
        const tr = document.createElement('tr');
        if (selectedFeeId === fee.id) {
            tr.style.backgroundColor = 'var(--bg-color)';
        }

        const isChecked = checkedIds.has(fee.id);
        if (!isChecked) allChecked = false;

        const remainStyle = (fee.status !== 'completed') ? 'color: #ef4444; font-weight: 600;' : '';

        tr.innerHTML = `
            <td class="checkbox-cell" onclick="event.stopPropagation()">
                <input type="checkbox" class="row-checkbox" value="${fee.id}" ${isChecked ? 'checked' : ''} onchange="toggleCheck('${fee.id}')">
            </td>
            <td style="color: var(--text-muted); cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${fee.id}</td>
            <td style="font-weight: 500; cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${fee.name}</td>
            <td style="cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${fee.period}</td>
            <td style="text-align: right; cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${formatCurrency(fee.total)}</td>
            <td style="text-align: right; color: #10b981; cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${formatCurrency(fee.paid)}</td>
            <td style="text-align: right; ${remainStyle} cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${formatCurrency(fee.remain)}</td>
            <td style="cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${fee.deadline}</td>
            <td style="cursor: pointer;" onclick="openDetailPanel('${fee.id}')">${getStatusBadge(fee.status)}</td>
        `;
        tbody.appendChild(tr);
    });

    checkAllInput.checked = allChecked;
    updateCheckboxes();
}

function updateStats() {
    const totalCount = feesData.length;
    const completed = feesData.filter(f => f.status === 'completed').length;
    const partial = feesData.filter(f => f.status === 'partial').length;
    const unpaid = feesData.filter(f => f.status === 'unpaid').length;
    const overdue = feesData.filter(f => f.status === 'overdue').length;

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-partial').textContent = partial;
    document.getElementById('stat-unpaid').textContent = unpaid;
    document.getElementById('stat-overdue').textContent = overdue;

    const actualRev = feesData.reduce((sum, f) => sum + f.paid, 0);
    const expectedRev = feesData.reduce((sum, f) => sum + f.total, 0);

    document.getElementById('stat-revenue-actual').textContent = formatCurrency(actualRev);
    document.getElementById('stat-revenue-expected').textContent = formatCurrency(expectedRev);
}

// Checkbox Logic
function toggleCheck(id) {
    if (checkedIds.has(id)) {
        checkedIds.delete(id);
    } else {
        checkedIds.add(id);
    }
    renderTable(); 
}

function toggleCheckAll() {
    const isChecked = checkAllInput.checked;
    // Only toggle the visible filtered ones
    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = statusFilter.value;
    const filterMonth = monthFilter.value;

    const filtered = feesData.filter(fee => {
        const matchSearch = fee.name.toLowerCase().includes(searchTerm) || fee.id.toLowerCase().includes(searchTerm);
        const matchStatus = filterStatus === 'all' || fee.status === filterStatus;
        const matchMonth = filterMonth === 'all' || fee.period === filterMonth;
        return matchSearch && matchStatus && matchMonth;
    });

    if (isChecked) {
        filtered.forEach(fee => checkedIds.add(fee.id));
    } else {
        filtered.forEach(fee => checkedIds.delete(fee.id));
    }
    renderTable();
}

function updateCheckboxes() {
    // If any unpaid/partial/overdue is checked, enable Remind button
    const hasUnpaidChecked = Array.from(checkedIds).some(id => {
        const fee = feesData.find(f => f.id === id);
        return fee && fee.status !== 'completed';
    });

    btnRemindAll.disabled = !hasUnpaidChecked;
}

// Right Panel Logic
function openDetailPanel(id) {
    selectedFeeId = id;
    const fee = feesData.find(f => f.id === id);
    if (!fee) return;

    // Badge
    document.getElementById('detail-badge-container').innerHTML = getStatusBadge(fee.status);
    
    // Avatar & Name
    const initials = fee.name.split(' ').map(w => w[0]).join('').slice(-2).toUpperCase();
    document.getElementById('detail-avatar').textContent = initials;
    document.getElementById('detail-name').textContent = fee.name;
    document.getElementById('detail-id').textContent = `Mã hóa đơn: ${fee.id}`;

    // Summary
    document.getElementById('detail-total').textContent = formatCurrency(fee.total);
    document.getElementById('detail-paid').textContent = formatCurrency(fee.paid);
    document.getElementById('detail-remain').textContent = formatCurrency(fee.remain);

    // History mock
    const historyList = document.getElementById('detail-history-list');
    historyList.innerHTML = '';
    if (fee.paid > 0) {
        historyList.innerHTML = `
            <div class="history-item">
                <div class="history-top">
                    <span class="history-date">01/07/2026 14:30</span>
                    <span class="history-amount">+${formatCurrency(fee.paid)}</span>
                </div>
                <div class="history-method">Chuyển khoản (Techcombank)</div>
            </div>
        `;
    } else {
        historyList.innerHTML = `<div style="padding: 12px 0; color: var(--text-muted); font-size: 0.85rem;">Chưa có lịch sử thanh toán</div>`;
    }

    // Actions
    const payBtn = document.getElementById('btn-pay-action');
    if (fee.status === 'completed') {
        payBtn.style.display = 'none';
    } else {
        payBtn.style.display = 'block';
    }

    rightPanel.style.width = '420px';
    rightPanel.style.opacity = '1';
    
    // Need to trigger reflow for animation if container is flex
    renderTable(); // Re-render to highlight row
}

function closeDetailPanel() {
    selectedFeeId = null;
    rightPanel.style.width = '0';
    rightPanel.style.opacity = '0';
    renderTable(); 
}

// Payment Modal Logic
function openPaymentModal() {
    if (!selectedFeeId) return;
    const fee = feesData.find(f => f.id === selectedFeeId);
    if (!fee) return;

    document.getElementById('pay-modal-subtitle').textContent = `${fee.id} - ${fee.name}`;
    document.getElementById('pay-total').textContent = formatCurrency(fee.total);
    document.getElementById('pay-paid').textContent = formatCurrency(fee.paid);
    
    // Reset discount
    document.getElementById('discount-days').value = 0;
    
    calculateDiscount(); // this will set pay-remain and input value

    document.getElementById('payment-modal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function calculateDiscount() {
    if (!selectedFeeId) return;
    const fee = feesData.find(f => f.id === selectedFeeId);
    if (!fee) return;

    let days = parseInt(document.getElementById('discount-days').value) || 0;
    if (days < 0) days = 0;
    if (days > 3) days = 3;
    document.getElementById('discount-days').value = days;

    const discountAmount = days * BASE_DISCOUNT_PER_DAY;
    
    const currentRemain = fee.total - fee.paid - (fee.discount || 0) - discountAmount;
    
    document.getElementById('pay-remain').textContent = formatCurrency(currentRemain > 0 ? currentRemain : 0);
    
    const inputAmount = document.getElementById('pay-amount-input');
    inputAmount.value = formatCurrency(currentRemain > 0 ? currentRemain : 0);
    
    validatePaymentInput(currentRemain > 0 ? currentRemain : 0);
}

function validatePaymentInput(maxAllowed) {
    const input = document.getElementById('pay-amount-input');
    const errorMsg = document.getElementById('pay-amount-error');
    
    let currentVal = parseCurrency(input.value);
    
    if (maxAllowed === undefined) {
        const fee = feesData.find(f => f.id === selectedFeeId);
        let days = parseInt(document.getElementById('discount-days').value) || 0;
        const discountAmount = days * BASE_DISCOUNT_PER_DAY;
        maxAllowed = fee.total - fee.paid - (fee.discount || 0) - discountAmount;
    }
    
    if (input.value !== '') {
        input.value = currentVal.toLocaleString('vi-VN');
    }

    if (currentVal > maxAllowed && maxAllowed > 0) {
        errorMsg.style.display = 'block';
        return false;
    } else {
        errorMsg.style.display = 'none';
        return true;
    }
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    if (!selectedFeeId) return;
    
    const feeIndex = feesData.findIndex(f => f.id === selectedFeeId);
    if (feeIndex === -1) return;

    if (!validatePaymentInput()) {
        return;
    }

    let inputValStr = document.getElementById('pay-amount-input').value;
    let payAmount = parseCurrency(inputValStr);
    
    if (payAmount <= 0) {
        showToast('Số tiền thanh toán phải lớn hơn 0', 'error');
        return;
    }

    let days = parseInt(document.getElementById('discount-days').value) || 0;
    const discountAmount = days * BASE_DISCOUNT_PER_DAY;

    let fee = feesData[feeIndex];
    fee.paid += payAmount;
    fee.discount = (fee.discount || 0) + discountAmount;
    
    let newRemain = fee.total - fee.paid - fee.discount;

    if (newRemain <= 0) {
        newRemain = 0;
        fee.status = 'completed';
    } else {
        fee.status = 'partial';
    }

    fee.remain = newRemain;

    closePaymentModal();
    showToast('Đã ghi nhận thanh toán thành công', 'success');
    
    renderTable();
    updateStats();
    openDetailPanel(selectedFeeId); // refresh panel
}

// Reminder Modal Logic
function openRemindModal() {
    if (checkedIds.size === 0) return;

    const listContainer = document.getElementById('remind-list-container');
    listContainer.innerHTML = '';
    
    let validCount = 0;

    checkedIds.forEach(id => {
        const fee = feesData.find(f => f.id === id);
        if (fee && fee.status !== 'completed') {
            validCount++;
            
            let statusText = 'Quá hạn';
            let statusColor = '#ef4444'; // red
            if (fee.status === 'partial') { statusText = 'Thanh toán một phần'; statusColor = '#3b82f6'; }
            else if (fee.status === 'unpaid') { statusText = 'Chưa thanh toán'; statusColor = '#64748b'; }

            listContainer.innerHTML += `
                <div class="reminder-item">
                    <div class="rem-info">
                        <strong>${fee.name}</strong>
                        <span>Mã HĐ: ${fee.id} &bull; <span class="rem-debt">Còn lại: ${formatCurrency(fee.remain)}</span></span>
                        <span>Hạn thanh toán: ${fee.deadline}</span>
                    </div>
                    <div class="fee-badge" style="background-color: #f1f5f9; color: ${statusColor}; font-size: 0.75rem;">
                        ${statusText}
                    </div>
                </div>
            `;
        }
    });

    if (validCount === 0) return;

    document.getElementById('remind-modal-subtitle').textContent = `Hóa đơn học phí kỳ ${monthFilter.value} - ${validCount} hóa đơn được chọn`;
    document.getElementById('remind-modal').classList.add('active');
}

function closeRemindModal() {
    document.getElementById('remind-modal').classList.remove('active');
}

function sendReminders() {
    closeRemindModal();
    
    // Clear selections after sending
    checkedIds.clear();
    checkAllInput.checked = false;
    renderTable();
    
    showToast('Đã gửi thông báo thành công', 'success');
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

// Create Invoice Logic
function openCreateInvoiceModal() {
    document.getElementById('create-invoice-form').reset();
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 10);
    document.getElementById('ci-deadline').value = deadline.toISOString().split('T')[0];
    
    document.getElementById('create-invoice-modal').classList.add('active');
}

function closeCreateInvoiceModal() {
    document.getElementById('create-invoice-modal').classList.remove('active');
}

function handleCreateInvoice(e) {
    e.preventDefault();
    
    const studentName = document.getElementById('ci-student').value;
    const period = document.getElementById('ci-period').value;
    const deadlineVal = document.getElementById('ci-deadline').value;
    let amountValStr = document.getElementById('ci-amount').value;
    let total = parseCurrency(amountValStr);
    
    if (total <= 0) {
        showToast('Số tiền học phí phải lớn hơn 0', 'error');
        return;
    }
    
    const parts = deadlineVal.split('-');
    const deadline = `${parts[2]}/${parts[1]}/${parts[0]}`; 

    const newId = `HD00${feesData.length + 1}`;
    
    feesData.unshift({
        id: newId,
        name: studentName,
        period: period,
        total: total,
        paid: 0,
        discount: 0,
        remain: total,
        deadline: deadline,
        status: 'unpaid'
    });
    
    closeCreateInvoiceModal();
    showToast('Tạo hóa đơn học phí thành công', 'success');
    
    populateMonthFilter(); 
    renderTable();
    updateStats();
}

// Run init on load
window.addEventListener('DOMContentLoaded', init);

