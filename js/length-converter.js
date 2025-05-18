// Length converter functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeLengthConverter();
});

// Conversion factors to meters (base unit)
const conversionFactors = {
    m: 1, // meter (base unit)
    km: 1000, // kilometer
    cm: 0.01, // centimeter
    mm: 0.001, // millimeter
    ft: 0.3048, // foot
    in: 0.0254, // inch
    yd: 0.9144, // yard
    mi: 1609.344 // mile
};

// Unit display names
const unitNames = {
    m: 'meters',
    km: 'kilometers',
    cm: 'centimeters',
    mm: 'millimeters',
    ft: 'feet',
    in: 'inches',
    yd: 'yards',
    mi: 'miles'
};

function initializeLengthConverter() {
    // Set up event listeners
    document.getElementById('fromValue')?.addEventListener('input', handleConversion);
    document.getElementById('fromUnit')?.addEventListener('change', handleConversion);
    document.getElementById('toUnit')?.addEventListener('change', handleConversion);
    document.getElementById('swapBtn')?.addEventListener('click', swapUnits);

    // Initialize common conversions
    updateCommonConversions();
    // Initialize formula explanation
    updateFormulaExplanation();
}

function handleConversion() {
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    if (isNaN(fromValue)) {
        document.getElementById('toValue').value = '';
        document.getElementById('resultText').textContent = `0 ${unitNames[fromUnit]} = 0 ${unitNames[toUnit]}`;
        document.getElementById('additionalInfo').textContent = 'Enter a value to convert';
        return;
    }

    const result = convert(fromValue, fromUnit, toUnit);
    
    // Update result display
    document.getElementById('toValue').value = formatNumber(result);
    document.getElementById('resultText').textContent = 
        `${formatNumber(fromValue)} ${unitNames[fromUnit]} = ${formatNumber(result)} ${unitNames[toUnit]}`;
    
    // Update additional info
    updateAdditionalInfo(fromValue, fromUnit, result, toUnit);
    
    // Update formula explanation
    updateFormulaExplanation(fromValue, fromUnit, toUnit);
}

function convert(value, fromUnit, toUnit) {
    // Convert to meters first (base unit)
    const meters = value * conversionFactors[fromUnit];
    // Convert from meters to target unit
    return meters / conversionFactors[toUnit];
}

function formatNumber(number) {
    // Format number to appropriate decimal places
    if (Math.abs(number) >= 1000) {
        return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else if (Math.abs(number) >= 1) {
        return number.toLocaleString('en-US', { maximumFractionDigits: 4 });
    } else {
        return number.toLocaleString('en-US', { maximumSignificantDigits: 4 });
    }
}

function swapUnits() {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');

    // Swap unit selections
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    
    // Swap values if both exist
    if (fromValue.value && toValue.value) {
        [fromValue.value, toValue.value] = [toValue.value, fromValue.value];
    }

    // Update conversion
    handleConversion();
}

function updateCommonConversions() {
    const container = document.getElementById('commonConversions');
    const commonValues = [
        { from: 1, fromUnit: 'm', toUnit: 'ft' },
        { from: 1, fromUnit: 'km', toUnit: 'mi' },
        { from: 1, fromUnit: 'yd', toUnit: 'm' },
        { from: 1, fromUnit: 'in', toUnit: 'cm' }
    ];

    container.innerHTML = commonValues.map(conv => {
        const result = convert(conv.from, conv.fromUnit, conv.toUnit);
        return `
            <div class="col-md-6">
                <div class="conversion-item">
                    ${conv.from} ${unitNames[conv.fromUnit]} = 
                    ${formatNumber(result)} ${unitNames[conv.toUnit]}
                </div>
            </div>
        `;
    }).join('');
}

function updateFormulaExplanation(value = 1, fromUnit = 'm', toUnit = 'km') {
    const container = document.getElementById('formulaExplanation');
    const fromFactor = conversionFactors[fromUnit];
    const toFactor = conversionFactors[toUnit];

    let formula = '';
    if (fromUnit === toUnit) {
        formula = `No conversion needed - units are the same`;
    } else {
        formula = `
            <p>To convert from ${unitNames[fromUnit]} to ${unitNames[toUnit]}:</p>
            <ol>
                <li>Multiply the ${unitNames[fromUnit]} value by ${fromFactor} to get meters</li>
                <li>Divide the result by ${toFactor} to get ${unitNames[toUnit]}</li>
            </ol>
            <p class="mb-0"><strong>Formula:</strong> result = (value × ${fromFactor}) ÷ ${toFactor}</p>
        `;
    }

    container.innerHTML = formula;
}

function updateAdditionalInfo(fromValue, fromUnit, result, toUnit) {
    const container = document.getElementById('additionalInfo');
    
    // Add helpful context based on the conversion
    let info = '';
    if (fromUnit === toUnit) {
        info = 'Same unit - no conversion needed';
    } else if (result > 1000000 || result < 0.001) {
        info = 'Consider using a more appropriate unit for this measurement';
    } else {
        info = `Converted using standard ${unitNames[fromUnit]} to ${unitNames[toUnit]} conversion factors`;
    }
    
    container.textContent = info;
} 