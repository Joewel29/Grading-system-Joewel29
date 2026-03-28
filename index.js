let editIndex = null;

// Live student display
document.getElementById('studentName').addEventListener('input', function() {
    document.getElementById('displayName').innerText = this.value || '-';
});
document.getElementById('studentSection').addEventListener('input', function() {
    document.getElementById('displaySection').innerText = this.value || '-';
});

// Grade weights
const weights = [20, 30, 10, 10, 30];

function getRemark(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 85) return 'Very Good';
    if (score >= 80) return 'Good';
    if (score >= 75) return 'Passed';
    if (score >= 70) return 'Fair';
    return 'Failed';
}

function calculateAverage() {
    const scores = document.querySelectorAll('.score');
    const weightedCells = document.querySelectorAll('.weighted');
    const remarks = document.querySelectorAll('.remark');
    let totalWeighted = 0;
    let validCount = 0;

    scores.forEach((input, i) => {
        const score = parseFloat(input.value);
        if (!isNaN(score) && score >= 0 && score <= 100) {
            const weighted = (score * weights[i]) / 100;
            weightedCells[i].innerText = weighted.toFixed(2) + '%';
            remarks[i].innerText = getRemark(score);
            totalWeighted += weighted;
            validCount++;
        } else {
            weightedCells[i].innerText = '-';
            remarks[i].innerText = '';
        }
    });

    const total = validCount > 0 ? totalWeighted.toFixed(2) : 0;
    document.getElementById('average').innerText = `Total Grade: ${total}%`;

    const status = document.getElementById('resultStatus');
    status.innerHTML = total >= 75 
        ? `<span style='color:#00ff88;font-size:22px;font-weight:bold'>PASSED</span>`
        : `<span style='color:#ff4d4d;font-size:22px;font-weight:bold'>FAILED</span>`;
}

function saveRecord() {
    const name = document.getElementById('studentName').value.trim();
    const section = document.getElementById('studentSection').value.trim();
    if (!name || !section) return alert('Enter name & section.');

    const scores = Array.from(document.querySelectorAll('.score')).map(i => parseFloat(i.value) || 0);
    const totalText = document.getElementById('average').innerText.match(/[\d.]+/)?.[0] || 0;
    const total = parseFloat(totalText);

    const record = {
        name, section,
        quiz: scores[0], laboratory: scores[1], assignment: scores[2],
        attendance: scores[3], majorExam: scores[4], total
    };

    let records = JSON.parse(localStorage.getItem('records')) || [];
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
    showNotification('Saved!');
    resetForm();
}

function exportStudents() {
    const records = JSON.parse(localStorage.getItem('records')) || [];
    if (records.length === 0) return alert('No records to export.');

    // CSV
    const csv = [
        ['Name', 'Section', 'Quiz', 'Lab', 'Assign', 'Attend', 'Major', 'Total', 'Remark'],
        ...records.map(r => [
            r.name, r.section,
            r.quiz, r.laboratory, r.assignment, r.attendance, r.majorExam, r.total,
            getRemark(r.total)
        ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported to CSV!');
}

function resetForm() {
    document.querySelectorAll('#studentName, #studentSection, .score').forEach(el => el.value = '');
    document.querySelectorAll('.weighted, .remark').forEach(el => el.innerText = '');
    document.getElementById('displayName').innerText = document.getElementById('displaySection').innerText = '-';
    document.getElementById('average').innerText = 'Total Grade: 0.00%';
    document.getElementById('resultStatus').innerHTML = '';
}

function showNotification(msg, duration = 3000) {
    const notif = document.getElementById('notification');
    notif.textContent = msg;
    notif.style.opacity = '1';
    notif.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(-50%) translateY(50px)';
    }, duration);
}

window.onload = () => {}; // Init listeners already added
