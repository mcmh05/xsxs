
document.getElementById('gasForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 입력값 가져오기
    const pressure = document.getElementById('pressure').value;
    const volume = document.getElementById('volume').value;
    const moles = document.getElementById('moles').value;
    const temperature = document.getElementById('temperature').value;
    
    // 이상기체 상수 R = 8.314 J/(mol·K)
    const R = 8.314;
    
    // 결과 표시 영역
    const resultDiv = document.getElementById('result');
    
    // 입력된 값들을 배열로 정리
    const inputs = [
        { name: 'pressure', value: pressure, label: '압력 (P)', unit: 'Pa' },
        { name: 'volume', value: volume, label: '부피 (V)', unit: 'm³' },
        { name: 'moles', value: moles, label: '몰수 (n)', unit: 'mol' },
        { name: 'temperature', value: temperature, label: '온도 (T)', unit: 'K' }
    ];
    
    // 입력된 값과 비어있는 값 분리
    const filledInputs = inputs.filter(input => input.value !== '' && input.value !== null);
    const emptyInputs = inputs.filter(input => input.value === '' || input.value === null);
    
    // 정확히 3개의 값이 입력되었는지 확인
    if (filledInputs.length !== 3) {
        resultDiv.textContent = '정확히 3개의 값을 입력하고 1개 값은 비워두세요.';
        resultDiv.className = 'result error';
        clearCalculatedFields();
        return;
    }
    
    // 입력된 값들이 모두 양수인지 확인
    const hasNegativeValue = filledInputs.some(input => parseFloat(input.value) <= 0);
    if (hasNegativeValue) {
        resultDiv.textContent = '모든 값은 양수여야 합니다.';
        resultDiv.className = 'result error';
        clearCalculatedFields();
        return;
    }
    
    // 어떤 값을 계산해야 하는지 확인
    const unknownVariable = emptyInputs[0].name;
    let calculatedValue;
    let calculationFormula;
    
    // 입력된 값들을 숫자로 변환
    const p = pressure ? parseFloat(pressure) : null;
    const v = volume ? parseFloat(volume) : null;
    const n = moles ? parseFloat(moles) : null;
    const t = temperature ? parseFloat(temperature) : null;
    
    // PV = nRT에서 각 변수 계산
    switch(unknownVariable) {
        case 'pressure':
            // P = nRT / V
            calculatedValue = (n * R * t) / v;
            calculationFormula = `P = nRT / V = (${n} × ${R} × ${t}) / ${v}`;
            break;
        case 'volume':
            // V = nRT / P
            calculatedValue = (n * R * t) / p;
            calculationFormula = `V = nRT / P = (${n} × ${R} × ${t}) / ${p}`;
            break;
        case 'moles':
            // n = PV / (RT)
            calculatedValue = (p * v) / (R * t);
            calculationFormula = `n = PV / (RT) = (${p} × ${v}) / (${R} × ${t})`;
            break;
        case 'temperature':
            // T = PV / (nR)
            calculatedValue = (p * v) / (n * R);
            calculationFormula = `T = PV / (nR) = (${p} × ${v}) / (${n} × ${R})`;
            break;
    }
    
    // 계산된 값이 유효한지 확인
    if (isNaN(calculatedValue) || calculatedValue <= 0) {
        resultDiv.textContent = '계산 결과가 올바르지 않습니다. 입력값을 확인해주세요.';
        resultDiv.className = 'result error';
        clearCalculatedFields();
        return;
    }
    
    // 계산된 값을 해당 입력 필드에 표시
    const targetInput = document.getElementById(unknownVariable);
    targetInput.value = calculatedValue.toFixed(6);
    targetInput.classList.add('calculated');
    
    // 결과 표시
    const unknownLabel = emptyInputs[0].label;
    const unknownUnit = emptyInputs[0].unit;
    
    resultDiv.innerHTML = `
        <strong>계산 완료!</strong><br>
        ${unknownLabel} = ${calculatedValue.toFixed(6)} ${unknownUnit}<br>
        <div class="calculation-info">
            계산식: ${calculationFormula}<br>
            결과: ${calculatedValue.toFixed(6)} ${unknownUnit}
        </div>
    `;
    resultDiv.className = 'result success';
});

// 계산된 필드 스타일 초기화 함수
function clearCalculatedFields() {
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('calculated');
    });
}

// 입력값이 변경될 때마다 결과 초기화
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = '';
        resultDiv.className = 'result';
        clearCalculatedFields();
    });
});

// 폼 초기화 버튼 (선택사항)
function resetForm() {
    document.getElementById('gasForm').reset();
    document.getElementById('result').textContent = '';
    document.getElementById('result').className = 'result';
    clearCalculatedFields();
}
