var conversions = [];

function valid_unicode(i) {
    return /^[0-9A-Fa-f]{4,6}$/u.test(i);
}

function convert() {
    var unicodeInput = document.getElementById('unicode').value;
    if (!unicodeInput || !valid_unicode(unicodeInput)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid Unicode character!'
        });
        return;
    }

    var codepoint = parseInt(unicodeInput, 16);
    var utf8 = convertToUTF8(codepoint);
    var utf16 = convertToUTF16(codepoint);

    document.getElementById('utf8').value = utf8;
    document.getElementById('utf16').value = utf16;
    document.getElementById('utf32').value = '0x' + codepoint.toString(16).padStart(8, '0');

    conversions.push({
        unicode: unicodeInput,
        utf8: utf8,
        utf16: utf16,
        utf32: '0x' + codepoint.toString(16).padStart(8, '0')
    });

    updateRecommendations();
}

function updateRecommendations() {
    var recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    var uniqueRecommendations = new Set();

    conversions.forEach(function(conv) {
        if (!uniqueRecommendations.has(conv.unicode)) {
            var recommendation = document.createElement('div');
            recommendation.className = 'recommendation';
            recommendation.textContent = 'Unicode: ' + conv.unicode + ' | UTF-8: ' + conv.utf8 + ' | UTF-16: ' + conv.utf16 + ' | UTF-32: ' + conv.utf32;
            recommendation.onclick = function() {
                document.getElementById('unicode').value = conv.unicode;
                document.getElementById('utf8').value = conv.utf8;
                document.getElementById('utf16').value = conv.utf16;
                document.getElementById('utf32').value = conv.utf32;
            };

            recommendationsDiv.appendChild(recommendation);
            uniqueRecommendations.add(conv.unicode);
        }
    });
}

function convertToUTF8(codepoint) {
    if (codepoint <= 0x7F) {
        return '0x' + codepoint.toString(16).padStart(2, '0');
    } else if (codepoint <= 0x7FF) {
        return '0x' + ((codepoint >> 6) + 0xC0).toString(16).padStart(2, '0') + ' ' + ((codepoint & 0x3F) + 0x80).toString(16).padStart(2, '0');
    } else if (codepoint <= 0xFFFF) {
        return '0x' + ((codepoint >> 12) + 0xE0).toString(16).padStart(2, '0') + ' ' + (((codepoint >> 6) & 0x3F) + 0x80).toString(16).padStart(2, '0') + ' ' + ((codepoint & 0x3F) + 0x80).toString(16).padStart(2, '0');
    } else {
        return '0x' + ((codepoint >> 18) + 0xF0).toString(16).padStart(2, '0') + ' ' + (((codepoint >> 12) & 0x3F) + 0x80).toString(16).padStart(2, '0') + ' ' + (((codepoint >> 6) & 0x3F) + 0x80).toString(16).padStart(2, '0') + ' ' + ((codepoint & 0x3F) + 0x80).toString(16).padStart(2, '0');
    }
}

function convertToUTF16(codepoint) {
    if (codepoint <= 0xFFFF) {
        return '0x' + codepoint.toString(16).padStart(4, '0');
    } else {
        var highSurrogate = Math.floor((codepoint - 0x10000) / 0x400) + 0xD800;
        var lowSurrogate = (codepoint - 0x10000) % 0x400 + 0xDC00;
        return '0x' + highSurrogate.toString(16).padStart(4, '0') + ' ' + lowSurrogate.toString(16).padStart(4, '0');
    }
}